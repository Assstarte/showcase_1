'use strict'
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        name: {
            type: DataTypes.TEXT
        },
        login: {
            type: DataTypes.TEXT
        },
        password: {
            type: DataTypes.STRING
        }
    }, {
            tableName: 'admin_users',
            timestamps: true,
            underscored: true,
        })
    Admin.associate = (models) => {

    }
    return Admin
}