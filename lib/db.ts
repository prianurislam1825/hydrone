import mysql from 'mysql2/promise'

/**
 * MySQL connection pool — singleton per process.
 * Configure via environment variables:
 *   DB_HOST     default: localhost
 *   DB_PORT     default: 3306
 *   DB_USER     default: root
 *   DB_PASSWORD default: (empty)
 *   DB_NAME     default: hydrone
 */

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined
}

function createPool(): mysql.Pool {
  return mysql.createPool({
    host:               process.env.DB_HOST     ?? 'localhost',
    port:               parseInt(process.env.DB_PORT ?? '3306'),
    user:               process.env.DB_USER     ?? 'root',
    password:           process.env.DB_PASSWORD ?? '',
    database:           process.env.DB_NAME     ?? 'hydrone',
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    enableKeepAlive:    true,
    keepAliveInitialDelay: 0,
  })
}

// Reuse pool across hot-reloads in dev
const pool: mysql.Pool = global._mysqlPool ?? createPool()
if (process.env.NODE_ENV !== 'production') global._mysqlPool = pool

export default pool
