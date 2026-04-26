const app = require('./src/app');
const connectDB = require('./src/config/db');
require('dotenv').config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
