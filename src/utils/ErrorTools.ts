export class ErrorTools {
	static extractErrorMessage(error: any): { message: string } {
		console.error('Error:', error);
		if (error instanceof Error) {
			return { message: error.message };
		} else if ('message' in error && typeof error.message === 'string') {
			return { message: error.message };
		} else if (typeof error === 'object' && error !== null) {
			return { message: JSON.stringify(error) };
		} else {
			return { message: String(error) };
		}
	}
}
