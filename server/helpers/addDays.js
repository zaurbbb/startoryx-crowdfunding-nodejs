module.exports = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}