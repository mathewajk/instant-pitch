// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    "$files": i.entity({
      "path": i.string().unique().indexed(),
      "url": i.string().optional(),
    }),
    "$users": i.entity({
      "email": i.string().unique().indexed().optional(),
      "imageURL": i.string().optional(),
      "is_admin": i.boolean().optional(),
      "type": i.string().optional(),
    }),
    "userstarredwords": i.entity({}),
    "userwords": i.entity({}),
    "sentences": i.entity({
      "text": i.string().indexed(),
      "created_at": i.string(),
      "source": i.string().optional(),
    }),
    "sentencewords": i.entity({
      "sentence_id": i.string().indexed(),
      "word_id": i.string().indexed(),
      "position": i.number().indexed(),
      "gloss": i.string().optional(),
    }),
    "words": i.entity({
      "context": i.string().optional(),
      "definition_en": i.string().optional(),
      "definition_ja": i.string().optional(),
      "pitch": i.number().indexed().optional(),
      "source": i.string().optional(),
      "tango": i.string().indexed(),
      "yomi": i.string().indexed(),
    }),
  },
  links: {
    "$usersLinkedPrimaryUser": {
      "forward": {
        "on": "$users",
        "has": "one",
        "label": "linkedPrimaryUser",
        "onDelete": "cascade"
      },
      "reverse": {
        "on": "$users",
        "has": "many",
        "label": "linkedGuestUsers"
      }
    },
    "userstarredwords$users": {
      "forward": {
        "on": "userstarredwords",
        "has": "many",
        "label": "$users",
        "required": true
      },
      "reverse": {
        "on": "$users",
        "has": "many",
        "label": "userstarredwords"
      }
    },
    "userstarredwordsWords": {
      "forward": {
        "on": "userstarredwords",
        "has": "many",
        "label": "words",
        "required": true
      },
      "reverse": {
        "on": "words",
        "has": "many",
        "label": "userstarredwords"
      }
    }
  },
  rooms: {}
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema }
export default schema;
