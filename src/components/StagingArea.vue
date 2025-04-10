<template>
    <div class="staging-area card">
        <h3><i class="fas fa-arrow-down"></i> Staged Transactions (Ready to Commit)</h3>
        <ul v-if="stagedTransactions.length > 0">
            <li v-for="(transaction, index) in stagedTransactions" :key="transaction.id"
                :class="transaction.type + '-item'">
                <span>
                    <!-- Thêm icon và text phân biệt -->
                    <i
                        :class="['fas', transaction.type === 'income' ? 'fa-arrow-up income-icon' : 'fa-arrow-down expense-icon']"></i>
                    {{ transaction.description }} -
                    <span class="amount">{{ formatCurrency(transaction.amount) }}</span>
                    ({{ transaction.date }})
                </span>
                <button @click="unstage(index)" class="remove-btn">Unstage</button>
            </li>
        </ul>
        <p v-else class="empty-stage">No transactions staged for commit.</p>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { formatCurrency } from '../utils/formatters';

const props = defineProps({
    stagedTransactions: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['unstage-transaction']);

const unstage = (index) => {
    emit('unstage-transaction', index)
}

</script>

<style scoped>
.card {
    background: #fff;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

i {
    margin-right: 5px;
}

.income-item .amount {
    color: #27ae60;
    font-weight: bold;
}

.expense-item .amount {
    color: #c0392b;
    font-weight: bold;
}

.staging-area li i {
    margin-right: 6px;
    font-size: 0.9em;
}

.income-icon {
    color: #2ecc71;
}

.expense-icon {
    color: #e74c3c;
}

.staging-area li {
    align-items: center;
}
</style>