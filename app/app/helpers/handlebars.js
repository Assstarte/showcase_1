const helpers = require('handlebars-helpers')()

const handlebars = {
    asset: (path) => {
        return `${process.env.APP_URL}/${path}`
    },
    imageAsset: (storagePath, id) => {
        return `${process.env.APP_URL}/${storagePath}/${id}.jpg`
    },
    homeUrl: () => {
        return `${process.env.APP_URL}`
    },
    categoryUrl: (slug) => {
        return `${process.env.APP_URL}/categories/${slug}`
    },
    postUrl: (slug) => {
        return `${process.env.APP_URL}/post/${slug}`
    },
    adminUrl: (path) => {
        return `${process.env.APP_URL}/admin/${path}`
    },
    adminHomeUrl: () => {
        return `${process.env.APP_URL}/admin`
    },
    adminItemUrl: (path, id = -1) => {
        return `${process.env.APP_URL}/admin/${path}/${id}`
    },
    postImgPath: (id) => {
        let folder = Math.floor((id / 500)) * 500
        let file = `${process.env.APP_URL}/storage/posts/${folder}/${id}.jpg`
        return file
    },
    noImgPath: () => {
        return `${process.env.APP_URL}/no_image.png`
    },
    helpers
}

module.exports = handlebars