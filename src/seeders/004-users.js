'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        const password_hash = await bcrypt.hash('password123', 10);

        const emails = [
            'millipo@example.com',
            'tanii@example.com',
            'alis@test.ru',
            'daniil_bort@mail.com',
            'olmit@yandex.ru'
        ];
        // Проверка существующих пользователей
        const existingUsers = await queryInterface.sequelize.query(
            `SELECT email FROM customers WHERE email IN (${emails.map(e => `'${e}'`).join(',')})`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const existingEmails = existingUsers.map(u => u.email);
        const usersToInsert = [];

        const userData = [
            { first_name: 'Полина', last_name: 'Митлянская', email: 'millipo@example.com', points: 150, sub: 'active', phone: '+79991234567' },
            { first_name: 'Татьяна', last_name: 'Шулькина', email: 'tanii@example.com', points: 50, sub: 'none', phone: '+79997654321' },
            { first_name: 'Алиса', last_name: 'Лядова', email: 'alis@test.ru', points: 300, sub: 'active', phone: '+79001112233' },
            { first_name: 'Даниил', last_name: 'Бортников', email: 'daniil_bort@mail.com', points: 20, sub: 'none', phone: '+79554443322' },
            { first_name: 'Ольга', last_name: 'Митлянская', email: 'olmit@yandex.ru', points: 0, sub: 'none', phone: '+79110009988' }
        ];

        userData.forEach(user => {
            if (!existingEmails.includes(user.email)) {
                usersToInsert.push({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    password_hash: password_hash,
                    phone: user.phone,
                    loyalty_points: user.points,
                    subscription_status: user.sub,
                    created_at: new Date()
                });
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkDelete('customers', {
            email: [
                'millipo@example.com', 'tanii@example.com',
                'alex_p@test.ru', 'diana_fragrance@mail.com', 'ivan_nose@yandex.ru'
            ]
        }, {});
    }
};