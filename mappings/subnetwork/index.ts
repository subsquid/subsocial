import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { dbName, dbUser, dbPass, dbHost, dbPost } from '../../env'

const pgConf: any = {
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPass,
  port: parseInt(dbPost),
}

const pg = new Pool(pgConf)

type SpaceIdsRecord = {
  spaceIds: Record<string, string[]>
}

const querySubnet = `
  CREATE TABLE IF NOT EXISTS public.subnet
  (
  	parent_id varchar(48) NOT null,
  	child_space_id varchar(48) not null,
  	primary key (parent_id, child_space_id)
  );

  CREATE INDEX IF NOT EXISTS space_created_on_date_idx ON public.space (created_on_date);
  CREATE INDEX IF NOT EXISTS post_created_on_date_idx ON public.post (created_on_date)
`

const query = `
  insert into public.subnet values ($1, $2)
  ON CONFLICT (parent_id, child_space_id) DO NOTHING;
`

const setDependency = async () => {
  const spaceIds: Record<string, string[]> = JSON.parse(readFileSync(__dirname + '/data.json', 'utf-8'))

  try {
    await pg.query(querySubnet)

    for (const [key, value] of Object.entries(spaceIds)) {
      value.map(async (spaceId) => {
        const params = [key, spaceId]
        await pg.query(query, params)
      })
    }
  } catch (err) {
    console.error(err)
  }
}

setDependency()
