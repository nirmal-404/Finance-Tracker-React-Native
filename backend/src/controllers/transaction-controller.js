import { sql } from '../config/db.js';

export async function addTransaction(req, res) {

    try {

        const { user_id, title, amount, category } = req.body;
        if (!user_id || !title || !category || amount === undefined) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES(${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `

        res.status(201).json({ message: 'Transction created', transaction: transaction[0] });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function getAllTransactionsByUserId(req, res) {

    try {
        const { userId } = req.params;
        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id=${userId} 
            ORDER BY created_at ASC
        `

        res.status(200).json({ transactions: transactions });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function getAllTransactions(req, res) {

    try {

        const transactions = await sql`
            SELECT * FROM transactions 
            ORDER BY created_at DESC
        `

        res.status(201).json({ transactions: transactions });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function deleteTransaction(req, res) {

    try {
        const { id } = req.params;

        if(isNaN(parseInt(id))){
            return res.status(400).json({message: "Inavalid transaction ID"})
        }
        const transaction = await sql`
            DELETE FROM transactions 
            WHERE id=${id}
            RETURNING *
        `
        if (transaction.length == 0) {
            return res.status(404).json({ message: "Transaction not found" })
        }
        res.status(200).json({ message: `Transaction with id: ${transaction[0].id} deleted succesfully` });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function getTransactionSummary(req, res) {
    try {
        const { userId } = req.params;
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance
            FROM transactions WHERE user_id = ${userId} 
            `

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income
            FROM transactions WHERE user_id = ${userId}  AND amount > 0
            `
        
        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expenses
            FROM transactions WHERE user_id = ${userId}  AND amount < 0
            `
        
        res.status(200).json({ 
            balance: balanceResult[0].balance, 
            income: incomeResult[0].income, 
            expenses: expenseResult[0].expenses, 
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
}