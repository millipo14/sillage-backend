'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class SubscriptionSample extends Model {
        static associate(models) {
            SubscriptionSample.belongsTo(models.Subscription, {//запись подписки
                foreignKey: 'subscription_id',
                as: 'subscription'
            });
            SubscriptionSample.belongsTo(models.Sample, {//запись пробника
                foreignKey: 'sample_id',
                as: 'sample'
            });
        }
    }

    SubscriptionSample.init({
        subscription_sample_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'subscription_sample_id'
        },
        subscription_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subscriptions',
                key: 'subscription_id'
            }
        },
        sample_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'samples',
                key: 'sample_id'
            }
        },
        sample_type: {
            type: DataTypes.ENUM('recommended', 'custom'),
            defaultValue: 'custom',
            allowNull: false
        },
        selection_date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM('selected', 'shipped', 'delivered'),
            defaultValue: 'selected'
        }
    }, {
        sequelize,
        modelName: 'SubscriptionSample',
        tableName: 'subscription_samples',
        timestamps: false,
        underscored: true
    });

    return SubscriptionSample;
};