'use strict';
const { Model } = require('sequelize'); //импорт абстракции, которая представляет таблицу бд

module.exports = (sequelize, DataTypes) => {//экспорт функции, принимает подключение к бд и типы данных
    class Brand extends Model {
        static associate(models) {//метод связей м/у моделями
            Brand.hasMany(models.Perfume, { //установка связи (здесь один ко многим - у одного бренда много парфюмов)
                foreignKey: 'brand_id', //внешний ключ
                as: 'perfumes' //псевдоним для доступа
            });
        }
    }

    Brand.init({//инициализация модели
        //определение полей
        brand_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'brand_id' },
        name: { type: DataTypes.STRING, allowNull: false },
        description: DataTypes.TEXT,
        country: DataTypes.STRING,
        luxury_level: { type: DataTypes.ENUM('niche', 'premium'), allowNull: false },
        logo_url: DataTypes.STRING,
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {//настройки модели
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