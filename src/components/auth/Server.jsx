import './env-loader.js';
import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pool from './Database'; 
import SocialCotroller, {googleLogin} from './SocialCotroller';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); 

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, //set to true in production with HTTPS
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    }
}))

app.use((request, response, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${request.method} ${request.url}`);
    next();
});

//ROUTES
app.post('/api/social', SocialCotroller.handleSocialAndFacebookLogin); //Routes

// Basic test route to check if the server is running
app.get('/', (request, response) => {
    response.send('Server is running successfully! Go to /api/auth/social to test login.');
});

async function startServer() {
    try {
        // Test the database connection pool
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();

        // Get the port from your .env file, defaulting to 3000 if not found
        const port = process.env.SERVER_PORT || 9192;
        
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error('❌ Failed to connect to the database or start server:', error.message);
        process.exit(1); // Exit the process if we can't connect/start
    }
}

startServer();