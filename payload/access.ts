import { Access } from 'payload';

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && user.role === 'admin');
};

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return Boolean(user && (user.role === 'admin' || user.role === 'editor'));
};

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user);
};

/**
 * Dynamically checks user permissions based on their assigned custom role.
 * Fallbacks to legacy static roles if they are not configured as 'custom'.
 */
export const checkPermission = (
  collectionSlug: string,
  action: 'read' | 'create' | 'update' | 'delete'
): Access => {
  return async ({ req }) => {
    const user = req.user;
    if (!user) return false;

    // 1. Superadmin (role = 'admin') gets absolute bypass
    if (user.role === 'admin') return true;

    // 2. Custom Role check (queries the Roles collection in DB)
    if (user.role === 'custom' && user.customRole) {
      const roleId = typeof user.customRole === 'object' ? user.customRole.id : user.customRole;
      try {
        const roleDoc = await req.payload.findByID({
          collection: 'roles',
          id: roleId,
          depth: 0,
        });

        if (roleDoc && roleDoc.permissions) {
          const permissionKey = `${collectionSlug}_${action}`;
          return Boolean((roleDoc.permissions as any)[permissionKey]);
        }
      } catch (err) {
        console.error(`[Access Check] Error fetching role ${roleId} permissions:`, err);
      }
    }

    // 3. Fallbacks for standard legacy roles (editor/viewer)
    if (user.role === 'editor') {
      if (action === 'read' || action === 'create' || action === 'update') {
        const adminOnlyCollections = ['users', 'roles', 'siteSettings', 'payments'];
        return !adminOnlyCollections.includes(collectionSlug);
      }
      return false;
    }

    if (user.role === 'viewer') {
      return action === 'read';
    }

    return false;
  };
};
