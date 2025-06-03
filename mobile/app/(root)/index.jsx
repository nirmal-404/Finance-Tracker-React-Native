import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/componensts/SignOutButton'
import { useTransactions } from "@/hooks/useTransactions"
import { useEffect, useState } from 'react'
import PageLoader from '@/componensts/PageLoader'
import { styles } from '../../assets/styles/home.styles'
import { Ionicons } from "@expo/vector-icons"
import BalanceCard from '@/componensts/BalanceCard'
import TransactionItem from '../../componensts/TransactionItem'
import NoTransactionsFound from '../../componensts/NoTransactionsFound'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const { transactions, summary, isloading, loadData, deleteTransaction } = useTransactions(user.id)

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }
  useEffect(() => {
    loadData()
  }, [loadData]);

  const handleDelete = (id) => {
    Alert.alert("Delete transaction", "Are you sure you want to delete this transaction?", [
      { text: "cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ])
  }

  if (isloading && !refreshing) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* header */}
        <View style={styles.header}>
          {/* left */}
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>{user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
            </View>
          </View>

          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />

    </View>
  )
}