<template>
    <div class="commit-box card">
        <h3><i class="fas fa-save"></i> Commit Staged Transactions</h3>
        <textarea v-model="commitMessage" placeholder="Enter commit message (e.g., Weekly groceries, Utility bills)"
            :disabled="!canCommit">
        </textarea>
        <button @click="commit" :disabled="!canCommit" class="commit-button">
            Commit {{ numberOfStaged }} Transaction {{ numberOfStaged > 1 ? '(s)' : '' }}
        </button>
    </div>

</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';

const props = defineProps({
    stagedTransactionsCount: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['commit-transactions']);

const commitMessage = ref('');

const canCommit = computed(() => props.stagedTransactionsCount > 0);
const numberOfStaged = computed(() => props.stagedTransactionsCount);

const commit = () => {
    if (!commitMessage.value.trim()) {
        alert('Please enter a commit message.');
        return;
    }
    if (!canCommit.value) return;

    emit('commit-transactions', commitMessage.value);

    // Clear
    commitMessage.value = '';
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
</style>