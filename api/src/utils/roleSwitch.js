export const letterToIDRoleSwitch = (role) => {
    switch(role) {
        case "user":
            return 1;
        case "admin":
            return 2;
        case "moderator":
            return 3;
        case "developer":
            return 4;
        default:
            return 1;
    }
}