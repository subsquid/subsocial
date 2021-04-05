import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@dzlzv/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import { AccountId } from "@polkadot/types/interfaces";
import {
  PostId,
  ReactionId,
  ReactionKind
} from "@subsocial/types/substrate/interfaces";

export namespace Reactions {
  export class PostReactionCreatedEvent {
    public readonly expectedParamTypes = ["AccountId", "PostId", "ReactionId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get data(): PostReactionCreated_Params {
      return new PostReactionCreated_Params(this.ctx);
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  class PostReactionCreated_Params {
    constructor(public readonly ctx: SubstrateEvent) {}

    get accountId(): AccountId {
      return createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
        this.ctx.params[0].value
      ]);
    }

    get postId(): PostId {
      return createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
        this.ctx.params[1].value
      ]);
    }

    get reactionId(): ReactionId {
      return createTypeUnsafe<ReactionId & Codec>(typeRegistry, "ReactionId", [
        this.ctx.params[2].value
      ]);
    }
  }
  export class PostReactionUpdatedEvent {
    public readonly expectedParamTypes = ["AccountId", "PostId", "ReactionId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get data(): PostReactionUpdated_Params {
      return new PostReactionUpdated_Params(this.ctx);
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  class PostReactionUpdated_Params {
    constructor(public readonly ctx: SubstrateEvent) {}

    get accountId(): AccountId {
      return createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
        this.ctx.params[0].value
      ]);
    }

    get postId(): PostId {
      return createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
        this.ctx.params[1].value
      ]);
    }

    get reactionId(): ReactionId {
      return createTypeUnsafe<ReactionId & Codec>(typeRegistry, "ReactionId", [
        this.ctx.params[2].value
      ]);
    }
  }
  export class PostReactionDeletedEvent {
    public readonly expectedParamTypes = ["AccountId", "PostId", "ReactionId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get data(): PostReactionDeleted_Params {
      return new PostReactionDeleted_Params(this.ctx);
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  class PostReactionDeleted_Params {
    constructor(public readonly ctx: SubstrateEvent) {}

    get accountId(): AccountId {
      return createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
        this.ctx.params[0].value
      ]);
    }

    get postId(): PostId {
      return createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
        this.ctx.params[1].value
      ]);
    }

    get reactionId(): ReactionId {
      return createTypeUnsafe<ReactionId & Codec>(typeRegistry, "ReactionId", [
        this.ctx.params[2].value
      ]);
    }
  }

  export class CreatePostReactionCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = ["PostId", "ReactionKind"];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): CreatePostReaction_Args {
      return new CreatePostReaction_Args(this.extrinsic);
    }

    validateArgs(): boolean {
      if (this.expectedArgTypes.length !== this.extrinsic.args.length) {
        return false;
      }
      let valid = true;
      this.expectedArgTypes.forEach((type, i) => {
        if (type !== this.extrinsic.args[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  class CreatePostReaction_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get postId(): PostId {
      return createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
        this.extrinsic.args[0].value
      ]);
    }

    get kind(): ReactionKind {
      return createTypeUnsafe<ReactionKind & Codec>(
        typeRegistry,
        "ReactionKind",
        [this.extrinsic.args[1].value]
      );
    }
  }
  export class UpdatePostReactionCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = ["PostId", "ReactionId", "ReactionKind"];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): UpdatePostReaction_Args {
      return new UpdatePostReaction_Args(this.extrinsic);
    }

    validateArgs(): boolean {
      if (this.expectedArgTypes.length !== this.extrinsic.args.length) {
        return false;
      }
      let valid = true;
      this.expectedArgTypes.forEach((type, i) => {
        if (type !== this.extrinsic.args[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  class UpdatePostReaction_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get postId(): PostId {
      return createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
        this.extrinsic.args[0].value
      ]);
    }

    get reactionId(): ReactionId {
      return createTypeUnsafe<ReactionId & Codec>(typeRegistry, "ReactionId", [
        this.extrinsic.args[1].value
      ]);
    }

    get newKind(): ReactionKind {
      return createTypeUnsafe<ReactionKind & Codec>(
        typeRegistry,
        "ReactionKind",
        [this.extrinsic.args[2].value]
      );
    }
  }
  export class DeletePostReactionCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = ["PostId", "ReactionId"];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): DeletePostReaction_Args {
      return new DeletePostReaction_Args(this.extrinsic);
    }

    validateArgs(): boolean {
      if (this.expectedArgTypes.length !== this.extrinsic.args.length) {
        return false;
      }
      let valid = true;
      this.expectedArgTypes.forEach((type, i) => {
        if (type !== this.extrinsic.args[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  class DeletePostReaction_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get postId(): PostId {
      return createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
        this.extrinsic.args[0].value
      ]);
    }

    get reactionId(): ReactionId {
      return createTypeUnsafe<ReactionId & Codec>(typeRegistry, "ReactionId", [
        this.extrinsic.args[1].value
      ]);
    }
  }
}
