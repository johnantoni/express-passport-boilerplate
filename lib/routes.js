const express = require("express");
const Router = express.Router;
const router = Router();

// apply authenticationRequired to all /v1/* routes
router.use('/v1/*', require('./requireLogin'))

// secure
router.use('/v1/', require('./routes/invoice'));
router.use('/v1/', require('./routes/client'));
router.use('/v1/', require('./routes/log'));

// insecure
router.use('/p1', require('./routes/auth'));

module.exports = router;
