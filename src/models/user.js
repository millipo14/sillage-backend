'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs'); //библиотека для безопасного хеширования паролей

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Order, {// пользователь может иметь много заказов
                foreignKey: 'customer_id',
                as: 'orders'
            });
            User.hasMany(models.Subscription, {//пользователь может иметь много подписок
                foreignKey: 'customer_id',
                as: 'subscriptions'
            });
            User.hasMany(models.Review, { //пользователь может иметь много отзывов
                foreignKey: 'customer_id',
                as: 'reviews'
            });
            User.belongsToMany(models.Brand, { //пользователь может предпочитать много брендов
                through: 'brand_preferences',
                as: 'preferred_brands',
                foreignKey: 'customer_id',
                otherKey: 'brand_id'
            });
            User.belongsToMany(models.Note, { //пользователь может предпочитать много брендов
                through: 'note_preferences',
                as: 'preferred_note',
                foreignKey: 'customer_id',
                otherKey: 'note_id'
            });
        }
        /**
         * метод экземпляра для проверки пароля
         * @param {string} candidatePassword - пароль для проверки (в открытом виде)
         * @returns {Promise<boolean>} - true если пароль верный
         */
        async checkPassword(candidatePassword) {
            return await bcrypt.compare(candidatePassword, this.password_hash);
        }
        /**
         * метод для безопасного обновления пароля
         * @param {string} newPassword - новый пароль (в открытом виде)
         * @returns {Promise<User>} - обновленный пользователь
         */
        async updatePassword(newPassword) {
            const salt = await bcrypt.genSalt(10); // генерация соли
            this.password_hash = await bcrypt.hash(newPassword, salt); // хеширование пароля
            return await this.save(); // сохранение изменения
        }
    }

    User.init({
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'customer_id'
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: [8, 255]
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            validate: {
                is: /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,3}[-\s\.]?[0-9]{4,6}$/im
            }
        },
        loyalty_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        subscription_status: {
            type: DataTypes.STRING(50),
            defaultValue: 'inactive',
            validate: {
                isIn: [['active', 'inactive', 'paused', 'cancelled']]
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        target_gender: {
            type: DataTypes.STRING,
            allowNull: true // по умолчанию пусто, пока не пройден квиз
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'customers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
        hooks: {
            beforeCreate: async (user) => {
                // хешируем пароль только если он был передан
                if (user.password_hash && !user.password_hash.startsWith('$2')) {
                    // $2 - признак bcrypt хеша, проверяем не захеширован ли уже пароль
                    const salt = await bcrypt.genSalt(10); // генерируем соль (cost factor = 10)
                    user.password_hash = await bcrypt.hash(user.password_hash, salt);
                }
            },
            beforeUpdate: async (user) => {
                // хешируем пароль только если он был изменен
                if (user.changed('password_hash') && !user.password_hash.startsWith('$2')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password_hash = await bcrypt.hash(user.password_hash, salt);
                }
            },
            afterCreate: (user) => {
                // удаляем password_hash из объекта для безопасности
                // (чтобы случайно не отправить в ответе API)
                delete user.dataValues.password_hash;
            }
        },
        defaultScope: {// предопределенные фильтры для запросов
            attributes: {
                exclude: ['password_hash'] // по умолчанию исключаем password_hash из запросов
            }
        },
        scopes: {
            withPassword: {
                attributes: {
                    include: ['password_hash'] // включаем password_hash при необходимости
                }
            },
            activeSubscriptions: {
                where: {
                    subscription_status: 'active'
                }
            }
        }
    });

    return User;
};