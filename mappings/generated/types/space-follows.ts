import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@dzlzv/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import { AccountId } from "@polkadot/types/interfaces";
import { SpaceId } from "@subsocial/types/substrate/interfaces";

export namespace SpaceFollows {
  export class SpaceFollowedEvent {
    public readonly expectedParamTypes = ["AccountId", "SpaceId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get data(): SpaceFollowed_Params {
      return new SpaceFollowed_Params(this.ctx);
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

  class SpaceFollowed_Params {
    constructor(public readonly ctx: SubstrateEvent) {}

    get accountId(): AccountId {
      return createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
        this.ctx.params[0].value
      ]);
    }

    get spaceId(): SpaceId {
      return createTypeUnsafe<SpaceId & Codec>(typeRegistry, "SpaceId", [
        this.ctx.params[1].value
      ]);
    }
  }
  export class SpaceUnfollowedEvent {
    public readonly expectedParamTypes = ["AccountId", "SpaceId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get data(): SpaceUnfollowed_Params {
      return new SpaceUnfollowed_Params(this.ctx);
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

  class SpaceUnfollowed_Params {
    constructor(public readonly ctx: SubstrateEvent) {}

    get accountId(): AccountId {
      return createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
        this.ctx.params[0].value
      ]);
    }

    get spaceId(): SpaceId {
      return createTypeUnsafe<SpaceId & Codec>(typeRegistry, "SpaceId", [
        this.ctx.params[1].value
      ]);
    }
  }

  export class FollowSpaceCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = ["SpaceId"];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): FollowSpace_Args {
      return new FollowSpace_Args(this.extrinsic);
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

  class FollowSpace_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get spaceId(): SpaceId {
      return createTypeUnsafe<SpaceId & Codec>(typeRegistry, "SpaceId", [
        this.extrinsic.args[0].value
      ]);
    }
  }
  export class UnfollowSpaceCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = ["SpaceId"];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): UnfollowSpace_Args {
      return new UnfollowSpace_Args(this.extrinsic);
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

  class UnfollowSpace_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get spaceId(): SpaceId {
      return createTypeUnsafe<SpaceId & Codec>(typeRegistry, "SpaceId", [
        this.extrinsic.args[0].value
      ]);
    }
  }
}
