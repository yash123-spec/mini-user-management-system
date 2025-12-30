import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

connectDB();


app.use(cors({
    origin: ['https://mini-user-management-system-zeta.vercel.app',
        "http://localhost:5000"
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to User Management System API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
