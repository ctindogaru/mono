import {GoldfinchConfig} from "@goldfinch-eng/protocol/typechain/ethers"
import {assertIsString} from "@goldfinch-eng/utils"
import {ContractDeployer, isTestEnv} from "../deployHelpers"
import {DeployEffects} from "../migrations/deployEffects"

export async function deployTranchedPool(
  deployer: ContractDeployer,
  {config, deployEffects}: {config: GoldfinchConfig; deployEffects: DeployEffects}
) {
  const logger = console.log
  const {gf_deployer} = await deployer.getNamedAccounts()

  logger("About to deploy TranchedPool...")
  let contractName = "TranchedPool"

  if (isTestEnv()) {
    contractName = "TestTranchedPool"
  }

  assertIsString(gf_deployer)
  const tranchingLogic = await deployer.deployLibrary("TranchingLogic", {from: gf_deployer, args: []})
  await new Promise((r) => setTimeout(r, 4000))
  const tranchedPoolImpl = await deployer.deploy(contractName, {
    from: gf_deployer,
    libraries: {["TranchingLogic"]: tranchingLogic.address},
  })
  await new Promise((r) => setTimeout(r, 4000))
  logger("Updating config...")
  await deployEffects.add({
    deferred: [await config.populateTransaction.setTranchedPoolImplementation(tranchedPoolImpl.address)],
  })
  await new Promise((r) => setTimeout(r, 4000))
  logger("Updated TranchedPoolImplementation config address to:", tranchedPoolImpl.address)
  return tranchedPoolImpl
}
