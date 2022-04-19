import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {PostKind} from "./_postKind"

@Entity_()
export class Post {
  constructor(props?: Partial<Post>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: true})
  createdByAccount!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  createdAtBlock!: bigint | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdAtTime!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  createdOnDay!: Date | undefined | null

  @Column_("text", {nullable: false})
  postId!: string

  @Column_("timestamp with time zone", {nullable: true})
  updatedAtTime!: Date | undefined | null

  @Column_("text", {nullable: false})
  spaceId!: string

  @Column_("text", {nullable: true})
  content!: string | undefined | null

  @Column_("varchar", {length: 11, nullable: true})
  kind!: PostKind | undefined | null

  @Column_("text", {nullable: true})
  parentId!: string | undefined | null

  @Column_("text", {nullable: true})
  rootPostId!: string | undefined | null

  @Column_("text", {nullable: true})
  sharedPostId!: string | undefined | null

  @Column_("integer", {nullable: true})
  repliesCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  publicRepliesCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  hiddenRepliesCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  sharesCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  upvotesCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  downvotesCount!: number | undefined | null

  @Column_("integer", {nullable: true})
  score!: number | undefined | null

  @Column_("text", {nullable: true})
  title!: string | undefined | null

  @Column_("text", {nullable: true})
  slug!: string | undefined | null

  @Column_("text", {nullable: true})
  summary!: string | undefined | null

  @Column_("text", {nullable: true})
  image!: string | undefined | null

  @Column_("text", {nullable: true})
  canonical!: string | undefined | null

  @Column_("text", {nullable: true})
  tagsOriginal!: string | undefined | null

  @Column_("integer", {nullable: true})
  proposalIndex!: number | undefined | null
}
