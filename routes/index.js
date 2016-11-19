const express = require('express'),
	  router = express.Router();

var Hunter = require('../models/hunter');

router.get('/hunters', function (req, res, next) {
  Hunter.findAll()
  .then(function (hunters) {
    res.send(hunters);
  })
  .catch(next);
});

router.get('/hunters/:id', function (req, res, next) {
  Hunter.findById(req.params.id)
  .then(function (article) {
    if (!article) res.sendStatus(404);  // Do I need this if statement or will it send 404 if not found automatically
    else res.send(article);
  })
  .catch(next);
});

// don't understand what this is doing
router.post('/hunters', function (req, res, next) {
  Hunter.create(req.body)
  .then(function (created) {
    res.json({
      message: 'added successfully',
      hunter: created
    });
  })
  .catch(next);
});

// I don't yet understand what this is doing
router.put('/hunters/:id', function (req, res, next) {
 Hunter.update(req.body, {
    where: {id: req.params.id},
    returning: true
  })
  .then(function (results) {
    var updated = results[1][0];
    res.json({
      message: 'Updated successfully',
      hunter: updated
    });
  })
  .catch(next);
});
module.exports = router;
