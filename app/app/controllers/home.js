const Controller = require('./controller')

class Home extends Controller {
    async index(req, res) {
        let paginator = await super.pagination(req, 'Posts', `${process.env.APP_URL}`, {
            include: [
                {
                    model: this.model.Categories,
                    as: 'category'
                }
            ],
            order: [['published_at', 'DESC']]
        })

        let categories = await this.model.Categories.findAll()

        if (paginator && paginator.items && paginator.items.length !== 0) {
            return res.render('home', {
                title: 'Главная страница',
                posts: paginator.items,
                categories: categories,
                redH1: 'Главная страница',
                paginator: paginator
            })
        }

        return res.status(404).render('home', {
            title: 'Главная страница',
            categories: categories,
            redH1: 'Главная страница',
            noresults: true
        })

    }
}

module.exports = new Home()