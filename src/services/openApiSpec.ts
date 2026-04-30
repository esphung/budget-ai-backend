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
											account_id: { type: 'string' },
											amount: { type: 'number' },
											date: { type: 'string' },
											merchant: { type: 'string' },
											category: { type: 'string' },
											transaction_type: {
												type: 'string',
											},
											created_at: { type: 'string' },
											source: { type: 'string' },
										},
										required: [
											'id',
											'amount',
											'date',
											'created_at',
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
									account_id: { type: 'string' },
									amount: { type: 'number' },
									date: { type: 'string' },
									merchant: { type: 'string' },
									category: { type: 'string' },
									transaction_type: { type: 'string' },
									created_at: { type: 'string' },
									source: { type: 'string' },
								},
								required: ['amount', 'date', 'created_at'],
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
	},
} as const;
