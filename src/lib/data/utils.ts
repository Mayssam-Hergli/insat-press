// TypeScript serialize bigint
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};



export type EntityId = bigint | number | string;

export class DataAccessError extends Error {
  constructor(operation: string, cause: unknown) {
    super(`Database operation failed: ${operation}`);
    this.name = "DataAccessError";
    this.cause = cause;
  }
}

export async function runDataQuery<T>(
  operation: string,
  query: () => Promise<T>
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    throw new DataAccessError(operation, error);
  }
}

export function toBigIntId(id: EntityId) {
  try {
    return typeof id === "bigint" ? id : BigInt(id);
  } catch (error) {
    throw new DataAccessError(`parse id "${String(id)}"`, error);
  }
}

export type PaginationOptions = {
  skip?: number;
  take?: number;
};
