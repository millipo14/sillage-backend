'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Perfume extends Model {
        static associate(models) {
            // Связь с брендом (один-к-одному)
            Perfume.belongsTo(models.Brand, { foreignKey: 'brand_id', as: 'brand' });
            // Связь с нотами (один-ко-многим)
            Perfume.hasMany(models.Note, { foreignKey: 'perfume_id', as: 'notes' });
            // Связь с отзывами
            Perfume.hasMany(models.Review, { foreignKey: 'perfume_id', as: 'reviews' });
            // Связь с пробниками
            Perfume.hasMany(models.Sample, { foreignKey: 'perfume_id', as: 'samples' });
            // Связь с элементами заказа
            Perfume.hasMany(models.OrderItem, { foreignKey: 'perfume_id', as: 'order_items' });
            // Связь с объемами
            Perfume.hasMany(models.PerfumeVolume, { foreignKey: 'perfume_id', as: 'volumes' });
        }
    }

    Perfume.init({
        perfume_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'perfume_id'
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'brands', key: 'brand_id' }
        },
        name: { type: DataTypes.STRING(200), allowNull: false },
        description: DataTypes.TEXT,
        gender: { type: DataTypes.ENUM('male', 'female', 'unisex'), allowNull: false },
        concentration: DataTypes.STRING(100),
        image_url: DataTypes.STRING(500),
        perfume_category: DataTypes.STRING(100),
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        sequelize,
        modelName: 'Perfume',
        tableName: 'perfumes',
        timestamps: true,
        createdAt: 'created_at',
        schema: 'sillage_eclatant',
        updatedAt: true,
        underscored: true,
        freezeTableName: true
    });

    return Perfume;
};