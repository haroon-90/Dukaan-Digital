import Product from "../models/Product.js";

const FindDailyReport = async (sales, expenses, udhaar) => {
    let totalSale = 0;
    let totalProfit = 0;

    for (const sale of sales) {

        for (const item of sale.items) {
            totalSale += item.price * item.quantity;

            const product = await Product.findById(item.productId);
            if (product) {
                const purchaseTotal = product.purchasePrice * item.quantity;
                const profit = (item.price * item.quantity) - purchaseTotal;
                totalProfit += profit;
            }
        }
    }

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalUdhaar = udhaar.reduce((sum, u) => sum + u.amount, 0);

    const netAmount = totalProfit - totalExpense - totalUdhaar;

    return {
        totalSale,
        totalProfit,
        totalExpense,
        totalUdhaar,
        netAmount
    };
};


export {
    FindDailyReport
}