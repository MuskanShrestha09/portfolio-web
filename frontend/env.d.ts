interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: any;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  all<T = any>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface R2Bucket {
  put(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
}

interface CloudflareEnv {
  DB: D1Database;
  BUCKET: R2Bucket;
}
