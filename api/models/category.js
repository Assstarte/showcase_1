'use strict'
module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define('Categories', {
        name: {
            type: DataTypes.TEXT,
        },
        title: {
            type: DataTypes.TEXT,
        },
        slug: {
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT,
        },
        h1: {
            type: DataTypes.TEXT
        }

    }, {
            tableName: 'categories',
            timestamps: true,
            underscored: true,
        })
    Categories.associate = (models) => {
        Categories.hasMany(models.Posts, {
            as: 'posts',
            foreingKey: 'categoryId'
        })
    }
    return Categories
}