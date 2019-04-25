require('dotenv').config()

const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

let client = redis.createClient(process.env.REDIS_CONTAINER_PORT, process.env.REDIS_HOST)

client.on('error', (err) => {
    console.warn('Can not connect redis - ' + err)
})


module.exports = client