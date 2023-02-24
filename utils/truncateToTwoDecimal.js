export default function truncateToTwoDecimal(num) {
    const result = (Math.floor(num * 100) / 100).toFixed(2);
    return parseFloat(result);
}