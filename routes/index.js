const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// If the request to an endpoint doesn't exist, we'll receive a 404 error indicating we have
// requested an incorrect resource.
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
