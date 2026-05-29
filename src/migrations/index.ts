import * as migration_20260524_103303_init_schema from './20260524_103303_init_schema';
import * as migration_20260528_120000_add_map_and_tripinfo from './20260528_120000_add_map_and_tripinfo';

export const migrations = [
  {
    up: migration_20260524_103303_init_schema.up,
    down: migration_20260524_103303_init_schema.down,
    name: '20260524_103303_init_schema'
  },
  {
    up: migration_20260528_120000_add_map_and_tripinfo.up,
    down: migration_20260528_120000_add_map_and_tripinfo.down,
    name: '20260528_120000_add_map_and_tripinfo'
  },
];
