const hre = require("hardhat")

const BORROWER = "0x2D0113824068e9c5fc106772abC583BF8e19597A"
const GOLDFINCH_FACTORY = "0xc2872Dc1AC3da8e8074685b86Fb80522182Ef564"
const JUNIOR_FEE_PERCENT = "20"
const LIMIT = "10000000000"
const INTEREST_APR = "50000000000000000" // 5% APR
const PAYMENT_PERIOD_IN_DAYS = "10"
const TERM_IN_DAYS = "365"
const LATE_FEE_APR = "0"
const PRINCIPAL_GRACE_PERIOD_IN_DAYS = "185"
const FUNDABLE_AT = "0"
const ALLOWED_UID = [0]

async function main() {
  const GoldfinchFactory = await hre.ethers.getContractFactory("GoldfinchFactory")
  const factory = await GoldfinchFactory.attach(GOLDFINCH_FACTORY)
  const receipt = await factory.createPool(
    BORROWER,
    JUNIOR_FEE_PERCENT,
    LIMIT,
    INTEREST_APR,
    PAYMENT_PERIOD_IN_DAYS,
    TERM_IN_DAYS,
    LATE_FEE_APR,
    PRINCIPAL_GRACE_PERIOD_IN_DAYS,
    FUNDABLE_AT,
    ALLOWED_UID
  )
  const result = await receipt.wait()
  console.log(result)
  const address = getPoolAddress(result)
  console.log(address)
}

function getPoolAddress(result) {
  const events = result.events
  const lastEvent = events[events.length - 1]
  return lastEvent.args[0]
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
