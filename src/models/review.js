'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, {//отзыв от пользователя
                foreignKey: 'customer_id',
                as: 'customer'
            });
            Review.belongsTo(models.Perfume, {//отзыв на парфюм
                foreignKey: 'perfume_id',
                as: 'perfume'
            });
        }
    }

    Review.init({
        review_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'review_id'
        },
        customer_id: { type: DataTypes.INTEGER, allowNull: false },
        perfume_id: { type: DataTypes.INTEGER, allowNull: false },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 5 }
        },
        comment: DataTypes.TEXT,
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true
    });

    return Review;
};