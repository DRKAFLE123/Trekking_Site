import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Converts treks_day_by_day_itinerary.description from a plain varchar
// textarea to a Lexical rich-text jsonb column, so the client can bold /
// italic text, add headings, lists, and hyperlink words to other pages.
//
// Existing plain-text descriptions are wrapped into a minimal Lexical AST
// (one paragraph per non-empty line) BEFORE the column type flips, so no
// content is lost. The data conversion itself runs in JS via
// scratch/apply-itinerary-richtext.js (Payload CLI is broken on Node 24);
// this migration file makes the schema change reproducible on other envs.

const LEXICAL_EMPTY = `{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[]}]}}`;

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Wrap each existing plain-text description in a minimal Lexical AST.
    --    A single-paragraph, single-text-node wrapper. Multi-line splitting
    --    is handled by the JS backfill; this SQL is the safe fallback so the
    --    ::jsonb cast below never fails on un-backfilled rows.
    UPDATE "treks_day_by_day_itinerary"
    SET "description" = json_build_object(
      'root', json_build_object(
        'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
        'children', json_build_array(
          json_build_object(
            'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
            'children', json_build_array(
              json_build_object(
                'type', 'text', 'text', "description",
                'format', 0, 'detail', 0, 'mode', 'normal', 'style', '', 'version', 1
              )
            )
          )
        )
      )
    )::text
    WHERE "description" IS NOT NULL
      AND left(btrim("description"), 1) <> '{';

    -- 2. Give any NULL descriptions a valid empty Lexical doc (column is
    --    required at the app layer, but be defensive for the cast).
    UPDATE "treks_day_by_day_itinerary"
    SET "description" = ${LEXICAL_EMPTY}
    WHERE "description" IS NULL;

    -- 3. Flip the column type varchar -> jsonb.
    ALTER TABLE "treks_day_by_day_itinerary"
      ALTER COLUMN "description" TYPE jsonb USING "description"::jsonb;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Flatten back to plain text: concatenate all text nodes.
    ALTER TABLE "treks_day_by_day_itinerary"
      ALTER COLUMN "description" TYPE varchar USING (
        COALESCE(
          (
            SELECT string_agg(child->>'text', ' ')
            FROM jsonb_array_elements("description"->'root'->'children') AS para,
                 jsonb_array_elements(para->'children') AS child
            WHERE child->>'type' = 'text'
          ),
          "description"::text
        )
      );
  `)
}
