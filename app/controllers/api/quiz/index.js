const express = require('express');

/**
 * Get quiz items
 * /api/quiz/:permalink_code
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
 function index (req, res) {
  let {params} = req;

  res.json(params);
}

// export functional route handler
module.exports = {
  index: () => index
}