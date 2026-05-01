'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        // получаем id ароматов
        const [perfumes] = await queryInterface.sequelize.query(
            `SELECT perfume_id, name FROM perfumes;`
        );
        const perfumeMap = {};
        perfumes.forEach(p => perfumeMap[p.name] = p.perfume_id);

        await queryInterface.bulkInsert('samples', [
            //пробники по 1.5 мл
            {
                perfume_id: perfumeMap['Amore Caffe'],
                volume_ml: 1.5,
                stock: 100
            },
            {
                perfume_id: perfumeMap['Arabians Tonka'],
                volume_ml: 1.5,
                stock: 85
            },
            {
                perfume_id: perfumeMap['Felina'],
                volume_ml: 1.5,
                stock: 75
            },
            {
                perfume_id: perfumeMap['Mandragola'],
                volume_ml: 1.5,
                stock: 90
            },
            //пробники по 2 мл
            {
                perfume_id: perfumeMap['Amore Caffe'],
                volume_ml: 2.0,
                stock: 80
            },
            {
                perfume_id: perfumeMap['Arabians Tonka'],
                volume_ml: 2.0,
                stock: 70
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.bulkDelete('samples', null, {});
    }
};

