const router = require('express').Router();

const defaultController = require('../controllers/defaultController');

router.get('/questionnaire', defaultController.getQuestions);

module.exports = router;
 