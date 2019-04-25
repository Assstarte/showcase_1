'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
            },
            h1: {
                type: Sequelize.TEXT
            },
            slug: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true
            },
            text: {
                type: Sequelize.TEXT
            },
            link: {
                type: Sequelize.TEXT
            },
            hasLink: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                field: 'has_link'
            },
            hasImage: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                field: 'has_image'
            },
            anchor: {
                type: Sequelize.TEXT
            },
            categoryId: {
                type: Sequelize.INTEGER,
                field: 'category_id'
            },
            publishedAt: {
                type: Sequelize.DATE,
                field: 'published_at'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                field: 'created_at'
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                field: 'updated_at'
            }
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('posts')
    }
}