import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { dbName, dbUser, dbPass, dbHost, dbPort } from '../../env'

const pgConf: any = {
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPass,
  port: dbPort,
}

const pg = new Pool(pgConf)

const querySubnet = `
  CREATE TABLE IF NOT EXISTS public.subnet
  (
  	parent_id varchar(48) NOT null,
  	child_space_id varchar(48) not null,
  	primary key (parent_id, child_space_id)
  );

  CREATE INDEX IF NOT EXISTS space_created_on_day_idx ON public.space (created_on_day);
  CREATE INDEX IF NOT EXISTS post_created_on_day_idx ON public.post (created_on_day)
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
      const promises = value.map(async (spaceId) => {
        const params = [key, spaceId]
        return pg.query(query, params)
      })

      await Promise.all(promises)
    }
  } catch (err) {
    console.error(err)
  }
}

setDependency()
