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