'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BrandPreference extends Model {
        static associate(models) {
            BrandPreference.belongsTo(models.User, {//принадлежность к пользователю
                foreignKey: 'customer_id',
                as: 'customer'
            });
            BrandPreference.belongsTo(models.Brand, {//принадлежность к бренду
                foreignKey: 'brand_id',
                as: 'brand'
            });
        }
    }

    BrandPreference.init({//первичный ключ составной - из customer_id и brand_id
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'customers',//таблица
                key: 'customer_id'//поле таблицы
            }
        },
        brand_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'brand_id'
            }
        }
    }, {
        sequelize,
        modelName: 'BrandPreference',
        tableName: 'brand_preferences',
        timestamps: false,
        underscored: true
    });

    return BrandPreference;
};