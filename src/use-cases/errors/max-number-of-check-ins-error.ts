export class MaxDistanceOfCheckInsError extends Error {
  constructor() {
    super("Max number of check-ins reached");
  }
}
