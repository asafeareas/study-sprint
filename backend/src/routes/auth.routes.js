const { Router } = require('express')
const authController = require('../controllers/auth.controller')
const { authMiddleware } = require('../middleware/auth.middleware')
const { authLimiter } = require('../middleware/rateLimit.middleware')

const router = Router()

router.post('/register', authLimiter, authController.register)
router.post('/login', authLimiter, authController.login)
router.get('/me', authMiddleware, authController.me)
router.post('/logout', authMiddleware, authController.logout)

module.exports = router
