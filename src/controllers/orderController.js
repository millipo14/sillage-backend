const { Order, OrderItem, Perfume, User, PerfumeVolume } = require('../models');

const orderController = {
    // Создать заказ
    createOrder: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { items, shipping_address, loyalty_points_spent = 0 } = req.body;

            // Расчет общей суммы
            let totalAmount = 0;
            const orderItems = [];

            // Проверка и расчет каждого товара
            for (const item of items) {
                const variant = await PerfumeVolume.findOne({
                    where: {
                        perfume_id: item.perfume_id,
                        volume_ml: item.volume
                    }
                });
                // ЛОГ ДЛЯ ПРОВЕРКИ
                console.log(`Perfume ID: ${item.perfume_id}, Volume: ${item.volume}ml, Found Price: ${variant?.price}`);

                if (!variant || variant.price === undefined || variant.price === null) {
                    return res.status(400).json({
                        error: `Цена для товара ${item.perfume_id} (объем ${item.volume}мл) не найдена`
                    });
                }
                const itemTotal = Number(variant.price) * Number(item.quantity);
                totalAmount += itemTotal;

                orderItems.push({
                    perfume_id: item.perfume_id,
                    product_type: item.product_type || 'perfume',
                    quantity: item.quantity,
                    price_at_purchase: variant.price
                });
            }

            // const loyalty_points_earned = Math.floor(totalAmount * 0.01);

            // Создание заказа
            const order = await Order.create({
                customer_id: userId,
                total_amount: totalAmount,
                loyalty_points_earned: 0,
                loyalty_points_spent: 0,
                shipping_address,
                payment_status: 'pending',
                status: 'pending'
            });

            // Создание элементов заказа
            for (const item of orderItems) {
                await OrderItem.create({
                    order_id: order.order_id,
                    ...item
                });
            }

            // Обновление баллов пользователя
            const user = await User.findByPk(userId);
            // const newPoints = user.loyalty_points + loyalty_points_earned - loyalty_points_spent;
            // await user.update({ loyalty_points: newPoints });

            res.status(201).json({
                message: 'Order created successfully',
                order: {
                    order_id: order.order_id,
                    total_amount: order.total_amount,
                    // loyalty_points_earned,
                    // loyalty_points_spent,
                    order_date: order.order_date
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить детали заказа
    getOrderDetails: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.userId;

            const order = await Order.findOne({
                where: { order_id: id, customer_id: userId },
                include: [
                    { model: OrderItem, as: 'items', include: ['perfume'] },
                    { model: User, as: 'customer', attributes: ['first_name', 'last_name', 'email'] }
                ]
            });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Получить все заказы пользователя
    getUserOrders: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { status, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const where = { customer_id: userId };
            if (status) where.status = status;

            const { count, rows } = await Order.findAndCountAll({
                where,
                include: [{ model: OrderItem, as: 'items' }],
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
    },
    //удалить заказ
    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.userId;

            // Ищем заказ, принадлежащий именно этому пользователю
            const order = await Order.findOne({ where: { order_id: id, customer_id: userId } });

            if (!order) {
                return res.status(404).json({ error: 'Заказ не найден' });
            }

            // Удаляем связанные элементы вручную (если в миграциях не стоит CASCADE)
            await OrderItem.destroy({ where: { order_id: id } });

            // Удаляем сам заказ
            await order.destroy();

            res.json({ message: 'Заказ успешно удален' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = orderController;