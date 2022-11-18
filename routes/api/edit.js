/**
 * Route: /api/edit | Visitor route
 */

var express = require('express');
var router = express.Router();
const editController = local_require('app/controllers/api/edit');

/** EDIT CHOICE */

// route: /api/edit/quiz/:quiz_id/question/:question_id/choice/:choice_id | Update Choice
router.put('/quiz/:quiz_id/question/:question_id/choice/:choice_id', editController.choice.update())

// route: /api/edit/quiz/:quiz_id/question/:question_id/choice | Add Choice
router.post('/quiz/:quiz_id/question/:question_id/choice', editController.choice.index())

/** EDIT QUESTION */

// route: /api/edit/quiz/:quiz_id/question/:question_id | Update Question
router.put('/quiz/:quiz_id/question/:question_id', editController.question.update())

// route: /api/edit/quiz/:quiz_id/question | Add Question
router.post('/quiz/:quiz_id/question', editController.question.index())

/** EDIT QUIZ */

// route: /api/edit/quiz/publish/:quiz_id | Publish Quiz
router.put('/quiz/publish/:quiz_id', editController.quiz.publish());

// route: /api/edit/quiz/:quiz_id | Update quiz
router.put('/quiz/:quiz_id', editController.quiz.update());

// route: /api/edit/quiz | Add quiz 
router.post('/quiz', editController.quiz.index());

module.exports = router;
