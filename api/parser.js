const model = require('./models')
const needle = require('needle')
const cheerio = require('cheerio')
const slugify = require('slugify')
const clr = require('ansi-colors')
const download = require('download')
const fse = require('fs-extra')
const smta = require('sitemap-to-array')

class Parser {
    constructor(options) {
        this.host = options.PRIMARY_URL
        this.sitemap = options.SITEMAP_URL
        this.model = model
        this.intervalCall = null
        this.intervalCounter = 0
        this.intervalLimit = 0
    }

    async parseSiteMap(url = this.sitemap, date) {

        console.warn(clr.italic.yellowBright('Fetching sitemap...'))

        //Check if sitemap can actually be retrieved
        let data = await download(`${url}?date=${date}`)

        if (data.length < 0) {
            console.warn(clr.bold.red('Failed to retrieve sitemap ✘\n\nPlease check the issue & restart parser'))
            return false
        }

        console.warn(clr.bold.green('Sitemap retrieved ✔'))


        const options = {
            returnOnComplete: true
        }

        console.warn(clr.italic.yellowBright('Parsing sitemap & Creating links array...'))

        //Parsing XML data & forming array of links. Array is passed to the setIterval looped parseItem function inside the callback smta renders.
        smta(`${url}?date=${date}`, options, (error, list) => {
            if (error) {
                console.error(error)
                return false
            }
            let links = []

            for (let item of list) {
                links.push(item.loc)
            }

            let totalItems = links.length - 1

            if (totalItems < 0) {
                console.warn(clr.bold.red('Failed create link list ✘\n\nPlease check the issue & restart parser'))
                return false
            }


            console.warn(clr.bold.cyan(`Let us parse some news. Total amount amount of items to be parsed ==> ${totalItems}`))

            this.intervalLimit = totalItems


            this.intervalCall = setInterval(this.parseItem.bind(this, links), 8000)

        })

        //======================================================================================================================================

    }

    async parseItem(links) {


        //Pro ternarka
        console.warn(clr.magentaBright(`Parsing news item... [Iteration ${this.intervalCounter}]`))
        let url = null

        if (links[this.intervalCounter].includes(this.host)) {
            url = `${links[this.intervalCounter]}`
        } else url = `${this.host}/${links[this.intervalCounter]}`

        console.warn(clr.blue(`Item URL ==> ${url}`))

        let data = await needle('get', url, { follow_max: 2 })

        const $ = cheerio.load(data.body, { decodeEntities: false })

        let entity = {}

        console.warn(clr.green('Item Loaded ✔ \nParsing...'))

        let h1 = $('h1').text()
        let timestamp = this.model.Sequelize.fn('NOW')

        entity.h1 = h1
        entity.title = h1
        entity.description = $('meta[name="description"]').attr('content')
        entity.description = entity.description.replace('РИА Новости.', '')
        entity.description = entity.description.replace('РИА Новости,', '')
        //=========Obtaining content text==========
        let articleBlocks = []
        let blocks = $('div[data-type=text].article__block')

        blocks.map((index, item) => {
            return articleBlocks.push($(item).text())
        })
        //=========================================

        //==========Obtaining post image===========
        let imgItem = $('.photoview__open')
        let imgLink = $(imgItem[0]).attr('data-photoview-src')
        //Check if parser was able to retreive image and note that to DB instance
        if (imgLink) {
            console.warn(clr.green('Item has image! ✔'))
            console.warn(clr.yellowBright(`IMG URL ==> ${imgLink}`))
            console.warn(clr.italic.yellow('\nImage will be downloaded once the instance in DB is created\n'))
            entity.hasImage = 1
        } else {
            entity.hasImage = 0
            console.warn(clr.red('Item does not have image! ✘ \n Will be set as default'))
        }

        //=========================================
        entity.text = this.uniteText(articleBlocks)
        entity.text = entity.text.replace('РИА Новости.', '')
        entity.text = entity.text.replace('РИА Новости,', '')
        entity.slug = slugify(h1, { remove: /[*+~,.()'"!ьъ:@]/g, lower: true })
        entity.hasLink = 0
        entity.categoryId = 1
        entity.published_at = timestamp

        console.warn(clr.bold.yellowBright('Ensuring that the item is unique...'))

        let alreadyExists = await this.checkDuplicate(entity)

        if (alreadyExists) {
            ++this.intervalCounter //Proceeding to next iter.
            console.warn(clr.bold.red('Item already exists in DB... Skipping ✘'))
            return false
        }

        let created = await this.model.Posts.create(entity)

        if (created) {
            console.warn(clr.bold.green(`CREATED ITEM w/ ${created.id} ID ✔`))
        } else {
            console.error(clr.bold.red('Failed to create instance in DB ✘'))
            return false
        }

        //=========Downloading & Saving image *only* if item has it=========
        if (entity.hasImage) {
            console.warn(clr.italic.grey('Downloading image...\n'))
            await this.saveImage(imgLink, created.id)
        }
        //==================================================================

        if (this.intervalCounter === this.intervalLimit) {
            clearInterval(this.intervalCall)
            console.warn(clr.bold.green('\n===============\nDONE ✔ :)\n==============='))
        }

        ++this.intervalCounter

        return true

    }

    uniteText(arr) {
        let result = ''
        for (let item of arr) {
            result += item.trim() + '\n'
        }

        return result
    }

    async saveImage(url, id) {
        let result = false
        let folder = Math.floor((id / 500)) * 500

        //Check if parsed URL is malformed

        url = url.trim()

        if (typeof url !== 'string') return false

        let data = await download(url)

        if (data.length > 0) {
            let file = `./storage/posts/${folder}/${id}.jpg`
            //================Attempt to save====================
            try {
                await fse.ensureFile(file)
                fse.writeFileSync(file, data)
                console.warn(clr.italic.greenBright('Image saved successfully ✔'))
                result = true
            } catch (err) {
                console.warn(clr.italic.red('Image was not saved, error occurred ✘'))
                console.error(clr.grey(`Error Description: ${err.message}`))
            }
            //===================================================

        } else {

            result = false
        }

        return result
    }

    async checkDuplicate(item) {

        const Op = this.model.Sequelize.Op

        let exists = await this.model.Posts.findOne({
            where: {
                [Op.or]: [
                    {
                        h1: item.h1,
                        title: item.title,
                        slug: item.slug
                    },
                    {
                        text: item.text
                    }
                ]
            }
        })

        if (exists) {
            return true
        }

        return false

        //return Boolean(exists)
    }
}

module.exports = Parser