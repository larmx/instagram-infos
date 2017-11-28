const express = require('express');
const config = require('../config/config.json');
const admin = require('../controllers/admin');

const router = express.Router();


/* GET home page. */
router.get('/', (req, res) => {
  res.render('../views/index', {
    duration: null,
    accessToken: null,
    average: null,
    error: null
  });
});

router.post('/', async (req, res) => {
  console.log(req.body.accessToken);
  console.log(req.body.duration);
  const accessToken = req.body.accessToken || config.api.accessToken;
  const duration = req.body.duration || config.duration / 2592000;
  const error = 'There seems to be a problem with your access token';
  let average = null;
  try {
    average = await admin.getInfos(res, accessToken, duration * 2592000);
  } catch (e) {
    res.render('../views/index', {
      error,
      average,
      duration,
      accessToken
    });
  }

  res.render('../views/index', {
    error: null,
    average,
    duration,
    accessToken
  });
});

module.exports = router;
