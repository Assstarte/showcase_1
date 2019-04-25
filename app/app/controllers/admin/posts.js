const Controller = require('../controller')

const Sequelize = require('sequelize')

class Posts extends Controller {
    async index(req, res) {
        if (this.isAuthenticated(req)) {
            let paginator = await super.pagination(req, 'Posts', `${process.env.APP_URL}/admin/posts`) // Limit wil be set by default (20)

            return res.render('admin/posts/index', {
                posts: paginator.items,
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
        const postId = req.params.id

        let categories = await this.model.Categories.findAll()

        if (postId && postId > 0) {
            const resultItem = await this.model.Posts.findByPk(postId)
            if (resultItem) {
                return res.render('admin/posts/show', {
                    categories: categories,
                    post: resultItem,
                    layout: 'admin.hbs',
                    dashboard: true,
                    username: req.session.login
                })
            }
                return res.render('error', { message: `Failed to retrieve item w/ ${postId} ID` })

        }

            res.status(400).render('error', {
                message: 'Invalid ID'
            })

    }

    async store(req, res) {
        if (!this.isAuthenticated(req)) {
            return res.status(403).render('403', {
                layout: 'admin.hbs'
            })``
        }

        let validation = this.validation(req.body, ['title', 'description', 'h1', 'slug', 'link', 'text'])

        if (!validation.valid) {

            let categories = await this.model.Categories.findAll()

            return res.status(400).render('admin/posts/create', {
                categories: categories,
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
            anchor: req.body.anchor,
            hasLink: req.body.link ? 1 : 0,
            text: req.body.text,
            link: req.body.link,
            category_id: req.body.category,
            published_at: Sequelize.fn('NOW')
        }

        const createdItem = await this.model.Posts.create(item)
        if (createdItem) {
            return res.redirect(`/admin/posts/${createdItem.id}`)
        }

        return res.status(500).render('error', {
            layout: 'admin.hbs',
            message: 'Failed to create instance in DB'
        })


    }

    async create(req, res) {
        if (!this.isAuthenticated(req)) {

            return res.status(403).render('403', {
                layout: 'admin.hbs'
            })
        }

        let categories = await this.model.Categories.findAll()

        return res.render('admin/posts/create', {
            categories: categories,
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

        const postId = req.params.id


        if (postId && postId > 0) {
            let categories = await this.model.Categories.findAll()
            const resultItem = await this.model.Posts.findByPk(postId)

            if (resultItem) {
                return res.status(200).render('admin/posts/edit', {
                    categories: categories,
                    post: resultItem,
                    layout: 'admin.hbs',
                    dashboard: true,
                    username: req.session.login
                })
            }
            return res.status(400).render('error', { message: `Failed to retrieve item w/ ${postId} ID` })

        }
        return res.status(400).render('error', {
            message: 'Invalid ID'
        })

    }

    async update(req, res) {

        const postId = req.params.id

        if (!this.isAuthenticated(req)) {

            return res.status().render('403', {
                layout: 'admin.hbs'
            })
        }

        let post = await this.model.Posts.findByPk(postId)

        let validation = this.validation(req.body, ['title', 'description', 'h1', 'slug', 'link', 'text'])

        if (!validation.valid) {

            let categories = await this.model.Categories.findAll()

            return res.status(400).render('admin/posts/edit', {
                categories: categories,
                layout: 'admin.hbs',
                dashboard: true,
                inputError: validation.errors,
                post: post
            })
        }

        const item = {
            title: req.body.title,
            description: req.body.description,
            h1: req.body.h1,
            slug: req.body.slug,
            text: req.body.text,
            anchor: req.body.anchor,
            hasLink: req.body.link ? 1 : 0,
            category_id: req.body.category,
            link: req.body.link
        }

        const updatedItem = await this.model.Posts.update(item, {
            where: {
                id: postId
            }
        })

        if (updatedItem) {
            return res.redirect(`/admin/posts/${postId}`)
        }
        return res.status(400).render('400', {
            layout: 'admin.hbs',
            dashboard: true,
            username: req.session.login,
            message: `Failed to update item w/ ${postId} ID`
        })


    }

    async delete(req, res) {
        const postId = req.params.id

        if (!this.isAuthenticated(req)) {

            return res.status(403).render('403', {
                layout: 'admin.hbs'
            })
        }

        await this.model.Posts.destroy({
            where: {
                id: postId
            }
        })

        return res.redirect('/admin/posts')

    }

}

module.exports = new Posts()