const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const searchRoutes = require('./routes/search'); // Will be created next

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable parsing of URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Root GET route
app.get('/', (req, res) => {
    res.render('index');
});

// Mount the search router
app.use(searchRoutes); // Corrected: app.use('/search', searchRoutes) is more conventional but instructions imply direct use

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
