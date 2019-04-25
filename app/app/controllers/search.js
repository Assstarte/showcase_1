const Controller = require('./controller')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

class Search extends Controller {
    async search(req, res) {

        let categories = await this.model.Categories.findAll()

        let query = null
        if (req.method === 'POST'){
            query = req.body.query
        } else {
            query = req.params.query
        }

        if (!query) return res.render('404', {
            title: '404 Not Found',
            description: '404 Not Found Error',
            categories: categories
        })

        let queryOptions = {
            where: {
                [Op.or]: {
                    title: {
                        [Op.iLike]: `%${query}%`
                    },
                    description: {
                        [Op.iLike]: `%${query}%`
                    },
                    h1: {
                        [Op.iLike]: `%${query}%`
                    }
                }
            },
            include: [
                {
                    model: this.model.Categories,
                    as: 'category'
                }
            ]
        }

        let paginator = await super.pagination(req, 'Posts', `${process.env.APP_URL}/search/${query}`, queryOptions)

        let posts = paginator.items

        if (posts && posts.length !== 0) {
            return res.render('search', {
                posts: posts,
                categories: categories,
                paginator: paginator
            })
        }
        return res.status(404).render('search', {
            categories: categories,
            title: 'Нет результатов',
            noresults: true,
            description: '404 Not Found Error'
        })

    }
}

module.exports = new Search()