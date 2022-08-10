import localhostAddresses from "./localhost.json";
import mainnetAddresses from "./mainnet.json";
import fujiAddresses from "./fuji.json";

export const CONTRACT_ADDRESSES: { [chainId: number]: Record<string, string> } =
  {
    1: mainnetAddresses,
    31337: localhostAddresses,
    43113: fujiAddresses,
  };
