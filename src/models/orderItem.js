'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, {//позиция заказа принадлежит заказу
                foreignKey: 'order_id',
                as: 'order'
            });
            OrderItem.belongsTo(models.Perfume, {//позиция заказа принадлежит парфюму
                foreignKey: 'perfume_id',
                as: 'perfume'
            });
        }
    }

    OrderItem.init({
        order_item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'order_item_id'
        },
        order_id: { type: DataTypes.INTEGER, allowNull: false },
        perfume_id: DataTypes.INTEGER,
        product_type: {
            type: DataTypes.ENUM('perfume', 'sample'),
            allowNull: false
        },
        quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
        price_at_purchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: false,
        underscored: true
    });

    return OrderItem;
};