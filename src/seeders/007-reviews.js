'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');

        const users = await queryInterface.sequelize.query(
            `SELECT customer_id, email FROM customers WHERE email IN (
        'millipo@example.com', 
        'tanii@example.com', 
        'daniil_bort@mail.com'
      )`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        // получаем ID нескольких парфюмов 
        const perfumes = await queryInterface.sequelize.query(
            `SELECT perfume_id FROM perfumes LIMIT 3`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        // сопоставление email и ID
        const userMap = {};
        users.forEach(u => userMap[u.email] = u.customer_id);

        const reviewsToInsert = [
            {
                customer_id: userMap['millipo@example.com'],
                perfume_id: perfumes[0].perfume_id,
                rating: 5,
                comment: 'Аромат просто потрясающий! Очень стойкий и шлейфовый.',
                created_at: new Date()
            },
            {
                customer_id: userMap['tanii@example.com'],
                perfume_id: perfumes[0].perfume_id,
                rating: 4,
                comment: 'Приятный запах, но для меня немного тяжеловат на каждый день.',
                created_at: new Date()
            },
            {
                customer_id: userMap['daniil_bort@mail.com'],
                perfume_id: perfumes[1].perfume_id,
                rating: 5,
                comment: 'Лучший выбор для вечернего выхода. Оригинал 100%.',
                created_at: new Date()
            },
            {
                customer_id: userMap['millipo@example.com'],
                perfume_id: perfumes[2].perfume_id,
                rating: 3,
                comment: 'Интересный аромат, но на моей коже раскрылся слишком горько.',
                created_at: new Date()
            }
        ];

        await queryInterface.bulkInsert('reviews', reviewsToInsert, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkDelete('reviews', null, {});
    }
};