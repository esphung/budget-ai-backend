export type TransactionType = 'expense' | 'income' | 'transfer';

export type Transaction = {
	id: string;
	accountId: string | null;
	amount: number;
	merchant: string | null;
	category: string | null;
	transactionType: TransactionType;
	date: string;
	source: 'ai' | 'manual';
	rawUserText?: string;
	syncStatus?: 'pending' | 'synced';
	ownerId: string | null;
	createdAt: string;
};

export type RowTransaction = {
	id: string;
	account_id: string | null;
	amount: number;
	date: string;
	merchant: string | null;
	category: string | null;
	transaction_type: string;
	source: string;
	owner_id: string | null;
	created_at: string;
};
