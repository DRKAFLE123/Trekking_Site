import { CollectionConfig } from 'payload';
import { checkPermission } from '../access';
import { revalidateTeam, revalidateTeamDelete } from '../hooks/revalidate';

const syncExpertToSettings = async ({ doc, previousDoc, req }: any) => {
  // 1. If isExpert is checked and was not checked before (or doc is newly created)
  if (doc.isExpert === true && (!previousDoc || previousDoc.isExpert !== true)) {
    try {
      // Untoggle other team members that have isExpert === true
      const otherExperts = await req.payload.find({
        collection: 'teamMembers',
        where: {
          and: [
            { isExpert: { equals: true } },
            { id: { not_equals: doc.id } }
          ]
        },
        depth: 0,
        overrideAccess: true,
      });

      for (const other of otherExperts.docs) {
        await req.payload.update({
          collection: 'teamMembers',
          id: other.id,
          data: {
            isExpert: false,
          },
          overrideAccess: true,
        });
      }

      // Fetch site settings and update the expert relationship
      const settingsRes = await req.payload.find({
        collection: 'siteSettings',
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });

      if (settingsRes.docs.length > 0) {
        const settingsDoc = settingsRes.docs[0];
        await req.payload.update({
          collection: 'siteSettings',
          id: settingsDoc.id,
          data: {
            headerSettings: {
              ...settingsDoc.headerSettings,
              expert: doc.id,
            }
          },
          overrideAccess: true,
        });
        console.log(`[CMS Hook] Successfully synced expert team member "${doc.name}" to Global Site Settings.`);
      }
    } catch (err: any) {
      console.error("[CMS Hook] Error in syncExpertToSettings afterChange hook:", err.message);
    }
  }

  // 2. If isExpert is unchecked and it was checked before
  if (doc.isExpert === false && previousDoc && previousDoc.isExpert === true) {
    try {
      const settingsRes = await req.payload.find({
        collection: 'siteSettings',
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });

      if (settingsRes.docs.length > 0) {
        const settingsDoc = settingsRes.docs[0];
        const currentExpertId = typeof settingsDoc.headerSettings?.expert === 'object'
          ? settingsDoc.headerSettings.expert.id
          : settingsDoc.headerSettings?.expert;

        if (currentExpertId === doc.id) {
          await req.payload.update({
            collection: 'siteSettings',
            id: settingsDoc.id,
            data: {
              headerSettings: {
                ...settingsDoc.headerSettings,
                expert: null,
              }
            },
            overrideAccess: true,
          });
          console.log(`[CMS Hook] Unlinked expert team member "${doc.name}" from Global Site Settings.`);
        }
      }
    } catch (err: any) {
      console.error("[CMS Hook] Error unlinking expert team member:", err.message);
    }
  }
};

export const teamMembers: CollectionConfig = {
  slug: 'teamMembers',
  access: {
    read: checkPermission('teamMembers', 'read'),
    create: checkPermission('teamMembers', 'create'),
    update: checkPermission('teamMembers', 'update'),
    delete: checkPermission('teamMembers', 'delete'),
  },
  hooks: {
    afterChange: [revalidateTeam, syncExpertToSettings],
    afterDelete: [revalidateTeamDelete],
  },
  admin: {
    group: 'Website Content',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Direct Phone Number',
      admin: {
        description: 'Optional direct contact phone, e.g. +977 9851218358',
      },
    },
    {
      name: 'whatsApp',
      type: 'text',
      label: 'Direct WhatsApp Number',
      admin: {
        description: 'Optional direct WhatsApp contact, e.g. +977 9851218358',
      },
    },
    {
      name: 'isExpert',
      type: 'checkbox',
      defaultValue: false,
      label: 'Primary Expert Specialist (Show on site header/WhatsApp button)',
      admin: {
        description: 'Check this box to set this team member as the active website expert. Toggling this true will automatically un-toggle others and sync to Global Settings.',
        position: 'sidebar',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'twitter', type: 'text' },
      ],
    },
  ],
};
