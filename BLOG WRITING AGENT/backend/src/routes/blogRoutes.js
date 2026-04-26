const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');

router.post('/', auth, blogController.saveBlog);
router.get('/', auth, blogController.getBlogs);

module.exports = router;
