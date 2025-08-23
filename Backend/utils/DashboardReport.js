import Product from "../models/Product.js";
import Expense from "../models/Expense.js";
import Purchase from "../models/Purchase.js";
import Sale from "../models/Sales.js";
import Udhaar from "../models/Udhaar.js";

const DashboardReport = async (userId) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1);
    const currentYear = currentDate.getFullYear();

    const Udhaars = await Udhaar.find({ userId, status: "pending" });
    const Expenses = await Expense.find({
        userId,
        $expr: {
            $and: [
                { $eq: [{ $month: "$createdAt" }, currentMonth] },
                { $eq: [{ $year: "$createdAt" }, currentYear] }
            ]
        }
    });
    console.log(Expenses);
    const Expenses2 = await Expense.find({
        userId,
        $expr: {
            $and: [
                { $eq: [{ $month: "$createdAt" }, currentMonth - 1] },
                { $eq: [{ $year: "$createdAt" }, currentYear] }
            ]
        }
    });
    const Expenses3 = await Expense.find({
        userId,
        $expr: {
            $and: [
                { $eq: [{ $month: "$createdAt" }, currentMonth - 2] },
                { $eq: [{ $year: "$createdAt" }, currentYear] }
            ]
        }
    });
    const Expenses4 = await Expense.find({
        userId,
        $expr: {
            $and: [
                { $eq: [{ $month: "$createdAt" }, currentMonth - 3] },
                { $eq: [{ $year: "$createdAt" }, currentYear] }
            ]
        }
    });
    const Purchases = await Purchase.find({
        userId,
        $expr: {
            $and: [
                { $eq: [{ $month: "$createdAt" }, currentMonth] },
                { $eq: [{ $year: "$createdAt" }, currentYear] }
            ]
        }
    });
    const Sales = await Sale.find({
        userId,
        $expr: {
            $and: [
                { $eq: [{ $month: "$createdAt" }, currentMonth] },
                { $eq: [{ $year: "$createdAt" }, currentYear] }
            ]
        }
    });

    const totalSales = Sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const totalExpenses = Expenses.reduce((sum, s) => sum + (s.amount || 0), 0);
    const totalCredit = Udhaars.reduce((sum, s) => sum + (s.amount || 0), 0);
    const totalPurchase = Purchases.reduce((sum, s) => sum + (s.total || 0), 0);
    // const netProfit = totalSales - totalPurchase - totalExpenses - totalCredit;
    const netProfit = totalSales - totalPurchase - totalExpenses;

    const summary = {
        sales: totalSales,
        expenses: totalExpenses,
        profit: netProfit,
        credit: totalCredit,
    };

    // const Sales2 = await Sale.find({
    //     userId,
    //     $expr: {
    //         $and: [
    //             { $eq: [{ $month: "$createdAt" }, currentMonth - 1] },
    //             { $eq: [{ $year: "$createdAt" }, currentYear] }
    //         ]
    //     }
    // });
    const Sales3 = await Sale.find({
        userId,
        $expr: {
            $and: [
                { $eq: [{ $month: "$createdAt" }, currentMonth - 2] },
                { $eq: [{ $year: "$createdAt" }, currentYear] }
            ]
        }
    });
    const Sales4 = await Sale.find({
        userId,
        $expr: {
            $and: [
                { $eq: [{ $month: "$createdAt" }, currentMonth - 3] },
                { $eq: [{ $year: "$createdAt" }, currentYear] }
            ]
        }
    });

    const salesData = [
        { month: monthNames[currentMonth - 1], sales: Sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0), expenses: Expenses.reduce((sum, s) => sum + (s.amount || 0), 0) },
        { month: monthNames[currentMonth - 2], sales: Sales3.reduce((sum, s) => sum + (s.totalAmount || 0), 0), expenses: Expenses3.reduce((sum, s) => sum + (s.amount || 0), 0) },
        { month: monthNames[currentMonth - 3], sales: Sales4.reduce((sum, s) => sum + (s.totalAmount || 0), 0), expenses: Expenses4.reduce((sum, s) => sum + (s.amount || 0), 0) },
    ];

    const min = 3;
    const products = await Product.find({
        userId: userId,
        quantity: { $lt: min }
    }).select("itemname quantity");

    const lowStock = products.map(item => ({
        item: item.itemname,
        qty: item.quantity
    }));

    return ({
        summary: summary,
        salesData: salesData,
        lowStock: lowStock
    })

}

export { DashboardReport }


// import Product from "../models/Product.js";
// import Expense from "../models/Expense.js";
// import Purchase from "../models/Purchase.js";
// import Sale from "../models/Sales.js";
// import Udhaar from "../models/Udhaar.js";

// const DashboardReport = async (userId) => {
//     // Current date details
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();

//     try {
//         // Use Promise.all to run all database queries concurrently for better performance
//         const [
//             summaryData,
//             salesAndExpenseData,
//             categoryData,
//             lowStockItems
//         ] = await Promise.all([
//             getSummaryData(userId, currentYear),
//             getSalesAndExpenseData(userId, currentYear),
//             getCategoryData(userId, currentYear),
//             getLowStockItems(userId)
//         ]);

//         // Calculate the profit from the summary data
//         const profit = summaryData.totalSales - summaryData.totalExpenses;

//         // Combine all data into the final return object
//         return {
//             summary: {
//                 sales: summaryData.totalSales,
//                 expenses: summaryData.totalExpenses,
//                 profit: profit,
//                 credit: summaryData.totalCredit,
//             },
//             salesData: salesAndExpenseData,
//             categoryData: categoryData,
//             lowStock: lowStockItems,
//         };
//     } catch (error) {
//         console.error("Error generating dashboard report:", error);
//         throw new Error("Failed to generate dashboard report.");
//     }
// };

// // --- Aggregation helper functions ---

// // Helper function to get summary data: total sales, expenses, and credit.
// const getSummaryData = async (userId, currentYear) => {
//     // Aggregate total sales for the current year
//     const salesAggregation = await Sale.aggregate([
//         // Stage 1: Filter sales by userId and current year
//         {
//             $match: {
//                 userId: userId,
//                 createdAt: {
//                     $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
//                     $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
//                 }
//             }
//         },
//         // Stage 2: Group all matching documents into a single group and sum the totalAmount
//         {
//             $group: {
//                 _id: null,
//                 totalSales: { $sum: "$totalAmount" }
//             }
//         }
//     ]);

//     // Aggregate total expenses for the current year
//     const expensesAggregation = await Expense.aggregate([
//         // Stage 1: Filter expenses by userId and current year
//         {
//             $match: {
//                 userId: userId,
//                 createdAt: {
//                     $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
//                     $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
//                 }
//             }
//         },
//         // Stage 2: Group all matching documents and sum the amount
//         {
//             $group: {
//                 _id: null,
//                 totalExpenses: { $sum: "$amount" }
//             }
//         }
//     ]);

//     // Calculate total pending Udhaar
//     const udhaarTotal = await Udhaar.aggregate([
//         {
//             $match: {
//                 userId: userId,
//                 status: "pending"
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalCredit: { $sum: "$amount" }
//             }
//         }
//     ]);

//     // Extract the results or default to 0 if no documents were found
//     const totalSales = salesAggregation.length > 0 ? salesAggregation[0].totalSales : 0;
//     const totalExpenses = expensesAggregation.length > 0 ? expensesAggregation[0].totalExpenses : 0;
//     const totalCredit = udhaarTotal.length > 0 ? udhaarTotal[0].totalCredit : 0;

//     return {
//         totalSales,
//         totalExpenses,
//         totalCredit
//     };
// };

// // Helper function to get monthly sales and expenses.
// const getSalesAndExpenseData = async (userId, currentYear) => {
//     // Array of month names for mapping
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     // Aggregate monthly sales for the current year
//     const monthlySales = await Sale.aggregate([
//         {
//             $match: {
//                 userId: userId,
//                 createdAt: {
//                     $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
//                     $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
//                 }
//             }
//         },
//         {
//             $group: {
//                 _id: { month: { $month: "$createdAt" } },
//                 totalSales: { $sum: "$totalAmount" }
//             }
//         },
//         {
//             $sort: { "_id.month": 1 }
//         }
//     ]);

//     // Aggregate monthly expenses for the current year
//     const monthlyExpenses = await Expense.aggregate([
//         {
//             $match: {
//                 userId: userId,
//                 createdAt: {
//                     $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
//                     $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
//                 }
//             }
//         },
//         {
//             $group: {
//                 _id: { month: { $month: "$createdAt" } },
//                 totalExpenses: { $sum: "$amount" }
//             }
//         },
//         {
//             $sort: { "_id.month": 1 }
//         }
//     ]);

//     // Combine sales and expenses data into the desired format
//     const salesData = [];
//     for (let i = 1; i <= 12; i++) {
//         const monthName = monthNames[i - 1];
//         const sales = monthlySales.find(s => s._id.month === i);
//         const expenses = monthlyExpenses.find(e => e._id.month === i);

//         salesData.push({
//             month: monthName,
//             sales: sales ? sales.totalSales : 0,
//             expenses: expenses ? expenses.totalExpenses : 0
//         });
//     }

//     return salesData;
// };

// // Helper function to get category-wise sales data.
// const getCategoryData = async (userId, currentYear) => {
//     // This aggregation requires a $lookup to join the Sale and Product collections
//     const categoryAggregation = await Sale.aggregate([
//         // Stage 1: Filter sales by userId and current year
//         {
//             $match: {
//                 userId: userId,
//                 createdAt: {
//                     $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
//                     $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
//                 }
//             }
//         },
//         // Stage 2: Deconstruct the 'items' array. Each item in the array will become a separate document.
//         { $unwind: "$items" },
//         // Stage 3: Look up the product to get its category.
//         {
//             $lookup: {
//                 from: "products", // The collection to join with (MongoDB automatically pluralizes model names)
//                 localField: "items.productId", // Field from the input documents
//                 foreignField: "_id", // Field from the documents of the "products" collection
//                 as: "productDetails" // The name of the new array field to add to the input documents
//             }
//         },
//         // Stage 4: Deconstruct the productDetails array.
//         { $unwind: "$productDetails" },
//         // Stage 5: Group by the product's category and sum the total sales for that category.
//         {
//             $group: {
//                 _id: "$productDetails.category",
//                 value: { $sum: "$items.price" }
//             }
//         },
//         // Stage 6: Project the results to match the desired output format { name: "Category", value: 123 }
//         {
//             $project: {
//                 _id: 0,
//                 name: "$_id",
//                 value: "$value"
//             }
//         }
//     ]);
//     return categoryAggregation;
// };

// // Helper function to get low stock items.
// const getLowStockItems = async (userId) => {
//     // Define the stock threshold
//     const STOCK_THRESHOLD = 10;

//     const lowStock = await Product.find({
//         userId: userId,
//         quantity: { $lt: STOCK_THRESHOLD } // Find products where quantity is less than the threshold
//     }).select("itemname quantity"); // Select only the itemname and quantity fields

//     // Map the results to match the desired output format { item: "name", qty: 1 }
//     return lowStock.map(product => ({
//         item: product.itemname,
//         qty: product.quantity
//     }));
// };

// export {
//     DashboardReport
// };