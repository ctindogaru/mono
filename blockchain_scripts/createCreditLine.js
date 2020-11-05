const BN = require("bn.js")
const bre = require("@nomiclabs/buidler")
const {deployments, getNamedAccounts} = bre
const {USDCDecimals, getDeployedContract, interestAprAsBN} = require("../blockchain_scripts/deployHelpers.js")

async function main() {
  const {protocolOwner} = await getNamedAccounts()
  const creditDesk = await getDeployedContract(deployments, "CreditDesk", protocolOwner)
  const borrower = process.env.BORROWER
  if (!borrower) {
    throw new Error("No borrower provided. Please run again, passing borrower as BORROWER={{borrower_address}}")
  }

  await createCreditLineForBorrower(creditDesk, borrower)
}

async function createCreditLineForBorrower(creditDesk, borrower, logger = console.log) {
  logger("Trying to create an CreditLine for the Borrower...")
  const existingCreditLines = await creditDesk.getBorrowerCreditLines(borrower)
  if (existingCreditLines.length) {
    logger("We have already created a credit line for this borrower")
    return
  }

  logger("Creating a credit line for the borrower", borrower)
  const limit = String(new BN(10000).mul(USDCDecimals))
  const interestApr = String(interestAprAsBN("5.00"))
  const paymentPeriodInDays = String(new BN(30))
  const termInDays = String(new BN(360))
  await creditDesk.createCreditLine(borrower, limit, interestApr, paymentPeriodInDays, termInDays)
  logger("Created a credit line for the borrower", borrower)
}

if (require.main === module) {
  // If this is run as a script, then call main. If it's imported (for tests), this block will not run
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = createCreditLineForBorrower