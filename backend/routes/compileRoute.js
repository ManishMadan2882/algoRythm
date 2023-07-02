//langages supported Java,C,C++,Py,JS
const express = require('express')
const {compile} = require('../controllers/compileCode')
const router = express.Router()
router.route('/').post(compile);

module.exports = router

