/* eslint-disable no-console */
import fs from "fs"
import path from "path"

import yaml from "js-yaml"

console.log("Updating subgraph-local.yaml")

const devDeployments = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../protocol/deployments/all_dev.json")).toString()
)

const fujiContracts = devDeployments["43113"].localhost.contracts
const deployedSeniorPoolProxyAddress = fujiContracts.SeniorPool_Proxy.address
const deployedGoldfinchFactoryProxyAddress = fujiContracts.GoldfinchFactory_Proxy.address
const deployedPoolProxyAddress = fujiContracts.Pool_Proxy.address
const deployedPoolTokensProxyAddress = fujiContracts.PoolTokens_Proxy.address
const deployedGoldfinchConfigAddress = fujiContracts.GoldfinchConfig.address
const deployedFiduAddress = fujiContracts.Fidu.address
const deployedGfiAddress = fujiContracts.GFI.address
const deployedStakingRewardsProxyAddress = fujiContracts.StakingRewards_Proxy.address
const deployedBackerRewardsProxyAddress = fujiContracts.BackerRewards_Proxy.address
const deployedOldFixedLeverageRatioStrategyAddress = fujiContracts.FixedLeverageRatioStrategy.address

const subgraphManifest: any = yaml.load(fs.readFileSync(path.resolve(".", "subgraph.yaml")).toString())

for (let dataSource of subgraphManifest.dataSources) {
  dataSource.network = "localhost"
  delete dataSource.source.startBlock
  switch (dataSource.name) {
    case "SeniorPoolProxy":
      dataSource.source.address = deployedSeniorPoolProxyAddress
      break
    case "GoldfinchFactoryProxy":
      dataSource.source.address = deployedGoldfinchFactoryProxyAddress
      break
    case "PoolProxy":
      dataSource.source.address = deployedPoolProxyAddress
      break
    case "PoolTokensProxy":
      dataSource.source.address = deployedPoolTokensProxyAddress
      break
    case "GFI":
      dataSource.source.address = deployedGfiAddress
      break
    case "StakingRewardsProxy":
      dataSource.source.address = deployedStakingRewardsProxyAddress
      break
    case "BackerRewardsProxy":
      dataSource.source.address = deployedBackerRewardsProxyAddress
      break
    default:
      break
  }
}

for (let dataSource of subgraphManifest.templates) {
  dataSource.network = "localhost"
}

const codeSnippet = `// It's OK if this file shows diffs. The only reason it's committed is to prevent "module not found" errors. Unfortunately it doesn't seem The Graph allows env vars for this kind of thing.
export const LOCALHOST_FIDU_ADDRESS = "${deployedFiduAddress}"
export const LOCALHOST_SENIOR_POOL_ADDRESS = "${deployedSeniorPoolProxyAddress}"
export const LOCALHOST_POOL_TOKENS_ADDRESS = "${deployedPoolTokensProxyAddress}"
export const LOCALHOST_GOLDFINCH_CONFIG_ADDRESS = "${deployedGoldfinchConfigAddress}"
export const LOCALHOST_OLD_FIXED_LEVERAGE_RATIO_STRATEGY_ADDRESS = "${deployedOldFixedLeverageRatioStrategyAddress}"
`

fs.writeFileSync(path.resolve(__dirname, "../subgraph-local.yaml"), yaml.dump(subgraphManifest, {lineWidth: -1}))
fs.writeFileSync(path.resolve(__dirname, "../src/localhost-addresses.ts"), codeSnippet)

console.log("Finished updating subgraph-local.yaml")
