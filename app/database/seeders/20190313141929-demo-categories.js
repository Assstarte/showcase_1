'use strict'

const faker = require('faker')


module.exports = {
    up: (queryInterface, Sequelize) => {


        //============================
        //Generating fake data
        //============================

        let fakeCategoriesData = []

        for (let i = 0; i < 5; i++) {
            fakeCategoriesData.push({
                name: faker.lorem.word(),
                title: faker.lorem.word(),
                description: faker.lorem.words(5),
                h1: faker.lorem.word(),
                slug: `${faker.helpers.slugify(faker.lorem.word())}-${i}`,
                created_at: Sequelize.fn('NOW'),
                updated_at: Sequelize.fn('NOW')
            })
        }

        return queryInterface.bulkInsert('categories', fakeCategoriesData, {})

    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
}
