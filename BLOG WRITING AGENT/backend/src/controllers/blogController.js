const Blog = require('../models/Blog');

exports.saveBlog = async (req, res) => {
    try {
        const { title, content, topic } = req.body;
        const newBlog = new Blog({
            user: req.user.id,
            title,
            content,
            topic
        });

        const blog = await newBlog.save();
        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
