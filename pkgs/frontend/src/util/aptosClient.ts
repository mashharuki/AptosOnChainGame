import {Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";

/**
 * create AptosClient method
 * @returns
 */
export function getAptosClient() {
  const config = new AptosConfig({network: Network.TESTNET});
  return new Aptos(config);
}
