import { DashboardReport } from "../utils/DashboardReport";


const getDashboard = async (req, res) => {
    const userId = req.user;
    const response = DashboardReport(userId)
}

export {
    getDashboard
}