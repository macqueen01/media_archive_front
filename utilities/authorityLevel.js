function checkAuthority(is_staff, is_active) {
    console.log(is_staff, is_active)
    if (is_staff) {
        return 2;
    } else if (is_active) {
        return 1;
    } 

    return 0;
}

module.exports = {
    checkAuthority
}