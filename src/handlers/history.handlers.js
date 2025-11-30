import { DetailHistory, History } from '../models/history.models.js';
import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function HistoryHandler(req, res) {
  try {
    const userID = req.user?.id;
    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not logged in",
      });
    }

    // --- FILTER AND PAGINATION ---
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const month = Number(req.query.month) || 0;
    const status = Number(req.query.status) || 0;

    // --- GET DATA HISTORY ---
    const histories = await History({ 
        userID, 
        month,
        status, 
        skip, 
        take: limit,
    });
    const total = await History({ userID, month, status, countOnly: true})
    if (!histories || histories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "history not found",
        results: []
      });
    }

    const totalPages = Math.ceil(total / limit);
    const baseURL = "/history";
    const queryString = new URLSearchParams();
    if (month) queryString.append("month", month);
    if (status) queryString.append("status", status);

    // --- PREV URL ---
    let prevURL = null;
    if (page > 1) {
      const qs = new URLSearchParams(queryString);
      qs.append("page", page - 1);
      prevURL = `${baseURL}?${qs.toString()}`;
    }
    // --- NEXT URL ---
    let nextURL = null;
    if (page < totalPages) {
      const qs = new URLSearchParams(queryString);
      qs.append("page", page + 1);
      nextURL = `${baseURL}?${qs.toString()}`;
    }


    return res.status(200).json({
      success: true,
      message: "Get history successfully",
      page,
      limit,
      total,
      totalPages,
      prevURL,
      nextURL,
      results: histories,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
}


export async function DetailHistoryHandler(req, res) {

  try {
    const userID = req.user?.id;
    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not logged in",
      });
    }

    const historyID = Number(req.params.id);
    if (!historyID) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID",
      });
    }

    const detail = await DetailHistory(userID, historyID );
    return res.status(200).json({
      success: true,
      message: "Get detail history successfully",
      result: detail,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch detail history",
    });
  }
}