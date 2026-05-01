'use strict';
//инициализация всех моделей sequelize, автоматический сбор всех моделей из директории и настройка подключения к бд
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {//для продакшена (с переменной окружения)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {//для разработки
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)//чтение всех файлов в этой директории
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {//импорт модели из файла
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;//сохранение модели в объект db по имени модели
  });

Object.keys(db).forEach(modelName => {//настройка ассоциаций между моделями
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;//экземпляр подключения
db.Sequelize = Sequelize;//библиотека Sequelize

module.exports = db;
