'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CategoryPreference extends Model {
        static associate(models) {
            CategoryPreference.belongsTo(models.User, {
                foreignKey: 'customer_id',
                as: 'customer'
            });
        }
    }

    CategoryPreference.init({
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'customers',
                key: 'customer_id'
            }
        },
        category_name: {
            type: DataTypes.STRING,
            primaryKey: true, // Делаем составной ключ, чтобы нельзя было дублировать
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'CategoryPreference',
        tableName: 'category_preferences',
        timestamps: false,
        underscored: true
    });

    return CategoryPreference;
};