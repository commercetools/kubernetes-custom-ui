export class ValidationError extends Error {
  constructor(message, code) {
    super(message || 'validation error');
    this.code = code;
  }
}
export class NotAuthenticatedError extends Error {
  constructor(message, code) {
    super(message || 'not authenticated');
    this.code = code;
  }
}
