import { SubstrateEvent, DB } from '../generated/hydra-processor'
import { Post } from '../generated/graphql-server/src/modules/post/post.model'

type Comment = {
  root_post_id: string,
  parent_id?: string
}

export async function posts_PostCreated(db: DB, event: SubstrateEvent) {
  const [account, id] = event.params
  const post = new Post()
  post.author = Buffer.from(account.value as string)
  post.id = id.value as string
  if (event.extrinsic === undefined) {
    throw new Error(`No extrinsic has been provided`)
  }

  post.content = event.extrinsic.args[2].value as string
  const [ kind, value ] = (Object.entries(event.extrinsic.args[1].value)[0] || []) as [ string, string | object ]

  post.kind = kind

  switch (kind) {
    case 'Comment': {
      const comment = value as Comment
      post.rootPostId = comment.root_post_id
      post.parentId = comment.parent_id
      break
    }
    case 'SharedPost': {
      post.sharedPostId = value as string
    }
  }

  await db.save<Post>(post)
}

