require('dotenv').config()

const bodyParser = require('body-parser')      // BodyParser
const express = require('express')     // Express

const hbs = require('express-handlebars')       // Express HandleBars
const helpers = require('./app/helpers/handlebars.js')      // HandleBars Own Helpers

const app = express()
const router = express.Router()      // Получаем экземпляр Express-Router

const cookieSession = require('cookie-session') // Подключаем куки

const methodOverride = require('method-override')

app.set('trust proxy', 1) // trust first proxy


// Подключем нужных посредников
// =============================================================================
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))  // Включение статических файлов
app.use(
    cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    })
)
app.use(methodOverride('_method'))

// Настройка handlebars
// =============================================================================
app.set('view engine', 'hbs')
app.set('views', `${__dirname}/resources/views`)
app.cache = {}

app.engine('hbs', hbs({
    helpers: helpers,       // HandeBars Own Helpers
    extname: 'hbs',
    defaultLayout: 'app',
    layoutsDir: `${__dirname}/resources/views/layouts/`,
    partialsDir: `${__dirname}/resources/views/partials/`
}))

// Роутеры
// =======================s======================================================
let Routes = require('./routes/web')
let AdminRoutes = require('./routes/admin')

app.use('/', Routes)
app.use('/admin', AdminRoutes)

// Отдача 404, если файл не найден
app.use((req, res) => {
    return res.status(404).render('404')
})

// Отдача 500, если ошибка сервера
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.type('plain/text')
    return res.status(500).render('500')
})

// Регистрация всех роутеров
app.use(router)


// Запуска сервера
// =============================================================================
let port = process.env.APP_CONTAINER_PORT
app.listen(port, async() => {
    console.warn(`http://127.0.0.1:${port}`)
})