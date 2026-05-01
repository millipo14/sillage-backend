'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class PerfumeVolume extends Model {
        static associate(models) {
            PerfumeVolume.belongsTo(models.Perfume, { foreignKey: 'perfume_id', as: 'perfume' });
        }
    }

    PerfumeVolume.init(
        {
            perfume_id: { type: DataTypes.INTEGER, allowNull: false },
            volume_ml: { type: DataTypes.FLOAT, allowNull: false },
            price: { type: DataTypes.FLOAT, allowNull: false },
        },
        {
            sequelize,
            modelName: 'PerfumeVolume',
            tableName: 'perfume_volumes',
            underscored: true,
            timestamps: true,
        }
    );

    return PerfumeVolume;
};