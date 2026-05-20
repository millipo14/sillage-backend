const { Op, fn, col, literal } = require('sequelize');
const { Order, User, OrderItem, Perfume } = require('../models');

const getDateFilter = (period) => {
    const now = new Date();
    let startDate;

    switch (period) {
        case 'day':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 1);
            break;

        case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            break;

        case 'month':
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1);
            break;

        default:
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
    }

    return {
        [Op.gte]: startDate
    };
};
const getPreviousDateFilter = (period) => {
    const now = new Date();
    let startDate = new Date(now);
    let endDate = new Date(now);

    switch (period) {
        case 'day':
            startDate.setDate(now.getDate() - 2);
            endDate.setDate(now.getDate() - 1);
            break;
        case 'week':
            startDate.setDate(now.getDate() - 14);
            endDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(now.getMonth() - 2);
            endDate.setMonth(now.getMonth() - 1);
            break;
        default:
            startDate.setDate(now.getDate() - 14);
            endDate.setDate(now.getDate() - 7);
    }

    return { [Op.gte]: startDate, [Op.lt]: endDate };
};

const adminAnalyticsController = {
    // Общая статистика
    getDashboardStats: async (req, res) => {
        try {
            const period = req.query.period || 'week';
            const currentFilter = getDateFilter(period);
            const prevFilter = getPreviousDateFilter(period);

            const calculateTrend = (current, previous) => {
                if (!previous || previous === 0) {
                    return current > 0 ? '+100%' : '0%';
                }
                const diff = ((current - previous) / previous) * 100;

                const formattedDiff = Math.abs(diff) < 10 ? diff.toFixed(1) : Math.round(diff);
                return `${diff > 0 ? '+' : ''}${formattedDiff}%`;
            };

            const revenue = await Order.sum('total_amount', { where: { order_date: currentFilter } }) || 0;
            const ordersCount = await Order.count({ where: { order_date: currentFilter } });
            const usersCount = await User.count({ where: { created_at: currentFilter } });

            const prevRevenue = await Order.sum('total_amount', { where: { order_date: prevFilter } }) || 0;
            const prevOrdersCount = await Order.count({ where: { order_date: prevFilter } });
            const prevUsersCount = await User.count({ where: { created_at: prevFilter } });

            const currentAvg = ordersCount ? revenue / ordersCount : 0;
            const prevAvg = prevOrdersCount ? prevRevenue / prevOrdersCount : 0;

            res.json({
                revenue: Math.round(revenue),
                ordersCount,
                averageCheck: Math.round(currentAvg),
                usersCount,
                trends: {
                    revenue: calculateTrend(revenue, prevRevenue),
                    orders: calculateTrend(ordersCount, prevOrdersCount),
                    averageCheck: calculateTrend(currentAvg, prevAvg),
                    users: calculateTrend(usersCount, prevUsersCount)
                }
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // График выручки и заказов
    getRevenueAnalytics: async (req, res) => {
        try {
            const period = req.query.period || 'week';
            const now = new Date();
            const dateFilter = getDateFilter(period);

            const groupFormat = period === 'day'
                ? fn('date_trunc', 'hour', col('order_date'))
                : fn('DATE', col('order_date'));

            const rawOrders = await Order.findAll({
                where: { order_date: dateFilter },
                attributes: [
                    [groupFormat, 'date'],
                    [fn('SUM', col('total_amount')), 'revenue'],
                    [fn('COUNT', col('order_id')), 'orders']
                ],
                group: [literal('date')],
                order: [[literal('date'), 'ASC']]
            });

            const fullData = [];
            let startDate = new Date(dateFilter[Op.gte]);

            while (startDate <= now) {
                const currentDateStr = period === 'day'
                    ? startDate.toISOString()
                    : startDate.toISOString().split('T')[0];

                const found = rawOrders.find(o => {
                    const dbDate = new Date(o.get('date'));
                    return period === 'day'
                        ? dbDate.getHours() === startDate.getHours() && dbDate.getDate() === startDate.getDate()
                        : dbDate.toISOString().split('T')[0] === currentDateStr;
                });

                fullData.push({
                    date: startDate.toISOString(),
                    revenue: found ? Number(found.get('revenue')) : 0,
                    orders: found ? Number(found.get('orders')) : 0
                });

                if (period === 'day') {
                    startDate.setHours(startDate.getHours() + 1);
                } else {
                    startDate.setDate(startDate.getDate() + 1);
                }
            }

            res.json(fullData);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Распределение по полу
    getGenderStats: async (req, res) => {
        try {
            const stats = await OrderItem.findAll({
                include: [{
                    model: Perfume,
                    as: 'perfume',
                    attributes: []
                }],
                attributes: [
                    [col('perfume.gender'), 'gender'],
                    [fn('SUM', col('quantity')), 'count']
                ],
                group: [col('perfume.gender')],
                raw: true
            });

            const labels = {
                'female': 'Женские',
                'male': 'Мужские',
                'unisex': 'Унисекс'
            };

            const formattedData = stats.map(item => ({
                name: labels[item.gender] || 'Другое',
                value: Number(item.count)
            }));

            res.json(formattedData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Хиты продаж
    getTopPerfumes: async (req, res) => {
        try {
            const period = req.query.period || 'week';

            const dateFilter = getDateFilter(period);

            const topPerfumes = await OrderItem.findAll({
                include: [
                    {
                        model: Order,
                        as: 'order',
                        where: {
                            order_date: dateFilter
                        },
                        attributes: []
                    },
                    {
                        model: Perfume,
                        as: 'perfume',
                        attributes: ['name', 'image_url']
                    }
                ],
                attributes: [
                    'perfume_id',
                    [fn('SUM', col('quantity')), 'totalSold']
                ],
                group: ['OrderItem.perfume_id', 'perfume.perfume_id'],
                order: [[fn('SUM', col('quantity')), 'DESC']],
                limit: 5
            });

            res.json(topPerfumes);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = adminAnalyticsController;