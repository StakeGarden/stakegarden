import { StakeGardenPool as StakeGardenPoolTemplate } from "../../generated/templates";
import { StakeGardenPoolFactory } from "../../generated/schema";
import { PoolCreated } from "../../generated/StakeGardenPoolFactory/StakeGardenPoolFactory";

// This handler is called by block handlers
export function handlePoolCreated(event: PoolCreated): void {
  let stakeGardenPoolFactory = StakeGardenPoolFactory.load("1");

  if (stakeGardenPoolFactory === null) {
    stakeGardenPoolFactory = new StakeGardenPoolFactory("1");
    stakeGardenPoolFactory.address = event.address;
    stakeGardenPoolFactory.orderCount = 0;
  }

  stakeGardenPoolFactory.orderCount = stakeGardenPoolFactory.orderCount + 1;
  stakeGardenPoolFactory.save();

  // Create a new StakeGardenPool entity
  StakeGardenPoolTemplate.create(event.params.poolAddress);
}
