export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STUDENT: 'student',
};


export function hasRole(user, role) {
    if (!user) return false;
    return user.publicMetadata?.role === role;
}

export function hasAnyRole(user, roles) {
    if (!user) return false;
    const userRole = user.publicMetadata?.role;
    return roles.includes(userRole);
}

export function getUserRole(user) {
    return user?.publicMetadata?.role || null;
}