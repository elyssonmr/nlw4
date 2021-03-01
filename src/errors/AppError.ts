class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly errors?: object

  constructor(message: string, statusCode = 400, errors?: object) {
    this.message = message;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}


export { AppError }
