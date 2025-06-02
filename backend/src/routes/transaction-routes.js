import express from "express"
import { addTransaction, deleteTransaction, getAllTransactionsByUserId, getAllTransactions, getTransactionSummary } from "../controllers/transaction-controller.js"

const router = express.Router();

router.post('/', addTransaction)
router.get('/:userId', getAllTransactionsByUserId)
router.delete('/:id', deleteTransaction)
router.get('/summary/:userId', getTransactionSummary)
router.get('/', getAllTransactions)

export default router;