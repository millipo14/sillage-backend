const { admins } = require('../config/admins')

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).json({ error: 'Доступ только администраторам.' })
    }
}

module.exports = adminMiddleware