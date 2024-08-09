import createConnection from 'knex'
import config from './config'

export const db = createConnection(config)
