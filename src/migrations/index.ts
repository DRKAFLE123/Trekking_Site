import * as migration_20260524_103303_init_schema from './20260524_103303_init_schema';
import * as migration_20260528_120000_add_map_and_tripinfo from './20260528_120000_add_map_and_tripinfo';
import * as migration_20260529_163000_trek_cms_fields from './20260529_163000_trek_cms_fields';
import * as migration_20260531_074534_add_navbar_settings from './20260531_074534_add_navbar_settings';
import * as migration_20260531_075833_add_footer_settings from './20260531_075833_add_footer_settings';
import * as migration_20260531_085255_restructure_inclusions_exclusions from './20260531_085255_restructure_inclusions_exclusions';
import * as migration_20260531_163146_add_company_pages from './20260531_163146_add_company_pages';
import * as migration_20260601_151815_add_legal_certificates_to_company_pages from './20260601_151815_add_legal_certificates_to_company_pages';
import * as migration_20260601_152656_add_team_members_array_to_company_pages from './20260601_152656_add_team_members_array_to_company_pages';
import * as migration_20260601_153321_add_csr_fields_to_company_pages from './20260601_153321_add_csr_fields_to_company_pages';

export const migrations = [
  {
    up: migration_20260524_103303_init_schema.up,
    down: migration_20260524_103303_init_schema.down,
    name: '20260524_103303_init_schema',
  },
  {
    up: migration_20260528_120000_add_map_and_tripinfo.up,
    down: migration_20260528_120000_add_map_and_tripinfo.down,
    name: '20260528_120000_add_map_and_tripinfo',
  },
  {
    up: migration_20260529_163000_trek_cms_fields.up,
    down: migration_20260529_163000_trek_cms_fields.down,
    name: '20260529_163000_trek_cms_fields',
  },
  {
    up: migration_20260531_074534_add_navbar_settings.up,
    down: migration_20260531_074534_add_navbar_settings.down,
    name: '20260531_074534_add_navbar_settings',
  },
  {
    up: migration_20260531_075833_add_footer_settings.up,
    down: migration_20260531_075833_add_footer_settings.down,
    name: '20260531_075833_add_footer_settings',
  },
  {
    up: migration_20260531_085255_restructure_inclusions_exclusions.up,
    down: migration_20260531_085255_restructure_inclusions_exclusions.down,
    name: '20260531_085255_restructure_inclusions_exclusions',
  },
  {
    up: migration_20260531_163146_add_company_pages.up,
    down: migration_20260531_163146_add_company_pages.down,
    name: '20260531_163146_add_company_pages',
  },
  {
    up: migration_20260601_151815_add_legal_certificates_to_company_pages.up,
    down: migration_20260601_151815_add_legal_certificates_to_company_pages.down,
    name: '20260601_151815_add_legal_certificates_to_company_pages',
  },
  {
    up: migration_20260601_152656_add_team_members_array_to_company_pages.up,
    down: migration_20260601_152656_add_team_members_array_to_company_pages.down,
    name: '20260601_152656_add_team_members_array_to_company_pages',
  },
  {
    up: migration_20260601_153321_add_csr_fields_to_company_pages.up,
    down: migration_20260601_153321_add_csr_fields_to_company_pages.down,
    name: '20260601_153321_add_csr_fields_to_company_pages'
  },
];
