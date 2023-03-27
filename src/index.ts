// index.ts
import { db_conn } from "./db/db-connection";
import { peergroup, peergroupMember } from "./db/schema";

const main = async () => {
  const db_peergroup = await db_conn.select().from(peergroup);
  const db_peergroupMember = await db_conn.select().from(peergroupMember);

  console.log(db_peergroup);
  console.log(db_peergroupMember);
};

main();
