//  react custom hook
import { useCallback, useId, useState } from "react"
import { Alert } from "react-native"
import { API_URL } from "../constants/api";


export const useTransactions = (userId) => {

    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expense: 0
    });
    const [isloading, setIsLoading] = useState(true);

    // useCallback is used for performance reasons, it wil memorize the function
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json()
            // console.log("fetchTransactions--data", data)
            setTransactions(data.transactions)
        } catch (error) {
            console.error("fetchTransactions", error)
        }
    }, [userId]);


    const fetchTransactionSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json()
            // console.log("fetchTransactionSummary--data", data)
            setSummary(data)
        } catch (error) {
            console.error("fetchTransactionSummary", error)
        }
    }, [userId]);


    const loadData = useCallback(async () => {
        if (!userId) return

        setIsLoading(true)

        try {
            // fetch parerally
            await Promise.all([fetchTransactions(), fetchTransactionSummary()])
        } catch (error) {
            console.error("loadData", error)
        } finally {
            setIsLoading(false)
        }
    }, [fetchTransactions, fetchTransactionSummary, userId]);

    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete transaction")

            loadData()
            Alert.alert("Success", "Transaction deleted successfully")
        } catch (error) {
            console.error("deleteTransaction", error)
            Alert.alert("Error", "Faliled to delete transaction")
        }
    }


    return { transactions, summary, isloading, loadData, deleteTransaction }
}