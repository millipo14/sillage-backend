'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Brand extends Model {
        static associate(models) {
            Brand.hasMany(models.Perfume, { 
                foreignKey: 'brand_id', 
                as: 'perfumes' 
            });
        }
    }

    Brand.init({
        brand_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'brand_id' },
        name: { type: DataTypes.STRING, allowNull: false },
        description: DataTypes.TEXT,
        country: DataTypes.STRING,
        luxury_level: { type: DataTypes.ENUM('niche', 'premium'), allowNull: false },
        logo_url: DataTypes.STRING,
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        sequelize,
        modelName: 'Brand',
        tableName: 'brands',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true
    });

    return Brand;
};