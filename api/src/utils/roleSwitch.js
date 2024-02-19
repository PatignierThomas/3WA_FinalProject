export const IDToLetterRoleSwitch = (role_id) => {
    switch(role_id) {
        case 1:
            return "user";
        case 2:
            return "admin";
        case 3:
            return "moderator";
        case 4:
            return "developer";
        default:
            return "user";
    }
}

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