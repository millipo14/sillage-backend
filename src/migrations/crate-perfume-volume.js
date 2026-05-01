'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query('SET search_path TO sillage_eclatant');
        await queryInterface.createTable('perfume_volumes', {
            id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            perfume_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'perfumes', key: 'perfume_id' }, onDelete: 'CASCADE' },
            volume_ml: { type: Sequelize.FLOAT, allowNull: false },
            price: { type: Sequelize.FLOAT, allowNull: false },
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('perfume_volumes');
    },
};