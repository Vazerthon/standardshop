// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

// docs https://www.instantdb.com/docs/permissions

const standardRules = {
    allow: {
      view: "isOwner",
      create: "isOwner",
      update: "isOwner && isStillOwner",
      delete: "false",
    },
    bind: [
      "isOwner", "auth.id != null && auth.id == data.creatorId",
      "isStillOwner", "auth.id != null && auth.id == newData.creatorId"
    ]
  }

const rules = {
  item: standardRules,
  shopListItem: standardRules,
  template: standardRules,
  templateItem: standardRules,
  attrs: {
    allow: {
      $default: 'false',
    },
  },
} satisfies InstantRules;

export default rules;
