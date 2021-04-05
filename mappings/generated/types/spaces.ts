import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@dzlzv/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import { AccountId } from "@polkadot/types/interfaces";
import {
  Content,
  SpaceId,
  SpacePermissions,
  SpaceUpdate
} from "@subsocial/types/substrate/interfaces";
import { Bytes, Option } from "@polkadot/types";

export namespace Spaces {
  export class SpaceCreatedEvent {
    public readonly expectedParamTypes = ["AccountId", "SpaceId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get data(): SpaceCreated_Params {
      return new SpaceCreated_Params(this.ctx);
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

  class SpaceCreated_Params {
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
  export class SpaceUpdatedEvent {
    public readonly expectedParamTypes = ["AccountId", "SpaceId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get data(): SpaceUpdated_Params {
      return new SpaceUpdated_Params(this.ctx);
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

  class SpaceUpdated_Params {
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

  export class CreateSpaceCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = [
      "Option<SpaceId>",
      "Option<Bytes>",
      "Content",
      "Option<SpacePermissions>"
    ];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): CreateSpace_Args {
      return new CreateSpace_Args(this.extrinsic);
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

  class CreateSpace_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get parentIdOpt(): Option<SpaceId> {
      return createTypeUnsafe<Option<SpaceId> & Codec>(
        typeRegistry,
        "Option<SpaceId>",
        [this.extrinsic.args[0].value]
      );
    }

    get handleOpt(): Option<Bytes> {
      return createTypeUnsafe<Option<Bytes> & Codec>(
        typeRegistry,
        "Option<Bytes>",
        [this.extrinsic.args[1].value]
      );
    }

    get content(): Content {
      return createTypeUnsafe<Content & Codec>(typeRegistry, "Content", [
        this.extrinsic.args[2].value
      ]);
    }

    get permissionsOpt(): Option<SpacePermissions> {
      return createTypeUnsafe<Option<SpacePermissions> & Codec>(
        typeRegistry,
        "Option<SpacePermissions>",
        [this.extrinsic.args[3].value]
      );
    }
  }
  export class UpdateSpaceCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = ["SpaceId", "SpaceUpdate"];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): UpdateSpace_Args {
      return new UpdateSpace_Args(this.extrinsic);
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

  class UpdateSpace_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get spaceId(): SpaceId {
      return createTypeUnsafe<SpaceId & Codec>(typeRegistry, "SpaceId", [
        this.extrinsic.args[0].value
      ]);
    }

    get update(): SpaceUpdate {
      return createTypeUnsafe<SpaceUpdate & Codec>(
        typeRegistry,
        "SpaceUpdate",
        [this.extrinsic.args[1].value]
      );
    }
  }
}
