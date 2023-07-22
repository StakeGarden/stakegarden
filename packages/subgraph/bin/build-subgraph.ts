import { writeFile } from "fs/promises";
import { stringify as yamlStringify } from "yaml";

import { config } from "./config";

async function main() {
  // get network from command line
  const network = process.argv[2] as string | undefined;
  // validate network
  if (!network || !["mainnet", "polygon"].includes(network)) {
    throw new Error("Invalid network. Must be one of: mainnet, polygon");
  }

  const subgraph = {
    specVersion: "0.0.4",
    features: ["nonFatalErrors"],
    schema: {
      file: "./schema.graphql",
    },
    dataSources: [
      {
        name: "StakeGardenPoolFactory",
        kind: "ethereum/contract",
        network,
        source: {
          address: config[network].stakeFactory.address,
          startBlock: config[network].stakeFactory.startBlock,
          abi: "StakeGardenPoolFactory",
        },
        mapping: {
          kind: "ethereum/events",
          apiVersion: "0.0.6",
          language: "wasm/assemblyscript",
          file: "./src/mappings/factory.ts",
          entities: ["StakeGardenPoolFactory"],
          abis: [
            {
              name: "StakeGardenPoolFactory",
              file: "./abis/StakeGardenPoolFactory.json",
            },
          ],
          eventHandlers: [
            {
              event: "PoolCreated(address,string,string,address,uint256[])",
              handler: "handlePoolCreated",
            },
          ],
        },
      },
    ],
    templates: [
      {
        name: "DCAOrder",
        kind: "ethereum/contract",
        network,
        source: {
          abi: "DCAOrder",
        },
        mapping: {
          kind: "ethereum/events",
          apiVersion: "0.0.6",
          language: "wasm/assemblyscript",
          file: "./src/mappings/order.ts",
          entities: ["Order", "Token"],
          abis: [
            {
              name: "DCAOrder",
              file: "./abis/DCAOrder.json",
            },
            {
              name: "ERC20",
              file: "./abis/ERC20.json",
            },
          ],
          eventHandlers: [
            {
              event: "Initialized(indexed address)",
              handler: "handleDCAOrderInitialized",
            },
            {
              event: "Cancelled(indexed address)",
              handler: "handleDCAOrderCancelled",
            },
          ],
        },
      },
    ],
  };

  await writeFile(`./subgraph.yaml`, yamlStringify(subgraph));
}

main();
