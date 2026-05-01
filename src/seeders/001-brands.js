'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkInsert('brands', [
            {
                name: 'Mancera', //название бренда
                description: 'Семейный бренд парфюмера Пьера Монталя и его дочери, создающий самые стойкие и шлейфовые ароматы с уникальным, ярким характером.',//описание бренда
                country: 'Франция',//страна производитель
                luxury_level: 'niche',//категория бренда - нишевый или люксовый 
                logo_url: '/images/brands/mancera-logo.png',//логотип
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Montale',
                description: 'Французский парфюмерный дом, открывший миру роскошь уда и превративший его в культовый ингредиент. Бренд, где восточные ноты звучат по-новому, а каждая композиция стала синонимом безупречного вкуса.',
                country: 'Франция',
                luxury_level: 'niche',
                logo_url: '/images/brands/montale-logo.png',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Tiziana Terenzi',
                description: 'Итальянский парфюмерный дом, где каждая композиция - это история, сотканная из звёздных аккордов, огня венецианского стекла и многовековых семейных традиций, воплощённая в арт-объектах с драгоценными деталями.',
                country: 'Италия',
                luxury_level: 'niche',
                logo_url: '/images/brands/tiziana-terenzi-logo.png',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'V Canto',
                description: 'Парфюмерная поэма в пяти песнях, где каждая коллекция - это глава из средневековой легенды о любви, страсти и роковых страстях, заключённая в флаконы-артефакты эпохи Возрождения.',
                country: 'Италия',
                luxury_level: 'niche',
                logo_url: '/images/brands/v-canto-logo.webp',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'New Notes',
                description: 'Ароматы, которые чувствуют больше, чем пахнут. Итальянский парфюмерный дом превращает каждую композицию в сенсорное путешествие по неизведанным территориям эмоций. Для тех, кто ищет в парфюмерии не запах, а переживание. ',
                country: 'Италия',
                luxury_level: 'niche',
                logo_url: '/images/brands/new-notes-logo.png',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Dolce & Gabbana',
                description: 'Итальянский дом, основанный дуэтом Доменико Дольче и Стефано Габбаной, где каждый аромат — это ода сицилийскому солнцу, страстной чувственности и безупречной элегантности.',
                country: 'Италия',
                luxury_level: 'premium',
                logo_url: '/images/brands/dolce-gabbana-logo.png',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Givenchy',
                description: 'Парижская элегантность, обретшая голос в парфюмерии. Дом, где каждый аромат — это дерзкий вызов условностям, брошенный с безупречным вкусом. Наследие высокой моды, воплощённое в культовых флаконах.',
                country: 'Франция',
                luxury_level: 'premium',
                logo_url: '/images/brands/givenchy-logo.png',
                created_at: new Date(),
                updated_at: new Date()
            }

        ], {});

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkDelete('brands', null, {});
    }
};