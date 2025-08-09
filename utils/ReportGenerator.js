import Product from "../models/Product.js";

const FindReport = async (sales, expenses, udhaar) => {
    // Initialize totals
    let totalSale = 0;
    let totalProfit = 0;
    let totalQuantitySold = 0;

    // Flatten all items from all sales
    const allItems = sales.flatMap(sale => sale.items || []);

    // Get all unique product IDs
    const productIds = [...new Set(allItems.map(item => item.productId))];

    // Fetch all products in one go to avoid repeated DB queries
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // Create a map for quick access
    const productMap = new Map(products.map(p => [p._id.toString(), p]));
    console.log(productMap)

    // Calculate totals
    for (const item of allItems) {
        if (!item.price || !item.quantity) continue; // Skip invalid items

        const itemTotal = item.price * item.quantity;
        totalSale += itemTotal;
        totalQuantitySold += item.quantity;

        const product = productMap.get(item.productId.toString());
        if (product && product.purchasePrice != null) {
            const purchaseTotal = product.purchasePrice * item.quantity;
            totalProfit += itemTotal - purchaseTotal;
        }
    }

    // Calculate expenses and udhaar totals
    const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    // const totalUdhaar = udhaar.reduce((sum, u) => sum + (u.amount || 0), 0);
    const totalUdhaar = udhaar.reduce((sum, u) => {
        if (u.status === "pending") {
            return sum + (u.amount || 0);
        }
        return sum; // agar status paid aur ho
    }, 0);

    // Paid udhaar ka total nikal lo (jo profit me add karna hai)

    const totalPaidUdhaar = udhaar.reduce((sum, u) => {
        if (u.status === "paid") {
            return sum + (u.amount || 0);
        }
        return sum;
    }, 0);

    const adjustedProfit = totalProfit + totalPaidUdhaar;

    // Net amount based on profit (adjust if needed)
    const netAmount = adjustedProfit - totalExpense - totalUdhaar;

    // Return detailed report
    return {
        totalSale,
        totalProfit : adjustedProfit,
        totalExpense,
        totalUdhaar,
        netAmount,
        totalQuantitySold,
        numberOfSales: sales.length,
        numberOfExpenses: expenses.length,
        numberOfUdhaar: udhaar.length
    };
};

export { FindReport };