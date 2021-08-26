import { DeployOptions, DeployResult } from "hardhat-deploy/types"
import { Fidu, GoldfinchConfig } from "../typechain/ethers"

export type Logger = (...args: any[]) => void
export type DeployFn = (name: string, options: DeployOptions) => Promise<DeployResult>
export type DeployOpts = {config: GoldfinchConfig; fidu?: Fidu}