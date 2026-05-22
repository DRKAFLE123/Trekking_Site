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
