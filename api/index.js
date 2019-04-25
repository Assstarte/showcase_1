require('dotenv').config()
const schedule = require('node-schedule')
const moment = require('moment')
const Parser = require('./parser')

//===========CHANGE TO TRUE TO BEGIN PARSING============
const LAUNCH_TEST_SITEMAP_PARSING = true
//======================================================

const RIA = new Parser({
    PRIMARY_URL: 'https://ria.ru',
    SITEMAP_URL: 'https://ria.ru/sitemap_article.xml'
})

const getDate = () => { //Retrieving yesterday date
    return moment(new Date()).subtract(1, 'day').format('YYYYMMDD')
}

if (LAUNCH_TEST_SITEMAP_PARSING) {
    RIA.parseSiteMap('https://ria.ru/sitemap_article.xml', getDate())
}

//Scheduling job foe ea. 04:00 AM to parse previous date (yesterday)
const job = schedule.scheduleJob('0 4 * * *', () => {
    console.warn('This job is actually working | Date => ' + new Date())
    let date = getDate()
    console.warn(`Started parsing of ${date} sitemap`)
    RIA.parseSiteMap('https://ria.ru/sitemap_article.xml', date)
})

console.warn(job)

