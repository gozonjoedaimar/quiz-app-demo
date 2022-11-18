const express = require('express');
const choice = local_require('app/models/Choice.js');

/**
 * Add new choice
 * /api/edit/quiz/:quiz_id/question/:question_id/choice
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
 function index (req, res) {
  let {body, params} = req;
  choice.clean()
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
 * Update choice
 * /api/edit/quiz/:quiz_id/question/:question_id/choice/:choice_id
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
 function update (req, res) {
  let {params, body} = req;
  
  choice.clean()
    .setData({...body, id: params.choice_id, question_id: params.question_id})
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