const Controller = require('./controller')

class Posts extends Controller {
    async show(req, res) {
        let slug = req.params.slug
        let categories = await this.model.Categories.findAll()
        let post = await this.model.Posts.findOne({
            where: {
                slug: slug
            },
            include: [
                {
                    model: this.model.Categories,
                    as: 'category'
                }
            ]
        })

        if (slug && post) {
            return res.render('post', {
                post: post,
                title: post.title,
                description: post.description,
                categories: categories
            })
        }
        return res.render('404', {
            title: '404 Not Found',
            description: '404 Not Found Error',
            categories: categories
        })


    }
}

module.exports = new Posts()