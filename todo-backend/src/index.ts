import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Automatically configures Authenticated role permissions
   * so the frontend can perform CRUD on todo-lists and
   * resolve user relations without manual admin setup.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Actions the Authenticated role needs
    const requiredActions = [
      'api::todo-list.todo-list.find',
      'api::todo-list.todo-list.findOne',
      'api::todo-list.todo-list.create',
      'api::todo-list.todo-list.update',
      'api::todo-list.todo-list.delete',
      'plugin::users-permissions.user.find',
      'plugin::users-permissions.user.findOne',
    ];

    // Get the Authenticated role
    const authenticatedRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (!authenticatedRole) {
      strapi.log.warn('Bootstrap: Authenticated role not found, skipping permission setup.');
      return;
    }

    // Get existing permissions for this role
    const existingPermissions = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({
        where: {
          role: authenticatedRole.id,
        },
      });

    const existingActions = new Set(existingPermissions.map((p: any) => p.action));

    // Create any missing permissions
    for (const action of requiredActions) {
      if (!existingActions.has(action)) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action,
            role: authenticatedRole.id,
          },
        });
        strapi.log.info(`Bootstrap: Granted "${action}" to Authenticated role.`);
      }
    }

    strapi.log.info('Bootstrap: Permission setup complete.');
  },
};
