'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkInsert('subscription_plans', [
            {
                name: 'Scent Explorer', //исследователь запахов - название тарифа
                description: 'Откройте для себя новые ароматы:',//описание
                price_per_month: 990.00,//цена в месяц
                samples_included: 3,//скок семплов можно выбрать
                sample_volume_ml: 1.5,//объем семплов
                recommended_samples: 2,
                custom_samples: 1
            },
            {
                name: 'Fragrance Addict', //любитель ароматов
                description: 'Когда одного мало:',
                price_per_month: 1790.00,
                samples_included: 4,
                sample_volume_ml: 2.0,
                recommended_samples: 2,
                custom_samples: 2
            },
            {
                name: 'Perfume Maniac', //парфманьяк
                description: 'Безграничная страсть:',
                price_per_month: 2990.00,
                samples_included: 6,
                sample_volume_ml: 2.5,
                recommended_samples: 3,
                custom_samples: 3
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkDelete('subscription_plans', null, {});
    }
};