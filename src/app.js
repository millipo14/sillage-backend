const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { User } = require('./models');
const routes = require('./routes');
const path = require('path');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// статические файлы
app.use('/images', express.static(path.resolve(__dirname, './public/images')));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', routes);

// маршрут для проверки
app.get('/api/health', (req, res) => {
    const now = new Date();
    res.json({
        status: 'OK',
        message: 'Sillage Éclatant API is running',
        serverTime: now.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
            hour12: false
        }),
        version: '1.0.0',
        endpoints: 'See /api/docs for all endpoints'
    });
});

app.get('/api/admin/reviews-check', async (req, res) => {
    try {
        const { Review, Perfume, User } = require('./models');

        const allReviews = await Review.findAll({
            include: [
                {
                    model: Perfume,
                    as: 'perfume',
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'customer',
                    attributes: ['first_name', 'email']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(allReviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// документация всех API endpoints
app.get('/api/docs', async (req, res) => {
    try {
        const userCount = await User.count();
        res.json({
            message: 'Sillage Éclatant API Documentation',
            stats: {
                totalUsers: userCount
            },
            version: '1.0.0',
            baseUrl: 'http://localhost:5000/api',
            endpoints: {
                auth: {
                    register: 'POST /api/users/register',
                    login: 'POST /api/users/login',
                    profile: 'GET /api/users/profile (требуется токен)',
                    allUsers: 'GET /api/users (админ-доступ)'
                },
                brands: {
                    getAll: 'GET /api/brands',
                    getById: 'GET /api/brands/:id'
                },
                perfumes: {
                    getAll: 'GET /api/perfumes',
                    search: 'GET /api/perfumes/search?q=...',
                    getById: 'GET /api/perfumes/:id'
                },
                subscriptions: {
                    plans: 'GET /api/subscriptions/plans',
                    create: 'POST /api/subscriptions (требуется токен)',
                    getUserSubscriptions: 'GET /api/subscriptions (требуется токен)',
                    recommended: 'GET /api/subscriptions/recommended (требуется токен)'
                },
                samples: {
                    getAll: 'GET /api/samples',
                    available: 'GET /api/samples/available'
                },
                reviews: {
                    getByPerfume: 'GET /api/reviews/perfume/:perfume_id',
                    create: 'POST /api/reviews (требуется токен)'
                },
                recommendations: {
                    getRecommendations: 'GET /api/recommendations (требуется токен)',
                    popular: 'GET /api/recommendations/popular'
                },
                preferences: {
                    getOptions: 'GET /api/preferences/quiz-options (требуется токен)',
                    saveQuiz: 'POST /api/preferences/quiz (требуется токен)',
                    getUserPrefs: 'GET /api/preferences (требуется токен)'
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Главная страница
// ДОБАВЛЕНО async и получение recentUsers
app.get('/', async (req, res) => {
    try {
        const recentUsers = await User.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['first_name', 'email']
        });

        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sillage Éclatant API</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; background: #fafafa; }
                .container { max-width: 800px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #d63384; }
                .user-list { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
                .user-tag { background: #e9ecef; padding: 5px 12px; border-radius: 15px; font-size: 0.85em; color: #495057; border: 1px solid #dee2e6; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🌸 Sillage Éclatant API</h1>
                <p>Сервер запущен и готов к работе.</p>

                <h2>👥 Последние зарегистрированные:</h2>
                <div class="user-list">
                    ${recentUsers.length > 0
                ? recentUsers.map(u => `<div class="user-tag">👤 ${u.first_name} (${u.email})</div>`).join('')
                : 'Пользователей пока нет'}
                </div>

                <h2>📡 Полезные ссылки</h2>
                <ul>
                    <li><a href="/api/docs">Полная документация API</a></li>
                    <li><a href="/api/health">Статус сервера</a></li>
                </ul>
            </div>
        </body>
        </html>
        `);
    } catch (error) {
        res.status(500).send("Ошибка сервера при загрузке страницы");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    🚀 Сервер запущен!
    📍 Локально: http://localhost:${PORT}
    📍 API Health: http://localhost:${PORT}/api/health
    📍 API Docs: http://localhost:${PORT}/api/docs
    `);
});