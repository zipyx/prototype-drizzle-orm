import {
  boolean,
  char,
  datetime,
  float,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

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

export const peergroupMember = mysqlTable(
  "peergroup_member",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    groupId: char("groupId", { length: 36 }).references(() => peergroup.id),
    status: boolean("status").default(false),
    role: mysqlEnum("role", ["member", "admin"]),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (peergroupMember) => ({
    memberIdIndex: index("peergroup__memberId__idx").on(peergroupMember.id),
    groupIdIndex: index("peergroup__memberGroupId__idx").on(
      peergroupMember.groupId
    ),
  })
);

export const peergroupMeeting = mysqlTable(
  "peergroup_meeting",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    title: varchar("title", { length: 191 }),
    venue: varchar("venue", { length: 191 }),
    summary: varchar("summary", { length: 191 }).notNull(),
    status: mysqlEnum("status", ["draft", "complete", "cancelled"]),
    topics: json("topics"),
    notes: text("notes"),
    groupId: char("groupId", { length: 36 }).references(() => peergroup.id),
    deleted: boolean("deleted").default(false),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (peergroupMeeting) => ({
    meetingIdIndex: index("peergroup__meetingId__idx").on(peergroupMeeting.id),
    groupIdIndex: index("peergroup__meetingGroupId__idx").on(
      peergroupMeeting.groupId
    ),
  })
);

export const peergroupMeetingDoc = mysqlTable(
  "peergroup_meeting_doc",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    path: varchar("path", { length: 191 }),
    venue: varchar("venue", { length: 191 }),
    meetingId: char("meetingId", { length: 36 }).references(
      () => peergroupMeeting.id
    ),
    groupId: char("groupId", { length: 36 }).references(() => peergroup.id),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (peergroupMeetingDoc) => ({
    meetingDocIdIndex: index("peergroup__meetingDocId__idx").on(
      peergroupMeetingDoc.id
    ),
    meetingIdIndex: index("peergroup__meetingId__idx").on(
      peergroupMeetingDoc.id
    ),
    groupIdIndex: index("peergroup__meetingGroupId__idx").on(
      peergroupMeetingDoc.groupId
    ),
  })
);

export const plan = mysqlTable(
  "plan",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    userId: char("userId", { length: 36 })
      .notNull()
      .references(() => users.id),
    pathway: mysqlEnum("pathway", [
      "urgent_care",
      "alternative_clinical",
      "non_clinical",
      "special_circumstance",
      "training",
      "itap",
      "overseas",
    ])
      .default("urgent_care")
      .notNull(),
    duration: int("duration"),
    status: mysqlEnum("status", [
      "pending",
      "active",
      "paused",
      "finished",
      "unfinished",
    ]).default("pending"),
    startedAt: datetime("startedAt").notNull(),
    completedAt: datetime("completedAt"),
    requirements: json("requirements"),
    progress: json("progress"),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (plan) => ({
    planIdIndex: index("plan__planId__idx").on(plan.id),
  })
);

export const planRequirement = mysqlTable(
  "plan_requirement",
  {
    planId: char("planId", { length: 36 })
      .primaryKey()
      .references(() => plan.id),
    category: mysqlEnum("category", [
      "hours",
      "resus",
      "audit",
      "quiz",
      "sac",
      "pdp",
      "peer",
      "edu",
      "additional",
    ]),
    period: mysqlEnum("period", ["programme", "annual"]),
    type: mysqlEnum("type", ["any", "exact", "multi", "distinct"]),
    option: varchar("option", { length: 191 }),
    options: text("options"),
    credit: float("credit").default(1),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (planRequirement) => ({
    planRequirementPlanCategoryPeriodTypeIdIndex: uniqueIndex(
      "plan__requirementId__idx"
    ).on(
      planRequirement.planId,
      planRequirement.category,
      planRequirement.period,
      planRequirement.type
    ),
  })
);

export const planProgress = mysqlTable(
  "plan_progress",
  {
    planId: char("planId", { length: 36 })
      .primaryKey()
      .references(() => plan.id),
    year: int("year"),
    label: varchar("label", { length: 50 }),
    start: datetime("start"),
    end: datetime("end"),
    locked: boolean("locked").default(false),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (planProgress) => ({
    planProgressIdIndex: uniqueIndex("plan__progressId__idx").on(
      planProgress.planId,
      planProgress.year
    ),
  })
);

export const goal = mysqlTable(
  "goal",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    userId: char("userId", { length: 36 })
      .notNull()
      .references(() => users.id),
    goalName: varchar("goalName", { length: 191 }).notNull(),
    goalStatus: mysqlEnum("goalStatus", ["in_progress", "complete"]).default(
      "in_progress"
    ),
    notes: text("notes"),
    actions: json("actions"),
    developmentGoals: json("developmentGoals"),
    completedAt: datetime("completedAt"),
    // TODO : add array of activity
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (goal) => ({
    goalIdIndex: uniqueIndex("goal__goalId__idx").on(goal.id),
  })
);

export const accounts = mysqlTable(
  "accounts",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    userId: char("userId", { length: 36 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    access_token: text("access_token"),
    expires_in: int("expires_in"),
    id_token: text("id_token"),
    refresh_token: text("refresh_token"),
    refresh_token_expires_in: int("refresh_token_expires_in"),
    scope: varchar("scope", { length: 191 }),
    token_type: varchar("token_type", { length: 191 }),
    createdAt: timestamp("createdAt").defaultNow().onUpdateNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (account) => ({
    providerProviderAccountIdIndex: uniqueIndex(
      "accounts__provider__providerAccountId__idx"
    ).on(account.provider, account.providerAccountId),
    userIdIndex: index("accounts__userId__idx").on(account.userId),
  })
);

export const sessions = mysqlTable(
  "sessions",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: char("userId", { length: 36 }).notNull(),
    expires: datetime("expires").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (session) => ({
    sessionTokenIndex: uniqueIndex("sessions__sessionToken__idx").on(
      session.sessionToken
    ),
    userIdIndex: index("sessions__userId__idx").on(session.userId),
  })
);

export const users = mysqlTable(
  "users",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: timestamp("emailVerified"),
    image: varchar("image", { length: 191 }),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (user) => ({
    emailIndex: uniqueIndex("users__email__idx").on(user.email),
  })
);

export const verificationTokens = mysqlTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 191 }).primaryKey().notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: datetime("expires").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (verificationToken) => ({
    tokenIndex: uniqueIndex("verification_tokens__token__idx").on(
      verificationToken.token
    ),
  })
);

export const posts = mysqlTable(
  "posts",
  {
    id: char("id", { length: 36 }).primaryKey().notNull(),
    user_id: char("user_id", { length: 36 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
    title: text("title").notNull(),
    text: text("text").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (post) => ({
    userIdIndex: uniqueIndex("posts__user_id__idx").on(post.user_id),
  })
);
