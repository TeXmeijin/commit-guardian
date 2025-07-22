// Example file for testing commit-guardian side-by-side diff viewer
// Added comment for testing
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price * item.quantity; // Added quantity multiplication
    }
    return total;
}

function processOrder(order) {
    const total = calculateTotal(order.items);
    const tax = total * 0.1; // Added tax calculation
    console.log(`Order total: ${total + tax}`);
    return total + tax; // Return total with tax
}