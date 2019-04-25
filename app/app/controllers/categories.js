const Controller = require('./controller')

class Categories extends Controller {
    async show(req, res) {
        let slug = req.params.slug

        let categories = await this.model.Categories.findAll()

        let category = await this.model.Categories.findOne({
            where: {
                slug: slug
            }
        })

        if (!category) return res.render('404', {
            title: '404 Not Found',
            description: '404 Not Found',
            categories: categories
        })

        let queryOptions = {
            where: {
                categoryId: category.id
            }
        }

        let paginator = await super.pagination(req, 'Posts', `${process.env.APP_URL}/categories/${slug}`, queryOptions)

        category.posts = paginator.items

        if (slug && category) {
            return res.render('category', {
                category: category,
                title: category.title,
                description: category.description,
                categories: categories,
                paginator: paginator
            })
        }
            return res.render('404', {
                title: '404 Not Found',
                description: '404 Not Found Error',
                categories: categories
            })

    }
}

module.exports = new Categories()