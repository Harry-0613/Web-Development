import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  serial,
  uuid,
  varchar,
  date,
  unique,
  time,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "credentials"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    usernameIndex: index("username_index").on(table.username),
  }),
);

// TravelCards (e.g. PlanA, PlanB)
// usersTable is many-to-many relationship with TravelCards

export const travelCardsTable = pgTable(
  "travel_cards",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 100 }).notNull(),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
  }),
);

// journeysTable (e.g. journey1, journey2)
// travelCardsTable is one-to-many relationship with journeysTable
export const journeysTable = pgTable(
  "journeys",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    title: varchar("title", { length: 100 }).notNull(),
    note: varchar("note", { length: 100 }).notNull(),
    location: varchar("location", { length: 100 }).notNull(),
    date: date("date", { mode: "date" }).notNull(), // only date, no time
    time1: time("time1"), // only time, no date (start time), sorted by time1
    time2: time("time2"), // only time, no date (end time)
    travelCardsId: uuid("travel_cards_id")
      .references(() => travelCardsTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
  }),
);

export const travelCardsUsersTable = pgTable(
  "travel_cards_users",
  {
    id: serial("id").primaryKey(),
    travelCardId: uuid("travel_card_id")
      .notNull()
      .references(() => travelCardsTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    travelCardAndUserIndex: index("travel_card_and_user_index").on(
      table.travelCardId,
      table.userId,
    ),
    // This is a unique constraint on the combination of travelCardId and userId.
    // This ensures that there is no duplicate entry in the table.
    uniqCombination: unique().on(table.travelCardId, table.userId),
  }),
);

// Relations

export const usersRelations = relations(usersTable, ({ many }) => ({
  travelCardsUsersTable: many(travelCardsUsersTable),
}));

export const travelCardsRelations = relations(travelCardsTable, ({ many }) => ({
  journeys: many(journeysTable),
  travelCardsUsersTable: many(travelCardsUsersTable),
}));

export const travelCardsUsersRelations = relations(
  travelCardsUsersTable,
  ({ one }) => ({
    usersTable: one(usersTable, {
      fields: [travelCardsUsersTable.userId],
      references: [usersTable.displayId],
    }),

    travelCardsTable: one(travelCardsTable, {
      fields: [travelCardsUsersTable.travelCardId],
      references: [travelCardsTable.displayId],
    }),
  }),
);


export const journeysRelations = relations(journeysTable,({one}) => ({
  travelCardsTable: one(travelCardsTable, {
    fields: [journeysTable.travelCardsId],
    references: [travelCardsTable.displayId],
  }),
}))