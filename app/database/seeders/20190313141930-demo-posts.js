'use strict'

const faker = require('faker')


module.exports = {
    up: (queryInterface, Sequelize) => {


        //============================
        //Generating fake data
        //============================

        let fakePostsData = []
        let categoryId = 3

        for (let i = 0; i < 50; i++) {
            fakePostsData.push({
                title: faker.lorem.word(),
                description: faker.lorem.words(5),
                h1: faker.lorem.word(),
                slug: `${faker.helpers.slugify(faker.lorem.word())}-${i}`,
                text: faker.lorem.paragraphs(20),
                link: `http://${faker.internet.domainName()}`,
                anchor: faker.lorem.word(),
                has_link: 1,
                created_at: Sequelize.fn('NOW'),
                updated_at: Sequelize.fn('NOW'),
                category_id: categoryId,
                published_at: Sequelize.fn('NOW')
            })
        }

        return queryInterface.bulkInsert('posts', fakePostsData, {})

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
