const Controller = require('../controller')

class Categories extends Controller {
    async index(req, res) {
        if (this.isAuthenticated(req)) {

            let paginator = await super.pagination(req, 'Categories', `${process.env.APP_URL}/admin/categories`) // Limit wil be set by default (20)

            return res.render('admin/categories/index', {
                categories: paginator.items,
                layout: 'admin.hbs',
                dashboard: true,
                username: req.session.login,
                paginator: paginator
            })
        }
        //In case above IF did not work
        return res.status(403).render('403')

    }

    async show(req, res) {
        if (!this.isAuthenticated(req)) {
            return res.status(403).render('403', {
                layout: 'admin.hbs'
            })
        }
        const categoryId = req.params.id

        if (categoryId && categoryId > 0) {
            const resultItem = await this.model.Categories.findByPk(categoryId)

            if (resultItem) {
                return res.status(200).render('admin/categories/show', {
                    category: resultItem,
                    layout: 'admin.hbs',
                    dashboard: true,
                    username: req.session.login
                })
            }
            return res.status(400).render('error', { message: `Failed to retrieve item w/ ${categoryId} ID` })

        }
        return res.status(400).render('error', {
            message: 'Invalid ID'
        })

    }

    async store(req, res) {
        if (!this.isAuthenticated(req)) {
            return res.status(403).render('403', {
                layout: 'admin.hbs'
            })``
        }

        let validation = this.validation(req.body, ['title', 'name', 'description', 'h1', 'slug'])

        if (!validation.valid) {

            return res.status(400).render('admin/categories/create', {
                layout: 'admin.hbs',
                dashboard: true,
                inputError: validation.errors,
                correctFields: validation.correct
            })
        }

        const item = {
            title: req.body.title,
            description: req.body.description,
            h1: req.body.h1,
            slug: req.body.slug,
            name: req.body.name
        }

        const createdItem = await this.model.Categories.create(item)
        if (createdItem) {
            return res.redirect(`/admin/categories/${createdItem.id}`)
        }

        return res.status(500).render('error', {
            layout: 'admin.hbs',
            message: 'Failed to create instance in DB'
        })


    }

    create(req, res) {
        if (!this.isAuthenticated(req)) {

            return res.status(403).render('403', {
                layout: 'admin.hbs'
            })
        }

        return res.render('admin/categories/create', {
            layout: 'admin.hbs',
            dashboard: true,
            username: req.session.login
        })
    }

    async edit(req, res) {
        if (!this.isAuthenticated(req)) {

            return res.status(403).render('403', {
                layout: 'admin.hbs'
            })
        }

        const categoryId = req.params.id


        if (categoryId && categoryId > 0) {
            const resultItem = await this.model.Categories.findByPk(categoryId)

            if (resultItem) {
                return res.status(200).render('admin/categories/edit', {
                    category: resultItem,
                    layout: 'admin.hbs',
                    dashboard: true,
                    username: req.session.login
                })
            }
            return res.status(400).render('error', { message: `Failed to retrieve item w/ ${categoryId} ID` })

        }
        return res.status(400).render('error', {
            message: 'Invalid ID'
        })

    }

    async update(req, res) {

        const categoryId = req.params.id

        if (!this.isAuthenticated(req)) {

            return res.status().render('403', {
                layout: 'admin.hbs'
            })
        }

        let validation = this.validation(req.body, ['title', 'description', 'h1', 'slug', 'name'])

        if (!validation.valid) {

            let category = await this.model.Categories.findByPk(categoryId)

            return res.status(400).render('admin/categories/edit', {
                category: category,
                layout: 'admin.hbs',
                dashboard: true,
                inputError: validation.errors
            })
        }

        const item = {
            title: req.body.title,
            description: req.body.description,
            h1: req.body.h1,
            slug: req.body.slug,
            name: req.body.name
        }

        const updatedItem = await this.model.Categories.update(item, {
            where: {
                id: categoryId
            }
        })

        if (updatedItem) {
            return res.redirect(`/admin/categories/${categoryId}`)
        }
        return res.status(400).render('400', {
            layout: 'admin.hbs',
            dashboard: true,
            username: req.session.login,
            message: `Failed to update item w/ ${categoryId} ID`
        })


    }

    async delete(req, res) {
        const categoryId = req.params.id

        if (!this.isAuthenticated(req)) {

            return res.status(403).render('403', {
                layout: 'admin.hbs',
                dashboard: true
            })
        }

        //Obtain posts of the category to check if one can be deleted
        let categoryToBeDeleted = await this.model.Categories.findByPk(categoryId, {
            include: [
                {
                    model: this.model.Posts,
                    as: 'posts'
                }
            ]
        })

        if (categoryToBeDeleted.posts) {
            console.error(`Cannot delete category w/ ${categoryId} ID`)
            let paginator = await super.pagination(req, 'Categories', `${process.env.APP_URL}/admin/categories`) // Limit wil be set by default (20)

            return res.render('admin/categories/index', {
                categories: paginator.items,
                layout: 'admin.hbs',
                dashboard: true,
                username: req.session.login,
                paginator: paginator,
                error: {
                    message: 'Нельзя удалить категорию, на которую ссылаются посты'
                }
            })
        }

        await this.model.Categories.destroy({
            where: {
                id: categoryId
            }
        })

        return res.redirect('/admin/categories')

    }

}

module.exports = new Categories()