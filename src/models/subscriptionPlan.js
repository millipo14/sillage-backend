'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SubscriptionPlan extends Model {
        static associate(models) {
            SubscriptionPlan.hasMany(models.Subscription, {//у тарифа мб много подписок
                foreignKey: 'plan_id',
                as: 'subscriptions'
            });
        }
    }

    SubscriptionPlan.init({
        plan_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'plan_id'
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: DataTypes.TEXT,
        price_per_month: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        samples_included: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sample_volume_ml: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false
        },
        recommended_samples: {  
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        custom_samples: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SubscriptionPlan',
        tableName: 'subscription_plans',
        timestamps: false,
        underscored: true
    });

    return SubscriptionPlan;
};