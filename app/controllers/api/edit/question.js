const express = require('express');
const question = local_require('app/models/Question.js');

/**
 * Add new question
 * /api/edit/quiz/:quiz_id/question
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
 function index (req, res) {
  let {body, params} = req;
  question.clean()
    .setData({...body, ...params})
    .save(function(error) {
      const _self = this;
      if (error) {
        console.log(error.message);
        return res.json({ changes: 0, error: { message: "There was a server error" } })
      }
      res.json({...params, ...body, lastID: _self.lastID, changes: _self.changes});
    })
  ;
}

/**
 * Update question
 * /api/edit/quiz/:quiz_id/question/:question_id
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
 function update (req, res) {
  let {params, body} = req;
  
  question.clean()
    .setData({...body, id: params.question_id, quiz_id: params.quiz_id})
    .save(function(error) {
      const _self = this;
      if (error) {
        console.log(error.message);
        return  res.json({ changes: 0, error: {message: "There was a server error"} });
      }
      /** __self.changes = 0 | 1 ~~ fail | success */
      res.json({...params, ...body, changes: _self.changes});
    })
  ;
}

// export functional route handler
module.exports = {
  index: () => index,
  update: () => update
}