'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Note extends Model {
        static associate(models) {
            Note.belongsTo(models.Perfume, { // каждая нота принадлежит одному парфюму
                foreignKey: 'perfume_id',
                as: 'perfume'
            });
        }
    }

    Note.init({
        note_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'note_id'
        },
        perfume_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'perfumes',
                key: 'perfume_id'
            }
        },
        note_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Note',
        tableName: 'perfume_notes',
        timestamps: false,
        underscored: true
    });

    return Note;
};