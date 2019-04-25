const model = require('../models')

class Controller {
    constructor() {
        this.model = model
        this.isAuthenticated = (req) => {
            return req.session.authenticated
        }
        this.validation = (input, fields) => {

            let output = {
                valid: true,
                errors: {},
                correct: {}
            }

            for (let field of fields) {
                //In case the check fails, note that in the result errors obj
                if ((typeof input[field] === 'string' &&
                    input[field].trim() !== '')) {
                    output.correct[field] = input[field]
                } else { //Remember correct fields to return them so that User won`t have to type correct ones again
                    output.errors[field] = true
                    output.valid = false
                }

                //Check password field
                if (field === 'password' && input[field].length <= 7) {
                    output.errors.password = true
                    output.valid = false
                }
            }

            return output
        }
    }
    async pagination(req, itemModel, url, queryOptions = false, limit = 20, ) {

        let error404 = false

        let page

        if (req.query.page) {
            page = req.query.page
        }
        else {
            page = 1
        }

        let findAndCount = null
        if (queryOptions) {
            findAndCount = await this.model[itemModel].findAndCountAll(queryOptions)
        } else findAndCount = await this.model[itemModel].findAndCountAll()

        let itemCount = findAndCount.count

        let offset = --page * limit
        let totalPages = Math.ceil(itemCount / limit)

        if (page > totalPages) {
            error404 = true
        }

        //=================================================
        const calculatePages = (page, totalPages, url) => {
            let urlMaker = (number) => {
                return number === 1 ? url : `${url}/?page=${number}`
            }
            let pages = {}

            let from = page - 4

            if (from < 1) {
                from = 1
            }

            let to = from + 8

            if (to > totalPages) {
                to = totalPages
            }

            while (from <= to) {
                pages[from] = urlMaker(from)
                from++
            }

            return pages
        }
        //=================================================

        let pages = calculatePages(page, totalPages, url)

        let items = null

        if (queryOptions) {
            //Adding our limit & offset options to the query
            queryOptions.limit = limit
            queryOptions.offset = offset

            items = await this.model[itemModel].findAll(queryOptions)
        } else {
            items = await this.model[itemModel].findAll({
                limit: limit,
                offset: offset
            })
        }

        ++page //Coz indexing from 0
        let nextPage = null
        let previousPage = null

        if (page  < totalPages){
            nextPage = page + 1
        } else nextPage = false

        if (page !== 1 && page > 0) {
            previousPage = page - 1
        }  else previousPage = false


        let paginator = {
            items: items,
            hasPagination: (itemCount > limit) ? true : false,
            totalPages: totalPages,
            pages: pages,
            currentPage: page,
            nextPage: nextPage,
            nextPageUrl: nextPage ? `${url}/?page=${nextPage}` : `${url}`,
            previousPage: previousPage,
            previousPageUrl: previousPage ? `${url}/?page=${previousPage}` : `${url}`,
            lastPageUrl: `${url}/?page=${totalPages}`,
            firstPageUrl: `${url}/?page=1`

        }

        return error404 ? false : paginator
    }
}

module.exports = Controller