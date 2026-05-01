# Sillage Backend

Бэкенд-часть платформы для персонализрованного подбора и заказа парфюмерии. Сейчас в разработке.

## Стек технологий
*   **Node.js** — среда выполнения
*   **Express** — фреймворк для API
*   **Sequelize** — ORM для работы с базой данных
*   **PostgreSQL** — база данных

## Основной функционал
*   Каталог парфюмерии с фильтрацией (по брендам, категориям, нотам).
*   Система управления пользователями и профилями.
*   Логика оформления и отслеживания заказов.
*   Система подписок.

## API Документация

**Base URL:** `http://localhost:5000/api`

### Auth & Users
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/users/register` | Регистрация нового пользователя | Public |
| POST | `/users/login` | Вход в систему | Public |
| GET | `/users/profile` | Получение данных профиля | Private (Token) |
| GET | `/users` | Список всех пользователей | Admin |

### Perfumes & Brands
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/brands` | Все доступные бренды |
| GET | `/perfumes` | Весь каталог парфюмерии |
| GET | `/perfumes/search?q=...` | Поиск по ароматам |
| GET | `/perfumes/:id` | Информация о конкретном аромате |

### Subscriptions & Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/subscriptions/plans` | Доступные тарифные планы |
| POST | `/subscriptions` | Оформление подписки |
| GET | `/samples/available` | Список доступных пробников |

### Recommendations & Preferences
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/preferences/quiz-options` | Варианты для квиза по предпочтениям |
| POST | `/preferences/quiz` | Сохранение результатов теста |
| GET | `/recommendations` | Персональные рекомендации |