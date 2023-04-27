// index.ts
// import { db_conn } from "./db/db-connection";
// import { peergroup, peergroupMember } from "./db/schema.ts";
// import { peergroup } from "./db/schema.ts";
import {
  boolean,
  char,
  index,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { db_conn } from "./db/db-connection";

export const peergroup = mysqlTable(
  "peergroup",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    town: varchar("town", { length: 191 }),
    suburb: varchar("suburb", { length: 191 }),
    summary: varchar("summary", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }),
    status: boolean("status").default(false),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (peergroup) => ({
    groupIdIndex: index("peergroup__groupId__idx").on(peergroup.id),
    emailIndex: index("peergroup__email__idx").on(peergroup.email),
  })
);

const main = async () => {
  // const db_peergroup = await db_conn.select().from(peergroup);
  // const db_peergroupMember = await db_conn.select().from(peergroupMember);
  // console.log(db_peergroup);
  // console.log(db_peergroupMember);

  const test = await db_conn.select().from(peergroup);
  console.log(JSON.stringify(test));
  console.log(`hello world`);
};

main();
