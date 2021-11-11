/*

Dedicated node service for handling custom backend routes that also has access to the Hardhat instance.

Hardhat: In ../server/package.json and ../autotasks/package.json we using the "--network localhost" arguments to start a Hardhat Network, and expose it as a JSON-RPC and WebSocket server
https://hardhat.org/hardhat-network/#running-stand-alone-in-order-to-support-wallets-and-other-software

New routes: be sure to update the webpack proxy
packages/client/config-overrides.js

*/
import {assertNonNullable, findEnvLocal} from "@goldfinch-eng/utils"
import dotenv from "dotenv"
dotenv.config({path: findEnvLocal()})

import express from "express"
import cors from "cors"
import {relayHandler, uniqueIdentitySignerHandler} from "@goldfinch-eng/autotasks"
import BN from "bn.js"

import {fundWithWhales} from "@goldfinch-eng/protocol/blockchain_scripts/mainnetForkingHelpers"
import setUpForTesting from "@goldfinch-eng/protocol/deploy/setUpForTesting"
import {hardhat as hre} from "@goldfinch-eng/protocol"
import admin, {firestore} from "firebase-admin"

import {getDb, getUsers} from "@goldfinch-eng/functions/db"

const app = express()
app.use(express.json())
app.use(cors())

assertNonNullable(
  process.env.RELAY_SERVER_PORT,
  "RELAY_SERVER_PORT must be passed as an envvar when running the development server"
)
const port = process.env.RELAY_SERVER_PORT

app.post("/relay", relayHandler)
app.post("/uniqueIdentitySigner", uniqueIdentitySignerHandler)

app.post("/fundWithWhales", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).send({message: "fundWithWhales only available on local and murmuration"})
  }

  const {address} = req.body
  await fundWithWhales(["USDT", "BUSD", "ETH", "USDC"], [address], new BN("75000"))
  return res.status(200).send({status: "success", result: JSON.stringify({success: true})})
})

app.post("/setupForTesting", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).send({message: "setupForTesting only available on local and murmuration"})
  }
  const {address} = req.body

  try {
    await setUpForTesting(hre, {
      overrideAddress: address,
    })
  } catch (e) {
    return res.status(404).send({message: "setupForTesting error"})
  }

  return res.status(200).send({status: "success", result: JSON.stringify({success: true})})
})

admin.initializeApp({projectId: "goldfinch-frontends-dev"})

app.post("/kycStatus", async (req, res) => {
  if (process.env.NODE_ENV === "production" || process.env.MURMURATION) {
    return res.status(404).send({message: "kycStatus only available on local"})
  }

  const {address, countryCode, kycStatus} = req.body
  const db = getDb(admin.firestore())
  const userRef = getUsers(admin.firestore()).doc(`${address.toLowerCase()}`)

  try {
    await db.runTransaction(async (t: firestore.Transaction) => {
      const doc = await t.get(userRef)
      console.log(doc.data())

      if (doc.exists) {
        t.update(userRef, {
          persona: {
            id: "fake",
            status: kycStatus,
          },
          countryCode: countryCode,
          updatedAt: Date.now(),
        })
      } else {
        t.set(userRef, {
          address: address,
          persona: {
            id: "fake",
            status: kycStatus,
          },
          countryCode: countryCode,
          updatedAt: Date.now(),
        })
      }
    })
  } catch (e) {
    console.error(e)
    return res.status(500).send({status: "error", message: (e as Error)?.message})
  }

  return res.status(200).send({status: "success"})
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})