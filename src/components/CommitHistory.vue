<template>
    <div class="commit-history">
        <h2><i class="fas fa-history"></i> Transaction History (Commits)</h2>
        <ul v-if="commitHistory.length > 0">
            <li v-for="commit in commitHistory" :key="commit.id">
                <div class="commit-item">
                    <div class="commit-dot"></div>
                    <div class="commit-header">
                        <span class="commit-message">{{ commit.message }}</span>
                        <span class="commit-time">committed on {{ formatDateTime(commit.timestamp) }}</span>
                        <span class="commit-id">commit {{ commit.id.toString().substring(0, 8) }}</span>
                        <!-- Giống hash ngắn -->
                    </div>
                    <div class="commit-transactions">
                        <details>
                            <summary>
                                Details ({{ commit.transactions.length }} items) -
                                Income: <span class="income-amount">{{
                                    formatCurrency(calculateCommitTotals(commit.transactions).income) }}</span> |
                                Expense: <span class="expense-amount">{{
                                    formatCurrency(calculateCommitTotals(commit.transactions).expense) }}</span>
                            </summary>
                            <ul>
                                <li v-for="transaction in commit.transactions" :key="transaction.id">
                                    <i :class="['fas', transaction.type === 'income' ? 'fa-arrow-up income-icon' : 'fa-arrow-down expense-icon']"></i>
                                    {{ transaction.description }} ({{ transaction.category }})&nbsp;<i class="fa-solid fa-forward"></i>
                                    <span class="amount">{{ formatCurrency(transaction.amount) }}</span>&nbsp;
                                    <span class="time-transaction">on {{transaction.date }}</span>
                                </li>
                            </ul>
                        </details>
                    </div>
                    <div class="total-commit-amount">
                        <!-- Có thể bỏ dòng này nếu đã hiển thị ở summary -->
                        <!-- Total for this commit: <span class="currency">{{ formatCurrency(calculateCommitTotal(commit.transactions)) }}</span> -->
                    </div>
                </div>
            </li>
        </ul>
        <p v-else>No commits yet. Stage some transactions and commit them!</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { formatDateTime, formatCurrency } from '../utils/formatters';

const props = defineProps({
    commitHistory: {
        type: Array,
        required: true
    }
});

const calculateCommitTotals = (transactions) => {
    return transactions.reduce((totals, transaction) => {
        if (transaction.type === 'income') {
            totals.income += transaction.amount;
        } else if (transaction.type === 'expense') {
            totals.expense += transaction.amount;
        }
        return totals;
    }, { income: 0, expense: 0 });
}
</script>

<style scoped>
i {
    margin-right: 5px;
}

details>summary {
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 5px;
}

.income-amount {
    color: #27ae60;
    font-weight: bold;
}

.expense-amount {
    color: #c0392b;
    font-weight: bold;
}

.commit-transactions ul {
    list-style: none;
    padding-left: 5px;
    margin-top: 10px;
}

.commit-transactions li {
    margin-bottom: 5px;
    font-size: 0.95em;
    display: flex;
    align-items: center;
}

.commit-transactions li i {
    margin-right: 8px;
    width: 12px;
    text-align: center;
}

.income-icon {
    color: #2ecc71;
}

.expense-icon {
    color: #e74c3c;
}

/* Style cho số tiền trong list item */
.commit-transactions li .amount {
    font-weight: bold;
    /* Màu sẽ được ghi đè bởi .income-item .amount hoặc .expense-item .amount nếu cần */
}

.commit-transactions .income-item .amount {
    color: #27ae60;
}

.commit-transactions .expense-item .amount {
    color: #c0392b;
}

.time-transaction {
    font-size: smaller;
    color: #888;
}
</style>