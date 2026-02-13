// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    // --------------- general entities ---------------
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    // --------------- shop list entities -------------
    items: i.entity({
      name: i.string().indexed(),
      createdAt: i.date(),
      nameAndUserId: i.string().unique().indexed(),
    }),
    shopListItems: i.entity({
      quantity: i.number(),
      sortOrder: i.number().indexed(),
      checkedAt: i.date().optional(),
      deletedAt: i.date().optional().indexed(),
      createdAt: i.date(),
    }),
    templates: i.entity({
      name: i.string(),
      createdAt: i.date(),
      deletedAt: i.date().optional().indexed(),
    }),
    templateItems: i.entity({
      quantity: i.number(),
      createdAt: i.date(),
      deletedAt: i.date().optional().indexed(),
      sortOrder: i.number().indexed().optional(),
    }),
    // --------------- task entities ------------------
    tasks: i.entity({
      title: i.string().indexed(),
      frequency: i.number(),
      description: i.string().optional(),
      deletedAt: i.date().optional().indexed(),
    }),
    taskCompletions: i.entity({
      completedAt: i.date(),
      note: i.string().optional(),
      deletedAt: i.date().optional().indexed(),
    }),
  },
  links: {
    // Link items to shop list items (one-to-many)
    itemsShopListItems: {
      forward: { on: "items", has: "many", label: "shopListItems" },
      reverse: { on: "shopListItems", has: "one", label: "item" },
    },
    // Link items to template items (one-to-many)
    itemTemplateItems: {
      forward: { on: "items", has: "many", label: "templateItems" },
      reverse: { on: "templateItems", has: "one", label: "item" },
    },
    // Link templates to template items (one-to-many)
    templatesTemplateItems: {
      forward: { on: "templates", has: "many", label: "templateItems" },
      reverse: { on: "templateItems", has: "one", label: "template" },
    },
    itemsOwner: {
      forward: { on: "items", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "items" },
    },
    shopListItemsOwner: {
      forward: { on: "shopListItems", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "shopListItems" },
    },
    templatesOwner: {
      forward: { on: "templates", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "templates" },
    },
    templateItemsOwner: {
      forward: { on: "templateItems", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "templateItems" },
    },
    tasksTaskCompletions: {
      forward: { on: "tasks", has: "many", label: "completions" },
      reverse: { on: "taskCompletions", has: "one", label: "task" },
    },
    tasksOwner: {
      forward: { on: "tasks", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "tasks" },
    },
    taskCompletionsOwner: {
      forward: { on: "taskCompletions", has: "one", label: "owner" },
      reverse: { on: "$users", has: "many", label: "taskCompletions" },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
