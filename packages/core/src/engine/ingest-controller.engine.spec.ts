import { DiscoveryService } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { IngestControllerEngine } from "./ingest-controller.engine";

describe("IngestControllerEngine", () => {
  let engine: IngestControllerEngine;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [IngestControllerEngine, DiscoveryService],
    }).compile();

    engine = module.get(IngestControllerEngine);
  });

  it("will be defined", () => {
    expect(engine).toBeDefined();
  });
});
