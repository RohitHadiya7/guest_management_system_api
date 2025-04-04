// backend/server.js
import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import connectDB from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use(express.json())

connectDB()

app.get('/', (req, res) => {
  res.send('guest management system api is running on vercel');
});

app.use('/auth', authRoutes)
app.use('/events', eventRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


export default app