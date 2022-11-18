/**
 * Route: /api/quiz | Visitor route
 */

var express = require('express');
var router = express.Router();
const quizController = local_require('app/controllers/api/quiz');

/** Visitor answer sheet */
// TODO: route: /api/quiz/:permalink_code/:visitor_id/answer/answer_id
// TODO: route: /api/quiz/:permalink_code/:visitor_id/answer
// TODO: route: /api/quiz/:permalink_code/:visitor_id

/** QUIZ info */

// route: /api/quiz/:permalink_code
router.get('/:permalink_code', quizController.index());

module.exports = router;
