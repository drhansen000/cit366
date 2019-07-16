var express = require('express');
var router = express.Router();

// router.get('/', function(req, res, next) {
//     res.sendFile('index.html', {root: './src/'});
// });
router.get('/', function(req, res, next) {
    // res.render('index.html', {title: 'CMS'});
    res.redirect('http://localhost:4200');
});

module.exports = router;