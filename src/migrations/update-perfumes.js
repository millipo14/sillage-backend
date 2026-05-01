'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        // Обновляем пути для Mancera
        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/mancera/amore-caffe.webp' 
      WHERE name = 'Amore Caffe' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Mancera')
    `);

        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/mancera/xplicit-vanilla.jpg' 
      WHERE name = 'Xplicit Vanilla' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Mancera')
    `);

        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/mancera/cherry-cherry.webp' 
      WHERE name = 'Cherry Cherry' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Mancera')
    `);

        // Обновляем для Montale
        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/montale/arabians-tonka.webp' 
      WHERE name = 'Arabians Tonka' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Montale')
    `);

        // Обновляем для Montale Chocolate Greedy (оба объема)
        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/montale/chocolate-greedy100.webp' 
      WHERE name = 'Chocolate Greedy' AND volume_ml = 100.00
    `);

        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/montale/chocolate-greedy50.webp' 
      WHERE name = 'Chocolate Greedy' AND volume_ml = 50.00
    `);

        // Обновляем Herbal Aquatica
        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/montale/herbal-aquatica100.webp' 
      WHERE name = 'Herbal Aquatica' AND volume_ml = 100.00
    `);

        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/montale/herbal-aquatica50.webp' 
      WHERE name = 'Herbal Aquatica' AND volume_ml = 50.00
    `);

        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/montale/wild-pears.webp' 
      WHERE name = 'Wild Pears' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Montale')
    `);

        // Обновляем Tiziana Terenzi
        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/tiziana-terenzi/kirke.webp' 
      WHERE name = 'Kirké' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Tiziana Terenzi')
    `);

        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/tiziana-terenzi/kirke-overdose.webp' 
      WHERE name = 'Kirké Overdose' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Tiziana Terenzi')
    `);

        await queryInterface.sequelize.query(`
      UPDATE perfumes 
      SET image_url = '/images/perfumes/tiziana-terenzi/cassiopea.webp' 
      WHERE name = 'Cassiopea' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Tiziana Terenzi')
    `);

        //     await queryInterface.sequelize.query(`
        //   UPDATE perfumes 
        //   SET image_url = '/images/perfumes/tiziana-terenzi/moro-di-venezia.webp' 
        //   WHERE name = 'Moro di Venezia' AND brand_id = (SELECT brand_id FROM brands WHERE name = 'Tiziana Terenzi')
        // `);
    },

    async down(queryInterface, Sequelize) {
        //здесь можно вернуть старые пути (но необязательно оставить пустым)
    }
};