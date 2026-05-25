const { Router } = require('express')
const sprintController = require('../controllers/sprint.controller')
const { authMiddleware } = require('../middleware/auth.middleware')

const router = Router()

router.use(authMiddleware)

router.post('/start', sprintController.start)
router.post('/complete', sprintController.complete)
router.post('/abandon', sprintController.abandon)
router.get('/history', sprintController.history)

module.exports = router
