var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('sample/index');
});

module.exports = router;
