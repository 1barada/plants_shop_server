export default function truncateToTwoDecimal(num) {
    const result = `${num}`.match(/^\d+[.]{0,1}\d{0,2}/);
    return parseFloat(result);
}