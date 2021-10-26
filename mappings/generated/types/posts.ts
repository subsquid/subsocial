import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@joystream/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import { AccountId } from "@polkadot/types/interfaces";
import {
  Content,
  PostExtension,
  PostId,
  PostUpdate,
  SpaceId
} from "@subsocial/types/substrate/interfaces";
import { Option } from "@polkadot/types";

export namespace Posts {
  export class PostCreatedEvent {
    public readonly expectedParamTypes = ["AccountId", "PostId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, PostId] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value
        ]),
        createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
          this.ctx.params[1].value
        ])
      ];
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

  export class PostUpdatedEvent {
    public readonly expectedParamTypes = ["AccountId", "PostId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, PostId] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value
        ]),
        createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
          this.ctx.params[1].value
        ])
      ];
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

  export class PostSharedEvent {
    public readonly expectedParamTypes = ["AccountId", "PostId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, PostId] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value
        ]),
        createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
          this.ctx.params[1].value
        ])
      ];
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

  export class CreatePostCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = [
      "Option<SpaceId>",
      "PostExtension",
      "Content"
    ];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): CreatePost_Args {
      return new CreatePost_Args(this.extrinsic);
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

  class CreatePost_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get spaceIdOpt(): Option<SpaceId> {
      return createTypeUnsafe<Option<SpaceId> & Codec>(
        typeRegistry,
        "Option<SpaceId>",
        [this.extrinsic.args[0].value]
      );
    }

    get extension(): PostExtension {
      return createTypeUnsafe<PostExtension & Codec>(
        typeRegistry,
        "PostExtension",
        [this.extrinsic.args[1].value]
      );
    }

    get content(): Content {
      return createTypeUnsafe<Content & Codec>(typeRegistry, "Content", [
        this.extrinsic.args[2].value
      ]);
    }
  }
  export class UpdatePostCall {
    public readonly extrinsic: SubstrateExtrinsic;
    public readonly expectedArgTypes = ["PostId", "PostUpdate"];

    constructor(public readonly ctx: SubstrateEvent) {
      if (ctx.extrinsic === undefined) {
        throw new Error(`No call data has been provided`);
      }
      this.extrinsic = ctx.extrinsic;
    }

    get args(): UpdatePost_Args {
      return new UpdatePost_Args(this.extrinsic);
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

  class UpdatePost_Args {
    constructor(public readonly extrinsic: SubstrateExtrinsic) {}

    get postId(): PostId {
      return createTypeUnsafe<PostId & Codec>(typeRegistry, "PostId", [
        this.extrinsic.args[0].value
      ]);
    }

    get update(): PostUpdate {
      return createTypeUnsafe<PostUpdate & Codec>(typeRegistry, "PostUpdate", [
        this.extrinsic.args[1].value
      ]);
    }
  }
}
