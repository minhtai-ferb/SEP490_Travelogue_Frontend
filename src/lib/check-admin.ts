export const isAdmin = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    const userDataString = localStorage.getItem('USER');
    if (!userDataString) {
        return false;
    }

    const userData = JSON.parse(userDataString);

    if (!userData.roles || !Array.isArray(userData.roles)) {
        return false; // Return false if role is undefined or not an array
    }

    return userData.roles.includes('Admin');
};

export const hasHigherRole = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    const userDataString = localStorage.getItem('USER');
    if (!userDataString) {
        return false;
    }

    const userData = JSON.parse(userDataString);

    if (!userData.roles || !Array.isArray(userData.roles)) {
        return false;
    }

    const higherRoles = ['Admin', 'Moderator', 'TourGuide', 'CraftVillageOwner'];

    return userData.roles.some((role: string) => higherRoles.includes(role));
};

export const checkRole = (role: string) => {
    if (typeof window === 'undefined') {
        return false;
    }
    const userDataString = localStorage.getItem('USER');
    if (!userDataString) {
        return false;
    }

    const userData = JSON.parse(userDataString);

    if (!userData.roles || !Array.isArray(userData.roles)) {
        return false; // Return false if role is undefined or not an array
    }

    return userData.roles.includes(role);
}