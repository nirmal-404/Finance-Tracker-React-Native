import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { initDB } from './config/db.js'

import transactionRoutes from "./routes/transaction-routes.js"
import rateLimiter from './middleware/rate-lmmiter.js'
dotenv.config()

const PORT = process.env.PORT || 5001

const app = express()

app.use(rateLimiter);
app.use(cors());
app.use(express.json());


app.use('/api/transactions', transactionRoutes);

app.get('/health', (req, res) => {
    res.send("working")
})

initDB().then(
    app.listen(PORT, () => {
        console.log(`Server is running on port : ${PORT}`)
    })
)
