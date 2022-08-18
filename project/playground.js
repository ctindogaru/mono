let deployedABIs = require("./all_dev.json");

let Contract = require('web3-eth-contract');
Contract.setProvider('wss://wss.api.moonbase.moonbeam.network');

let jsonInterface = deployedABIs["1287"]["moonbeam"].contracts["StakingRewards"].abi;
let contract = new Contract(jsonInterface, '0xf1a518fAA57463F3BB187a21491c2d080D95dC08');

const main = async () => {
  let result = await contract.getPastEvents("Staked", {filter: {tokenId: ['0']}, fromBlock: "earliest", toBlock: "latest"})
  console.log(result)
}

(async () => {
  await main();
})();
