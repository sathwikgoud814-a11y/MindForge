// Economy Engine: Transaction Ledger for Discipline Points (DP)

export const EconomyEngine = {
  createTransaction({ type, amount, source, reason, referenceId }) {
    return {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type, // 'EARN' | 'SPEND' | 'REFUND' | 'REWARD' | 'ADJUSTMENT'
      amount,
      source,
      reason,
      referenceId,
      timestamp: new Date().toISOString(),
      displayTime: 'Just now',
    };
  },

  calculateBalance(transactions, initialDP = 1250) {
    return transactions.reduce((balance, tx) => {
      if (tx.type === 'EARN' || tx.type === 'REFUND' || tx.type === 'REWARD') {
        return balance + tx.amount;
      }
      if (tx.type === 'SPEND') {
        return balance - tx.amount;
      }
      return balance;
    }, initialDP);
  }
};
