var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:room', function(req, res, next) {
  console.log(req.params.room);
  res.render('chat', { title: req.params.room });
});

module.exports = router;
