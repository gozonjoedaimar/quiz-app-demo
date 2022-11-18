var express = require('express');
var router = express.Router();
const editController = local_require('app/controllers/api/edit');

// edit/quiz/:quiz_id/question/:question_id

// edit/quiz/:quiz_id/question

// edit/quiz
router.put('/quiz/publish/:quiz_id', editController.quiz.publish());
router.put('/quiz/:quiz_id', editController.quiz.update());
router.post('/quiz', editController.quiz.index());

module.exports = router;
