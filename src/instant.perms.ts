// // Docs: https://www.instantdb.com/docs/permissions

// import type { InstantRules } from "@instantdb/react";

// // docs https://www.instantdb.com/docs/permissions

// const standardRules = {
//     allow: {
//       view: "isOwner",
//       create: "isOwner",
//       update: "isOwner && isStillOwner",
//       delete: "false",
//     },
//     bind: [
//       "isOwner", "auth.id != null && auth.id == data.creatorId",
//       "isStillOwner", "auth.id != null && auth.id == newData.creatorId"
//     ]
//   }

// const rules = {
//   item: standardRules,
//   shopListItem: standardRules,
//   template: standardRules,
//   templateItem: standardRules,
//   attrs: {
//     allow: {
//       $default: 'false',
//     },
//   },
// } satisfies InstantRules;

// export default rules;


// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  /**
   * Welcome to Instant's permission system!
   * Right now your rules are empty. To start filling them in, check out the docs:
   * https://www.instantdb.com/docs/permissions
   *
   * Here's an example to give you a feel:
   * posts: {
   *   allow: {
   *     view: "true",
   *     create: "isOwner",
   *     update: "isOwner",
   *     delete: "isOwner",
   *   },
   *   bind: ["isOwner", "auth.id != null && auth.id == data.ownerId"],
   * },
   */
  attrs: {
    allow: {
      $default: 'false',
    },
  },
} satisfies InstantRules;

export default rules;