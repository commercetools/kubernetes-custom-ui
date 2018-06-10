export class ValidationError extends Error {
  constructor(message, code, errors) {
    super(message || 'validation error');
    this.code = code;
    this.errors = errors;
  }
}
export class NotAuthenticatedError extends Error {
  constructor(message, code) {
    super(message || 'not authenticated');
    this.code = code;
  }
}
export class CommercetoolsError extends Error {
  constructor(err) {
    super(err.message || 'commercetools error');
    this.code = err.code;
    this.errors = err.body ? err.body.errors : undefined;
    this.originalError = err;
  }
}

export class K8sError extends Error {
  constructor(err) {
    super(err.message || 'kubernetes error');
    this.code = err.statusCode;
    this.originalError = err;
  }
}
