const { User, Order, Subscription, Note, CategoryPreference, Perfume, OrderItem } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { admins } = require('../config/admins');

const userController = {
    // Регистрация
    register: async (req, res) => {
        try {
            const { email, password, first_name, last_name, phone } = req.body;
            // Проверка существования пользователя
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
            // Хеширование пароля
            const password_hash = await bcrypt.hash(password, 10);
            // создание пользователя
            const user = await User.create({
                email,
                password_hash,
                first_name,
                last_name,
                phone,
                loyalty_points: 0,
                subscription_status: 'none'
            });

            // Создание JWT токена
            const token = jwt.sign(
                { userId: user.customer_id, email: user.email, role: 'user' },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    customer_id: user.customer_id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name
                },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Вход
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log("DEBUG: Начало процесса входа для:", email); // ДОБАВЬ ЭТО
            const admin = admins.find(a => a.email === email)
            if (admin && admin.password === password) {
                const token = jwt.sign(
                    { email: admin.email, role: 'admin' },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                )
                return res.json({ token, user: { email: admin.email, role: 'admin' } })
            }

            // Поиск пользователя
            const user = await User.scope('withPassword').findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            console.log("DEBUG: Пользователь найден, проверяем пароль..."); // ДОБАВЬ ЭТО

            // Проверка пароля
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            console.log("DEBUG: Пароль верен, генерируем токен..."); // ДОБАВЬ ЭТО
            // Создание JWT токена
            const token = jwt.sign(
                { userId: user.customer_id, email: user.email, role: 'user' },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );
            console.log("DEBUG: Токен успешно сгенерирован"); // ДОБАВЬ ЭТО
            res.json({
                message: 'Login successful',
                user: {
                    customer_id: user.customer_id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    subscription_status: user.subscription_status,
                },
                token
            });
        } catch (error) {
            console.error("DEBUG: ОШИБКА В LOGIN:", error); // ВАЖНО: ЭТО ПОКАЖЕТ ТЕКСТ ОШИБКИ
            res.status(500).json({ error: error.message });
        }
    },

    // Получить профиль
    getProfile: async (req, res) => {
        try {
            const userId = req.user.userId;
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password_hash'] },
                include: [
                    { model: Order, as: 'orders', limit: 5, order: [['order_date', 'DESC']] },
                    { model: Subscription, as: 'subscription' }
                ]
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: ['customer_id', 'first_name', 'last_name', 'email', 'phone', 'target_gender', 'created_at', 'subscription_status'],
                include: [
                    {
                        model: Order,
                        as: 'orders',
                        include: [
                            {
                                model: OrderItem,
                                as: 'items',
                                include: [
                                    { model: Perfume, as: 'perfume' }
                                ]
                            }
                        ]
                    },
                    {
                        model: Note,
                        as: 'preferred_note',
                        attributes: ['note_name'],
                        through: { attributes: [] }
                    },
                    {
                        model: CategoryPreference,
                        as: 'categoryPreferences',
                        attributes: ['category_name']
                    }
                ]
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // Обновить профиль
    updateProfile: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { first_name, last_name, phone } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            await user.update({
                first_name: first_name || user.first_name,
                last_name: last_name || user.last_name,
                phone: phone || user.phone
            });

            res.json({
                message: 'Profile updated successfully',
                user: {
                    customer_id: user.customer_id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить историю заказов
    getOrderHistory: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const { count, rows } = await Order.findAndCountAll({
                where: { customer_id: userId },
                include: [
                    { model: OrderItem, as: 'items', include: ['perfume'] }
                ],
                order: [['order_date', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            res.json({
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit),
                orders: rows
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;