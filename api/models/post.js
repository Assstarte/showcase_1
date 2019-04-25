'use strict'
module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define('Posts', {
        title: DataTypes.TEXT,
        slug: DataTypes.TEXT,
        description: DataTypes.TEXT,
        h1: DataTypes.TEXT,
        categoryId: {
            type: DataTypes.INTEGER,
            field: 'category_id'
        },
        publishedAt: {
            type: DataTypes.DATE,
            field: 'published_at'
        },
        text: DataTypes.TEXT,
        link: DataTypes.TEXT,
        hasLink: {
            type: DataTypes.INTEGER,
            field: 'has_link'
        },
        hasImage: {
            type: DataTypes.INTEGER,
            field: 'has_image'
        },
        anchor: DataTypes.TEXT
    }, {
            tableName: 'posts',
            timestamps: true,
            underscored: true
        })
    Posts.associate = (models) => {
        Posts.belongsTo(models.Categories, {
            as: 'category',
            foreignKey: 'categoryId'
        })
    }
    return Posts
}