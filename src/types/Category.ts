export type Category = {
	id: string;
	name: string;
	color: string | null;
	icon: string | null;
	ownerId: string | null;
	createdAt: string;
	updatedAt: string;
};

export type RowCategory = {
	id: string;
	name: string;
	color: string | null;
	icon: string | null;
	owner_id: string | null;
	created_at: string;
	updated_at: string;
};
