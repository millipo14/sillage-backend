'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: 'customer_id',
                as: 'customer'
            });
            Order.hasMany(models.OrderItem, {
                foreignKey: 'order_id',
                as: 'items'
            });
        }
    }

    Order.init({
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'order_id'
        },
        customer_id: { type: DataTypes.INTEGER, allowNull: false },
        order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        total_amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        loyalty_points_earned: { type: DataTypes.INTEGER, defaultValue: 0 },
        loyalty_points_spent: { type: DataTypes.INTEGER, defaultValue: 0 },
        payment_status: DataTypes.STRING(50),
        shipping_address: DataTypes.TEXT,
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'pending'
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true,
        createdAt: 'order_date',
        schema: 'sillage_eclatant',
        updatedAt: false,
        underscored: true
    });

    return Order;
};