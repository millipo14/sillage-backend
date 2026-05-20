'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Subscription extends Model {
        static associate(models) {
            Subscription.belongsTo(models.User, {//какого пользователя подписка
                foreignKey: 'customer_id',
                as: 'customer'
            });
            Subscription.belongsTo(models.SubscriptionPlan, {//какой тариф подписки
                foreignKey: 'plan_id',
                as: 'plan'
            });
            Subscription.hasMany(models.SubscriptionSample, {//пробники в подписке
                foreignKey: 'subscription_id',
                as: 'selected_samples'
            });
        }
    }

    Subscription.init({
        subscription_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'subscription_id'
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'customers',
                key: 'customer_id'
            }
        },
        plan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subscription_plans',
                key: 'plan_id'
            }
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: DataTypes.DATEONLY,
        status: {
            type: DataTypes.ENUM('active', 'paused', 'cancelled'),
            defaultValue: 'active'
        },
        payment_status: DataTypes.STRING(50),
        shipping_status: DataTypes.STRING(50),
        shipping_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Subscription',
        tableName: 'subscriptions',
        timestamps: true,
        createdAt: 'created_at',
        schema: 'sillage_eclatant',
        updatedAt: false,
        underscored: true
    });

    return Subscription;
};