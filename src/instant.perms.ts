// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

// docs https://www.instantdb.com/docs/permissions

const standardRules = {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner",
      delete: "false",
    },
    bind: [
      "isOwner", "auth.id in data.ref('owner.id')",
    ]
  }

const rules = {
  items: standardRules,
  shopListItems: standardRules,
  templates: standardRules,
  templateItems: standardRules,
  attrs: {
    allow: {
      $default: 'false',
    },
  },
} satisfies InstantRules;

export default rules;

