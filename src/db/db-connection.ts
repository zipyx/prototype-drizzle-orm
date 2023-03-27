// db.ts
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

// Create the connection.
const poolConnection = mysql.createPool({
  host: "127.0.0.1",
  user: "developer",
  database: "test",
  password: "developerpassword",
});

export const db_conn = drizzle(poolConnection);
