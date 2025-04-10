<template>
    <div class="expense-form card">
        <h3><i class="fas fa-pencil-alt"></i>Add New Transaction (Working Directory)</h3>
        <form @submit.prevent="addTransaction">
            <div class="form-row form-type-selector">
                <label>Type:</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" v-model="type" value="expense" name="transactionType" checked>
                        Expense <i class="fas fa-arrow-down expense-icon"></i>
                    </label>
                    <label>
                        <input type="radio" v-model="type" value="income" name="transactionType">
                        Income <i class="fas fa-arrow-up income-icon"></i>
                    </label>
                </div>
            </div>
            <div class="form-row">
                <label for="description">Description:</label>
                <input type="text" id="description" v-model="description" required />
            </div>
            <div class="form-row">
                <label for="amount">Amount:</label>
                <input type="number" id="amount" v-model.number="amount" required min="0" step="0.01" />
            </div>
            <div class="form-row">
                <label for="category">Category:</label>
                <input type="text" id="category" v-model="category" />
            </div>
            <div class="form-row">
                <label for="date">Date:</label>
                <input type="date" id="date" v-model="date" required />
            </div>
            <button type="submit" class="submit-button">Stage Expense</button>
        </form>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

const emit = defineEmits(['stage-expense']);

const type = ref('expense');
const description = ref('');
const amount = ref(null)
const category = ref('')
const date = ref(new Date().toISOString().slice(0, 10));

const addTransaction = () => {
    if (!description.value || amount.value === null || amount.value <= 0 || !date.value) {
        alert('Please fill in all required fields (Description, Amount > 0, Date).');
        return;
    }

    const newTransaction = {
        id: Date.now(),
        type: type.value,
        description: description.value,
        amount: amount.value,
        category: category.value || (type.value === 'income' ? 'Uncategorized Income' : 'Uncategorized Expense'),
        date: date.value,
    };

    emit('stage-transaction', newTransaction);

    // Reset form
    description.value = '';
    amount.value = null;
    category.value = '';
    date.value = new Date().toISOString().slice(0, 10);
    type.value = 'expense';
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

h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.form-type-selector .radio-group {
    display: flex;
    gap: 15px;
    align-items: center;
    padding: 5px 0;
    /* Thêm padding nhẹ */
}

.form-type-selector {
    align-items: flex-start;
    /* Căn label Type lên trên */
}

.form-type-selector .radio-group label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    /* Khoảng cách giữa radio và text */
    font-weight: normal;
    /* Bỏ bold mặc định của label cha */
    text-align: left;
    /* Ghi đè text-align: right của .form-row label */
}

.form-type-selector input[type="radio"] {
    margin-right: 4px;
    /* Khoảng cách nhỏ với chữ */
    width: auto;
    /* Bỏ width 100% của input chung */
}

/* Màu sắc cho icon thu/chi */
.income-icon {
    color: #2ecc71;
}

/* Green */
.expense-icon {
    color: #e74c3c;
}

/* Red */

/* Sử dụng Grid cho mỗi hàng */
.form-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    /* Cột label cố định 100px, cột input chiếm phần còn lại */
    gap: 10px;
    /* Khoảng cách giữa label và input */
    align-items: center;
    /* Căn giữa các item theo chiều dọc */
    margin-bottom: 15px;
    /* Khoảng cách giữa các hàng */
}

.form-row label {
    font-weight: bold;
    text-align: right;
    /* Căn phải label */
    padding-right: 5px;
    /* Thêm chút padding phải cho label */
    color: #333;
}

.form-row input[type="text"],
.form-row input[type="number"],
.form-row input[type="date"] {
    width: 100%;
    /* Input chiếm toàn bộ không gian cột */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    /* Quan trọng: padding và border không làm tăng kích thước */
    font-size: 1em;
    /* Đảm bảo font chữ input dễ đọc */
}

/* Style cho button */
.submit-button {
    width: 100%;
    /* Button chiếm toàn bộ chiều rộng */
    padding: 12px 15px;
    /* Tăng padding cho button */
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
    /* Tăng cỡ chữ button */
    font-weight: bold;
    margin-top: 10px;
    /* Khoảng cách phía trên button */
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #36a374;
}

/* Responsive nhỏ (tùy chọn) */
@media (max-width: 500px) {
    .form-row {
        grid-template-columns: 1fr;
        /* Chuyển thành 1 cột */
        gap: 5px;
        /* Giảm khoảng cách */
        margin-bottom: 12px;
    }

    .form-row label {
        text-align: left;
        /* Căn trái label trên mobile */
        margin-bottom: 3px;
        /* Khoảng cách nhỏ giữa label và input */
    }
}
</style>