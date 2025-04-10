<template>
  <div class="control-panel">
    <TransactionForm @stage-transaction="handleStageTransaction" />
    <StagingArea :staged-transactions="stagedTransactions" @unstage-transaction="handleUnstageTransaction" />
    <CommitBox :staged-transactions-count="stagedTransactions.length" @commit-transactions="handleCommit" />
  </div>
  <div class="history-panel">
    <CommitHistory :commit-history="commitHistory" />
    <div class="overall-totals">
      <h3>Overall Summary</h3>
      <p>Total Income: <span class="income-amount">{{ formatCurrency(overallTotals.income) }}</span></p>
      <p>Total Expense: <span class="expense-amount">{{ formatCurrency(overallTotals.expense) }}</span></p>
      <p class="net-total">Net Total: <span :class="netTotalClass">{{ formatCurrency(overallTotals.net) }}</span></p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import CommitBox from './components/CommitBox.vue';
import CommitHistory from './components/CommitHistory.vue';
import TransactionForm from './components/TransactionForm.vue';
import StagingArea from './components/StagingArea.vue';
import { formatCurrency } from './utils/formatters';

const stagedTransactions = ref([]);
const commitHistory = ref([]);

const STORAGE_KEY = 'transactionTrackerGitLikeData';

// Load data from localStorage on mount
onMounted(() => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      commitHistory.value = parsedData;
    } catch (error) {
      console.error("Failed to parse saved data:", e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // "Staged transactions" are not typically saved across sessions in Git,
  // so we don't load them here. User needs to recommit.
});

watch(commitHistory, (newHistory) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}, { deep: true }) // Use deep watch for changes within the array/objects

const handleStageTransaction = (transaction) => {
  stagedTransactions.value.push(transaction);
}

const handleUnstageTransaction = (index) => {
  stagedTransactions.value.splice(index, 1);
};

const handleCommit = (message) => {
  if (stagedTransactions.value.length === 0) return;

  const newCommit = {
    id: Date.now(),
    message: message,
    timestamp: new Date().toISOString(),
    transactions: [...stagedTransactions.value] // Create a copy
  }

  // Add to the beginning of the history (like git log)
  commitHistory.value.unshift(newCommit);

  // Clear staging area
  stagedTransactions.value = [];
}

// --- Cập nhật phần tính tổng ---
const overallTotals = computed(() => {
  return commitHistory.value.reduce((totals, commit) => {
    commit.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totals.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        totals.expense += transaction.amount;
      }
    });
    return totals;
  }, { income: 0, expense: 0, net: 0 })
})

const netTotalClass = computed(() => {
  const net = overallTotals.value.income - overallTotals.value.expense;
  if (net > 0) return 'income-amount';
  if (net < 0) return 'expense-amount';
  return ''; // Hoặc một class trung tính
});

watch(overallTotals, (newTotals) => {
  newTotals.net = newTotals.income - newTotals.expense;
}, { immediate: true }); // immediate để tính ngay lần đầu

</script>

<style scoped>
.overall-totals {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}

.overall-totals h3 {
  border-bottom: none;
  margin-bottom: 10px;
  color: #2c3e50;
}

.overall-totals p {
  margin: 5px 0;
  font-size: 1.1em;
}

.net-total {
  margin-top: 10px;
  font-weight: bold;
  font-size: 1.2em;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

/* Sử dụng lại class màu từ CommitHistory */
.income-amount {
  color: #27ae60;
  font-weight: bold;
}

.expense-amount {
  color: #c0392b;
  font-weight: bold;
}
</style>
