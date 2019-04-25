const Sequelize = require('sequelize')

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        migrationStorageTableName: 'migrations',
        logging: false,
        operatorsAliases: Sequelize.Op
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_CONNECTION,
        migrationStorageTableName: 'migrations',
        logging: false,
        operatorsAliases: Sequelize.Op
    }
}