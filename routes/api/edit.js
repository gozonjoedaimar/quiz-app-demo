/**
 * Route: /api/edit | Visitor route
 */

var express = require('express');
var router = express.Router();
const editController = local_require('app/controllers/api/edit');

// TODO: EDIT CHOICE | /api/edit/quiz/:quiz_id/question/:question_id/choice

// TODO: EDIT QUESTION | /api/edit/quiz/:quiz_id/question

/** EDIT QUIZ */

// route: /api/edit/quiz/publish/:quiz_id
router.put('/quiz/publish/:quiz_id', editController.quiz.publish());

// route: /api/edit/quiz/:quiz_id
router.put('/quiz/:quiz_id', editController.quiz.update());

// route: /api/edit/quiz
router.post('/quiz', editController.quiz.index());

module.exports = router;
