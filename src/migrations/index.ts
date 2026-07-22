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
import * as migration_20260602_073228_add_allow_indexing from './20260602_073228_add_allow_indexing';
import * as migration_20260602_075656_add_guide_settings from './20260602_075656_add_guide_settings';
import * as migration_20260605_090000_add_homepage_settings from './20260605_090000_add_homepage_settings';
import * as migration_20260605_120000_add_roles_audit_permissions from './20260605_120000_add_roles_audit_permissions';
import * as migration_20260605_163738_add_homepage_video_gallery from './20260605_163738_add_homepage_video_gallery';
import * as migration_20260605_172103_add_expert_relationship from './20260605_172103_add_expert_relationship';
import * as migration_20260605_172653_add_is_expert_checkbox from './20260605_172653_add_is_expert_checkbox';
import * as migration_20260606_160916_add_faq_featured_fields from './20260606_160916_add_faq_featured_fields';
import * as migration_20260623_220000_fix_missing_columns from './20260623_220000_fix_missing_columns';
import * as migration_20260624_120000_add_archive_page_settings from './20260624_120000_add_archive_page_settings';
import * as migration_20260624_140000_add_archive_page_role_perms from './20260624_140000_add_archive_page_role_perms';
import * as migration_20260708_140000_itinerary_description_richtext from './20260708_140000_itinerary_description_richtext';
import * as migration_20260722_120000_add_tracking_settings from './20260722_120000_add_tracking_settings';

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
    name: '20260601_153321_add_csr_fields_to_company_pages',
  },
  {
    up: migration_20260602_073228_add_allow_indexing.up,
    down: migration_20260602_073228_add_allow_indexing.down,
    name: '20260602_073228_add_allow_indexing',
  },
  {
    up: migration_20260602_075656_add_guide_settings.up,
    down: migration_20260602_075656_add_guide_settings.down,
    name: '20260602_075656_add_guide_settings',
  },
  {
    up: migration_20260605_090000_add_homepage_settings.up,
    down: migration_20260605_090000_add_homepage_settings.down,
    name: '20260605_090000_add_homepage_settings',
  },
  {
    up: migration_20260605_120000_add_roles_audit_permissions.up,
    down: migration_20260605_120000_add_roles_audit_permissions.down,
    name: '20260605_120000_add_roles_audit_permissions',
  },
  {
    up: migration_20260605_163738_add_homepage_video_gallery.up,
    down: migration_20260605_163738_add_homepage_video_gallery.down,
    name: '20260605_163738_add_homepage_video_gallery',
  },
  {
    up: migration_20260605_172103_add_expert_relationship.up,
    down: migration_20260605_172103_add_expert_relationship.down,
    name: '20260605_172103_add_expert_relationship',
  },
  {
    up: migration_20260605_172653_add_is_expert_checkbox.up,
    down: migration_20260605_172653_add_is_expert_checkbox.down,
    name: '20260605_172653_add_is_expert_checkbox',
  },
  {
    up: migration_20260606_160916_add_faq_featured_fields.up,
    down: migration_20260606_160916_add_faq_featured_fields.down,
    name: '20260606_160916_add_faq_featured_fields'
  },
  {
    up: migration_20260623_220000_fix_missing_columns.up,
    down: migration_20260623_220000_fix_missing_columns.down,
    name: '20260623_220000_fix_missing_columns',
  },
  {
    up: migration_20260624_120000_add_archive_page_settings.up,
    down: migration_20260624_120000_add_archive_page_settings.down,
    name: '20260624_120000_add_archive_page_settings',
  },
  {
    up: migration_20260624_140000_add_archive_page_role_perms.up,
    down: migration_20260624_140000_add_archive_page_role_perms.down,
    name: '20260624_140000_add_archive_page_role_perms',
  },
  {
    up: migration_20260708_140000_itinerary_description_richtext.up,
    down: migration_20260708_140000_itinerary_description_richtext.down,
    name: '20260708_140000_itinerary_description_richtext',
  },
  {
    up: migration_20260722_120000_add_tracking_settings.up,
    down: migration_20260722_120000_add_tracking_settings.down,
    name: '20260722_120000_add_tracking_settings',
  },
];
