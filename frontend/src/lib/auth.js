import { redirect } from "react-router";


/**
 * Checks if a user is authenticated and redirects to login if not.
 * 
 * @param {Object} clerk - The Clerk instance from useClerk() hook
 * @returns {Promise<Object>} The authenticated user object
 */
export async function requireAuth(clerk) {
    await clerk.loaded;

    if (!clerk.user) {
        throw redirect("/login");
    }

    return clerk.user;
}

/**
 * Redirects authenticated users away from auth pages.
 * 
 * @param {Object} clerk - The Clerk instance from useClerk() hook
 * @returns {Promise<null>} Returns null if user is not authenticated
 */
export async function redirectIfAuthenticated(clerk) {
    await clerk.loaded;

    if (clerk.user) {
        throw redirect("/dashboard");
    }

    return null;
}

/**
 * Checks if user has a specific role and redirects if unauthorized.
 * 
 * @param {Object} clerk - The Clerk instance from useClerk() hook
 * @param {string} requiredRole - The role required to access the route
 * @returns {Promise<Object>} The authenticated user object if authorized
 */
export async function requireRole(clerk, requiredRole) {
    await clerk.loaded;

    if (!clerk.user) {
        throw redirect("/login");
    }

    const userRole = clerk.user.publicMetadata?.role;

    if (userRole !== requiredRole) {
        throw redirect("/unauthorized");
    }

    return clerk.user;
}

/**
 * Checks if user has any of the specified roles.
 * 
 * @param {Object} clerk - The Clerk instance from useClerk() hook
 * @param {string[]} allowedRoles - Array of roles that can access the route
 * @returns {Promise<Object>} The authenticated user object if authorized
 */
export async function requireAnyRole(clerk, allowedRoles) {
    await clerk.loaded;

    if (!clerk.user) {
        throw redirect("/login");
    }

    const userRole = clerk.user.publicMetadata?.role;

    if (!allowedRoles.includes(userRole)) {
        throw redirect("/unauthorized");
    }

    return clerk.user;
}