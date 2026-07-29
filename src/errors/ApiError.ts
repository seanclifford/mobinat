export class ApiError extends Error {
	constructor(message: string, httpStatus: number) {
		super(message);
		this.httpStatus = httpStatus;
		this.name = "ApiError";
	}

	public httpStatus: number;
}
