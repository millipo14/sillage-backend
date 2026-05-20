'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_items', 'volume', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 50
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('order_items', 'volume');
  }
};