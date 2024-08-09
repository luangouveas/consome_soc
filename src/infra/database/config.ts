import { Knex } from 'knex'

const getConfig = (): Knex.Config => {
  return {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      timezone: 'America/Sao_Paulo',
    },
  }
}

export default {
  ...getConfig(),
}
