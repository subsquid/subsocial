import { SubstrateProcessor } from "@subsquid/substrate-processor";
import * as envConfig from "./env";
import { lookupArchive } from "@subsquid/archive-registry";
import {
    postCreated,
    postUpdated,
    postShared,
    postReactionCreatedV1,
    postReactionUpdatedV1,
    postReactionDeletedV1,
    postReactionCreatedV2,
    postReactionUpdatedV2,
    postReactionDeletedV2,
    spaceCreated,
    spaceUpdated,
    spaceFollowed,
    spaceUnfollowed,
  } from './mappings'

const processor = new SubstrateProcessor("subsocial-processor");

processor.setBatchSize(envConfig.batchSize);

if (!envConfig.chainNode) {
    throw new Error("no CHAIN_NODE in env");
}

processor.setDataSource({
    archive: "https://subsocial.indexer.gc.subsquid.io/v4/graphql",
    chain: envConfig.chainNode,
});

// processor.setBlockRange({ from: 0, to: 0 });

processor.addEventHandler(
    "posts.PostCreated",
    postCreated,
);

processor.addEventHandler(
    "posts.PostUpdated",
    postUpdated,
);

processor.addEventHandler(
    "posts.PostShared",
    postShared,
);

processor.addEventHandler(
    "spaces.SpaceCreated",
    spaceCreated,
);

processor.addEventHandler(
    "spaces.SpaceUpdated",
    spaceUpdated,
);

processor.addEventHandler(
    "reactions.PostReactionCreated",
    {
        range: {
            from: 0,
            to: 14,
        }
    },
    postReactionCreatedV1,
);

processor.addEventHandler(
    "reactions.PostReactionUpdated",
    {
        range: {
            from: 0,
            to: 14,
        }
    },
    postReactionUpdatedV1,
);

processor.addEventHandler(
    "reactions.PostReactionDeleted",
    {
        range: {
            from: 0,
            to: 14,
        }
    },
    postReactionDeletedV1,
);

processor.addEventHandler(
    "reactions.PostReactionCreated",
    {
        range: {
            from: 15,
        }
    },
    postReactionCreatedV2,
);

processor.addEventHandler(
    "reactions.PostReactionUpdated",
    {
        range: {
            from: 15,
        }
    },
    postReactionUpdatedV2,
);

processor.addEventHandler(
    "reactions.PostReactionDeleted",
    {
        range: {
            from: 15,
        }
    },
    postReactionDeletedV2,
);

processor.addEventHandler(
    "spaceFollows.SpaceFollowed",
    spaceFollowed,
);

processor.addEventHandler(
    "spaceFollows.SpaceUnfollowed",
    spaceUnfollowed,
);
