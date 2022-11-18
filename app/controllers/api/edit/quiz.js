const express = require('express');
const quiz = local_require('app/models/Quiz.js');

/**
 * New quiz [edit mode]
 * /api/edit/quiz
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function index (req, res) {
  let {body} = req;
  quiz.clean()
    .setData({...body, userID: req.userID})
    .save(function(error) {
      const _self = this;
      if (error) {
        console.log(error.message);
        return res.json({ changes: 0, error: { message: "There was a server error" } })
      }
      res.json({...body, lastID: _self.lastID, changes: _self.changes});
    })
  ;
}

/**
 * Update quiz [edit mode]
 * /api/edit/quiz/:quiz_id
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function update (req, res) {
  let {params, body} = req;
  
  quiz.clean()
    .setData({...body, id: params.quiz_id, userID: req.userID})
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

/**
 * Publish quiz [edit mode]
 * /api/edit/quiz/publish/:quiz_id
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
 function publish (req, res) {
  let {params} = req;
  
  quiz.clean()
    .setData({id: params.quiz_id, userID: req.userID})
    .publish(function(error) {
      const _self = this;
      if (error) {
        console.log(error.message);
        return  res.json({ changes: 0, error: {message: "There was a server error"} });
      }
      /** __self.changes = 0 | 1 ~~ fail | success */
      res.json({...params, changes: _self.changes});
    })
  ;
}

// export functional route handler
module.exports = {
  index: () => index,
  publish: () => publish,
  update: () => update
}