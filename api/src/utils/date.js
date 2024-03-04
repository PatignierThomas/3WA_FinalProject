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