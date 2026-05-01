const router = require('express').Router();
const preferenceController = require('../controllers/preferenceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', preferenceController.getUserPreferences);
router.get('/quiz-options', preferenceController.getQuizOptions);
router.post('/brands', preferenceController.addBrandPreference);
router.post('/notes', preferenceController.addNotePreference);
router.post('/quiz', preferenceController.saveQuizResults);
router.delete('/brands/:brand_id', preferenceController.removeBrandPreference);
router.delete('/notes/:note_id', preferenceController.removeNotePreference);
router.delete('/clear', preferenceController.clearPreferences);

module.exports = router;