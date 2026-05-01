export type AccountType =
	| 'cash'
	| 'checking'
	| 'savings'
	| 'credit'
	| 'investment'
	| 'other';

export type Account = {
	id: string;
	name: string;
	accountType: AccountType;
	currency: string;
	createdAt: string;
	updatedAt: string;
};

export type RowAccount = {
	id: string;
	name: string;
	account_type: string;
	currency: string;
	created_at: string;
	updated_at: string;
};
