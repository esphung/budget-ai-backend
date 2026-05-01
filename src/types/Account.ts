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
	ownerId: string | null;
	createdAt: string;
	updatedAt: string;
};

export type RowAccount = {
	id: string;
	name: string;
	account_type: string;
	currency: string;
	owner_id: string | null;
	created_at: string;
	updated_at: string;
};
