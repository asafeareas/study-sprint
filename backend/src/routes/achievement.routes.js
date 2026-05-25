const { Router } = require('express')
const achievementController = require('../controllers/achievement.controller')
const { authMiddleware } = require('../middleware/auth.middleware')

const router = Router()

router.get('/', achievementController.getAll)
router.get('/mine', authMiddleware, achievementController.getMine)
router.post('/seed', achievementController.seed)

module.exports = router
