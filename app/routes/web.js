const express = require('express')
const router = express.Router()
const HomeController = require('../app/controllers/home')
const PostController = require('../app/controllers/posts')
const CategoryController = require('../app/controllers/categories')
const SearchController = require('../app/controllers/search')

// Routers
// =============================================================================

router.get('/', (req, res) => HomeController.index(req, res))
// router.get('/:slug/:page([0-9]+)?', (req, res) => HomeController.show(req, res))

router.get('/post/:slug', (req, res) => PostController.show(req, res))

router.get('/categories/:slug', (req, res) => CategoryController.show(req, res))

router.post('/search', (req, res) => SearchController.search(req, res))

router.get('/search/:query', (req, res) => SearchController.search(req, res))

// =============================================================================

module.exports = router