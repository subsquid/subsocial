module.exports = class init_tables1650346845991 {
  name = 'init_tables1650346845991'

  async up(db) {
    await db.query(`CREATE TABLE "space" ("id" character varying NOT NULL, "created_by_account" text, "created_at_block" numeric, "created_at_time" TIMESTAMP WITH TIME ZONE, "created_on_day" TIMESTAMP WITH TIME ZONE, "space_id" text NOT NULL, "updated_at_time" TIMESTAMP WITH TIME ZONE, "owner_id" text, "posts_count" integer, "public_posts_count" integer, "hidden_posts_count" integer, "followers_count" integer, "score" integer, "content" text, "name" text, "image" text, "summary" text, "tags_original" text, CONSTRAINT "PK_094f5ec727fe052956a11623640" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "post" ("id" character varying NOT NULL, "created_by_account" text, "created_at_block" numeric, "created_at_time" TIMESTAMP WITH TIME ZONE, "created_on_day" TIMESTAMP WITH TIME ZONE, "post_id" text NOT NULL, "updated_at_time" TIMESTAMP WITH TIME ZONE, "space_id" text NOT NULL, "content" text, "kind" character varying(11), "parent_id" text, "root_post_id" text, "shared_post_id" text, "replies_count" integer, "public_replies_count" integer, "hidden_replies_count" integer, "shares_count" integer, "upvotes_count" integer, "downvotes_count" integer, "score" integer, "title" text, "slug" text, "summary" text, "image" text, "canonical" text, "tags_original" text, "proposal_index" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "space"`)
    await db.query(`DROP TABLE "post"`)
  }
}
