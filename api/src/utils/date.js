export const getAge = (birthdate) => {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const month = today.getMonth() - birthdate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

export const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return new Date(date).toLocaleDateString('fr-FR', options);
}

export const TimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past; // milliseconds between now & past

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // convert milliseconds to days
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // convert remaining milliseconds to hours
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // convert remaining milliseconds to minutes

    let result = '';
    if (diffDays > 0) {
        result += `${diffDays}j `;
    }
    if (diffHrs > 0 || diffDays > 0) {
        result += `${diffHrs}h `;
    }
    result += `${diffMins}m`;

    return result;
}