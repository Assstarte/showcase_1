const Controller = require('../controller')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

//=====================BCRYPT======================
const bcrypt = require('bcrypt')
const saltRounds = 10
//=====================BCRYPT======================

class Admin extends Controller {
    login(req, res) {
        if (req.session.authenticated) {
            return res.redirect('/admin/categories')
        }

        return res.render('admin/login', {
            layout: 'admin.hbs'
        })
    }

    register(req, res) {
        if (req.session.authenticated) {
            return res.redirect('/admin/categories')
        }

        return res.render('admin/register', {
            layout: 'admin.hbs'
        })
    }

    async store(req, res) {

        let validation = this.validation(req.body, ['login', 'name', 'password'])

        if (!validation.valid) {

            return res.status(400).render('admin/register', {
                layout: 'admin.hbs',
                inputError: validation.errors,
                correctFields: validation.correct
            })
        }

        //Check if such an instance already exists
        let alreadyExists = await this.model.Admin.findOne({
            where: {
                login: req.body.login
            }
        })

        if (alreadyExists) {

            return res.status(400).render('admin/register', {
                layout: 'admin.hbs',
                error: {
                    message: 'Such account already exists'
                }
            })
        }

        //Create new instance in DB

        let passwordHash = await bcrypt.hash(req.body.password, saltRounds)

        const admin = {
            name: req.body.name,
            login: req.body.login,
            password: passwordHash
        }

        let createdEntity = await this.model.Admin.create(admin)

        if (createdEntity) {
            return res.render('admin/login', {
                layout: 'admin.hbs',
                successAfterRegister: true
            })
        }
        return res.status(500).render('admin/register', {
            layout: 'admin.hbs',
            dashboard: true,
            error: {
                message: 'Account was not created, error occurred'
            }
        })

    }

    async loginAttempt(req, res) {

        let user = await this.model.Admin.findOne({
            where: {
                login: req.body.login,
            }
        })

        if (!user) {
            return res.status(401).render('admin/login', {
                layout: 'admin.hbs',
                error: {
                    message: 'Invalid Credentials'
                }
            })
        }

        let passIsValid = await bcrypt.compare(req.body.password, user.password)

        if (passIsValid) {
            req.session.authenticated = true
            req.session.id = user.id
            req.session.login = user.login
            res.redirect('/admin/categories')

        } else {

            return res.status(401).render('admin/login', {
                layout: 'admin.hbs',
                error: {
                    message: 'Invalid Credentials'
                }
            })
        }

    }

    async search(req, res) {

        if (!this.isAuthenticated(req)) {
            return res.status(403).render('403', {
                layout: 'admin.hbs'
            })
        }

        let query = null

        if (req.method === 'POST') {
            query = req.body.query
        } else {
            query = req.params.query
        }

        if (!query) return res.render('404', {
            layout: 'admin.hbs',
            dashboard: true,
            username: req.session.login,
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

        let paginator = await super.pagination(req, 'Posts', `${process.env.APP_URL}/admin/search/${query}`, queryOptions)

        let posts = paginator.items

        if (posts && posts.length !== 0) {
            return res.render('admin/posts/index', {
                posts: posts,
                layout: 'admin.hbs',
                dashboard: true,
                username: req.session.login,
                paginator: paginator
            })
        }
            return res.render('404', {
                layout: 'admin.hbs',
                dashboard: true,
                username: req.session.login
            })


    }

    logout(req, res) {
        req.session = null
        return res.render('admin/login', {
            layout: 'admin.hbs'
        })
    }

}

module.exports = new Admin()