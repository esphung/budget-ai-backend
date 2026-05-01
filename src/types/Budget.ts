export type Budget = {
	id: string;
	name: string;
	amount: number;
	categoryId: string | null;
	periodStart: string;
	periodEnd: string;
	ownerId: string | null;
	createdAt: string;
	updatedAt: string;
};

export type RowBudget = {
	id: string;
	name: string;
	amount: number;
	category_id: string | null;
	period_start: string;
	period_end: string;
	owner_id: string | null;
	created_at: string;
	updated_at: string;
};
