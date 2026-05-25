const { Router } = require('express')
const rankingController = require('../controllers/ranking.controller')
const { authMiddleware } = require('../middleware/auth.middleware')

const router = Router()

router.get('/leaderboard', rankingController.leaderboard)
router.get('/online', rankingController.online)
router.get('/me', authMiddleware, rankingController.myRank)
router.post('/ping', authMiddleware, rankingController.ping)

module.exports = router
