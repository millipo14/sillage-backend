'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotePreference extends Model {
        static associate(models) {
            NotePreference.belongsTo(models.User, {//принадлежность пользователю
                foreignKey: 'customer_id',
                as: 'customer'
            });
            NotePreference.belongsTo(models.Note, {//принадлежность ноте
                foreignKey: 'note_id',
                as: 'note'
            });
        }
    }

    NotePreference.init({
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'customers',
                key: 'customer_id'
            }
        },
        note_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'perfume_notes',
                key: 'note_id'
            }
        }
    }, {
        sequelize,
        modelName: 'NotePreference',
        tableName: 'note_preferences',
        schema: 'sillage_eclatant',
        timestamps: false,
        underscored: true
    });

    return NotePreference;
};