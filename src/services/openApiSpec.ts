export const openApiSpec = {
	openapi: '3.0.3',
	info: {
		title: 'BudgetAI API',
		version: '1.0.0',
		description: 'Public API for BudgetAI backend services.',
	},
	servers: [{ url: 'http://localhost:3001', description: 'Local server' }],
	paths: {
		'/health': {
			get: {
				tags: ['System'],
				summary: 'Health check',
				responses: {
					'200': {
						description: 'Server is healthy',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										status: {
											type: 'string',
											example: 'ok',
										},
									},
									required: ['status'],
								},
							},
						},
					},
				},
			},
		},
		'/plaid/link-token': {
			get: {
				tags: ['Plaid'],
				summary: 'Create Plaid link token',
				responses: {
					'200': {
						description: 'Link token created',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									additionalProperties: true,
								},
							},
						},
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
		},
		'/plaid/exchange-token': {
			post: {
				tags: ['Plaid'],
				summary: 'Exchange Plaid public token',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									publicToken: { type: 'string' },
								},
								required: ['publicToken'],
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Public token exchanged',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									additionalProperties: true,
								},
							},
						},
					},
					'400': {
						description: 'Missing publicToken',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
		},
		'/openai/send-message': {
			post: {
				tags: ['OpenAI'],
				summary: 'Send AI chat messages',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									messages: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												role: { type: 'string' },
												content: { type: 'string' },
											},
											required: ['role', 'content'],
										},
									},
								},
								required: ['messages'],
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Assistant response',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									additionalProperties: true,
								},
							},
						},
					},
					'400': {
						description: 'Invalid request body',
					},
					'500': {
						description: 'Failed to send AI message',
					},
				},
			},
		},
		'/transactions': {
			get: {
				tags: ['Transactions'],
				summary: 'Get all transactions',
				responses: {
					'200': {
						description: 'List of transactions',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: { type: 'string' },
											accountId: {
												type: 'string',
												nullable: true,
											},
											amount: { type: 'number' },
											date: { type: 'string' },
											merchant: {
												type: 'string',
												nullable: true,
											},
											category: {
												type: 'string',
												nullable: true,
											},
											transactionType: {
												type: 'string',
												enum: [
													'expense',
													'income',
													'transfer',
												],
											},
											source: {
												type: 'string',
												enum: ['ai', 'manual'],
											},
											rawUserText: { type: 'string' },
											syncStatus: {
												type: 'string',
												enum: ['pending', 'synced'],
											},
											createdAt: { type: 'string' },
										},
										required: [
											'id',
											'amount',
											'date',
											'transactionType',
											'source',
											'createdAt',
										],
									},
								},
							},
						},
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
			post: {
				tags: ['Transactions'],
				summary: 'Create a new transaction',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									accountId: { type: 'string' },
									amount: { type: 'number' },
									date: { type: 'string' },
									merchant: { type: 'string' },
									category: { type: 'string' },
									transactionType: {
										type: 'string',
										enum: ['expense', 'income', 'transfer'],
									},
									createdAt: { type: 'string' },
									source: {
										type: 'string',
										enum: ['ai', 'manual'],
									},
								},
								required: ['amount'],
							},
						},
					},
				},
				responses: {
					'201': {
						description: 'Transaction created successfully',
					},
					'400': {
						description: 'Invalid request body',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
		},
		'/transactions/{id}': {
			put: {
				tags: ['Transactions'],
				summary: 'Update a transaction',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' },
						description: 'Transaction ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									amount: { type: 'number' },
									merchant: { type: 'string' },
									category: { type: 'string' },
									transactionType: {
										type: 'string',
										enum: ['expense', 'income', 'transfer'],
									},
									date: { type: 'string' },
									source: {
										type: 'string',
										enum: ['ai', 'manual'],
									},
									updatedAt: { type: 'string' },
								},
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Transaction updated successfully',
					},
					'400': {
						description: 'Invalid request body',
					},
					'404': {
						description: 'Transaction not found',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
			delete: {
				tags: ['Transactions'],
				summary: 'Delete a transaction',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' },
						description: 'Transaction ID',
					},
				],
				responses: {
					'200': {
						description: 'Transaction deleted successfully',
					},
					'404': {
						description: 'Transaction not found',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
		},
		'/transactions/all': {
			delete: {
				tags: ['Transactions'],
				summary: 'Delete all transactions',
				responses: {
					'200': {
						description: 'All transactions cleared successfully',
					},
					'400': {
						description: 'Failed to clear transactions',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
		},
		'/accounts': {
			get: {
				tags: ['Accounts'],
				summary: 'Get all accounts',
				responses: {
					'200': {
						description: 'List of accounts',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: { type: 'string' },
											name: { type: 'string' },
											accountType: {
												type: 'string',
												enum: [
													'cash',
													'checking',
													'savings',
													'credit',
													'investment',
													'other',
												],
											},
											currency: { type: 'string' },
											createdAt: { type: 'string' },
											updatedAt: { type: 'string' },
										},
										required: [
											'id',
											'name',
											'accountType',
											'currency',
											'createdAt',
											'updatedAt',
										],
									},
								},
							},
						},
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
			post: {
				tags: ['Accounts'],
				summary: 'Create a new account',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: { type: 'string' },
									accountType: {
										type: 'string',
										enum: [
											'cash',
											'checking',
											'savings',
											'credit',
											'investment',
											'other',
										],
									},
									currency: { type: 'string' },
									createdAt: { type: 'string' },
									updatedAt: { type: 'string' },
								},
								required: ['name', 'accountType'],
							},
						},
					},
				},
				responses: {
					'201': {
						description: 'Account created successfully',
					},
					'400': {
						description: 'Invalid request body',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
		},
		'/accounts/{id}': {
			put: {
				tags: ['Accounts'],
				summary: 'Update an account',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' },
						description: 'Account ID',
					},
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: { type: 'string' },
									accountType: {
										type: 'string',
										enum: [
											'cash',
											'checking',
											'savings',
											'credit',
											'investment',
											'other',
										],
									},
									currency: { type: 'string' },
									updatedAt: { type: 'string' },
								},
							},
						},
					},
				},
				responses: {
					'200': {
						description: 'Account updated successfully',
					},
					'400': {
						description: 'Invalid request body',
					},
					'404': {
						description: 'Account not found',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
			delete: {
				tags: ['Accounts'],
				summary: 'Delete an account',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' },
						description: 'Account ID',
					},
				],
				responses: {
					'200': {
						description: 'Account deleted successfully',
					},
					'404': {
						description: 'Account not found',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
		},
		'/accounts/all': {
			delete: {
				tags: ['Accounts'],
				summary: 'Delete all accounts',
				responses: {
					'200': {
						description: 'All accounts cleared successfully',
					},
					'400': {
						description: 'Failed to clear accounts',
					},
					'500': {
						description: 'Internal server error',
					},
				},
			},
		},
	},
} as const;
