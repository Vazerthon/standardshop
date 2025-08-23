// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    item: i.entity({
      name: i.string().unique(),
      createdAt: i.date(),
    }),
    shopListItem: i.entity({
      quantity: i.number(),
      sortOrder: i.number(),
      checkedAt: i.date(),
      deletedAt: i.date(),
      createdAt: i.date(),
    }),
    template: i.entity({
      name: i.string(),
      createdAt: i.date(),
    }),
    templateItem: i.entity({
      quantity: i.number(),
      createdAt: i.date(),
    }),
  },
  links: {
    // Link items to shop list items (one-to-many)
    itemShopListItems: {
      forward: { on: 'item', has: 'many', label: 'shopListItems' },
      reverse: { on: 'shopListItem', has: 'one', label: 'item' },
    },
    // Link items to template items (one-to-many)
    itemTemplateItems: {
      forward: { on: 'item', has: 'many', label: 'templateItems' },
      reverse: { on: 'templateItem', has: 'one', label: 'item' },
    },
    // Link templates to template items (one-to-many)
    templateTemplateItems: {
      forward: { on: 'template', has: 'many', label: 'templateItems' },
      reverse: { on: 'templateItem', has: 'one', label: 'template' },
    },
    // Link users to their items (one-to-many)
    userItems: {
      forward: { on: '$users', has: 'many', label: 'items' },
      reverse: { on: 'item', has: 'one', label: '$user' },
    },
    // Link users to their shop list items (one-to-many)
    userShopListItems: {
      forward: { on: '$users', has: 'many', label: 'shopListItems' },
      reverse: { on: 'shopListItem', has: 'one', label: '$user' },
    },
    // Link users to their templates (one-to-many)
    userTemplates: {
      forward: { on: '$users', has: 'many', label: 'templates' },
      reverse: { on: 'template', has: 'one', label: '$user' },
    },
    // Link users to their template items (one-to-many)
    userTemplateItems: {
      forward: { on: '$users', has: 'many', label: 'templateItems' },
      reverse: { on: 'templateItem', has: 'one', label: '$user' },
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
