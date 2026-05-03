'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Sample extends Model {
        static associate(models) {
            Sample.belongsTo(models.Perfume, {//к какому парфюму
                foreignKey: 'perfume_id',
                as: 'perfume'
            });
            Sample.hasMany(models.SubscriptionSample, {//в каком тарифе
                foreignKey: 'sample_id',
                as: 'subscription_samples'
            });
        }
    }

    Sample.init({
        sample_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'sample_id'
        },
        perfume_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'perfumes',
                key: 'perfume_id'
            }
        },
        volume_ml: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false,
            validate: {
                isIn: [[1.5, 2.0, 2.5]]
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: { min: 0 }
        },
    }, {
        sequelize,
        modelName: 'Sample',
        tableName: 'samples',
        timestamps: false,
        underscored: true
    });

    return Sample;
};