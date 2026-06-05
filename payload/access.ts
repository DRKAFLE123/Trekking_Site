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

// Closes the hole where anonymous POSTs to Payload's auto-generated REST
// endpoints (e.g. POST /api/inquiries) bypassed our reCAPTCHA-gated form
// handlers. The REST endpoint runs access checks; this rule rejects it.
//
// Our own /api/booking, /api/contact, /api/plan-trip, /api/newsletter routes
// call `payload.create()` via the Local API without passing a `req`, which
// in Payload v3 bypasses access checks entirely — so they keep working.
// If anyone later starts passing `req` from those routes, they can opt back
// in by setting `req.context.fromTrustedRoute = true`.
export const fromTrustedRouteOrAuthenticated: Access = ({ req }) => {
  if ((req as any)?.context?.fromTrustedRoute === true) return true;
  return Boolean(req.user);
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
      const rawRoleId = typeof user.customRole === 'object' ? user.customRole.id : user.customRole;
      const roleId = typeof rawRoleId === 'string' && !isNaN(Number(rawRoleId)) ? Number(rawRoleId) : rawRoleId;
      try {
        const roleDoc = await req.payload.findByID({
          collection: 'roles',
          id: roleId,
          depth: 0,
          overrideAccess: true,
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
