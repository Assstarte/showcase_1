const express = require('express')
const router = express.Router()
const AdminController = require('../app/controllers/admin/admin')
const CategoryController = require('../app/controllers/admin/categories')
const PostController = require('../app/controllers/admin/posts')
const LinkController = require('../app/controllers/admin/links')

// Routers
// =============================================================================

router.get('/', (req, res) => AdminController.login(req, res))

router.get('/register', (req, res) => AdminController.register(req, res))

router.get('/logout', (req, res) => AdminController.logout(req, res))

router.get('/search/:query', (req, res) => AdminController.search(req, res))

router.get('/search', (req, res) => AdminController.search(req, res))

router.post('/login', (req, res) => AdminController.loginAttempt(req, res))

router.post('/register', (req, res) => AdminController.store(req, res))

router.post('/search', (req, res) => AdminController.search(req, res))

//===========ITEMS===========

//======Categories GET===========
router.get('/categories', (req, res) => CategoryController.index(req, res))

router.get('/categories/create', (req, res) => CategoryController.create(req, res))

router.get('/categories/:id', (req, res) => CategoryController.show(req, res))

router.get('/categories/:id/edit', (req, res) => CategoryController.edit(req, res))
//===============================

//======Categories POST, PUT, DELETE===========
router.post('/categories', (req, res) => CategoryController.store(req, res))

router.put('/categories/:id', (req, res) => CategoryController.update(req, res))

router.delete('/categories/:id', (req, res) => CategoryController.delete(req, res))

//=============================================

//======Posts GET===============

router.get('/posts', (req, res) => PostController.index(req, res)) // index

router.get('/posts/create', (req, res) => PostController.create(req, res))

router.get('/posts/:id', (req, res) => PostController.show(req, res))

router.get('/posts/:id/edit', (req, res) => PostController.edit(req, res))
//==============================

//======Posts POST, PUT, DELETE===========
router.post('/posts', (req, res) => PostController.store(req, res))

router.put('/posts/:id', (req, res) => PostController.update(req, res))

router.delete('/posts/:id', (req, res) => PostController.delete(req, res))
//===========================

//===========Menus==============
router.get('/links', (req, res) => LinkController.index(req, res))
//==============================

// =============================================================================

module.exports = router