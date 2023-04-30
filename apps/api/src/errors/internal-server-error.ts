export class InternalServerErrorException extends Error {
  constructor(message?: string) {
    super(message ?? 'Internal Server Error');
  }
}
