var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile('index.html', {root: './src/'});
});

module.exports = router;