import wrapAsync from "../utils/wrapAsync.js";
import { Report } from "../models/reportModel.js";
import { Exercise } from "../models/exerciseModel.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

export const getUserReports = wrapAsync(async (req, res) => {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, reports });
});

export const getDashboardStats = wrapAsync(async (req, res) => {
    const userId = req.user._id;
    const recentReports = await Report.find({ userId }).sort({ analysisDate: -1 }).limit(5).lean();
    const latestReport = recentReports[0] || null;
    const averageMetrics = await Report.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, avgJitter: { $avg: { $ifNull: ["$acousticFeatures.Jitter_Percent", 0] } }, avgShimmer: { $avg: { $ifNull: ["$acousticFeatures.Shimmer_Percent", 0] } }, mfccMean: { $avg: { $ifNull: ["$acousticFeatures.MFCC_Mean", []] } }, mfccStd: { $avg: { $ifNull: ["$acousticFeatures.MFCC_Std", []] } }, }, },
    ]);
    const weeklyData = await Report.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $addFields: { analysisDateAsDate: { $toDate: "$analysisDate" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$analysisDateAsDate" } }, avgJitter: { $avg: { $ifNull: ["$acousticFeatures.Jitter_Percent", 0] } }, avgShimmer: { $avg: { $ifNull: ["$acousticFeatures.Shimmer_Percent", 0] } }, } },
        { $sort: { _id: 1 } }
    ]);
    const predictionDistribution = await Report.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: "$prediction", count: { $sum: 1 }, }, },
    ]);
    const formattedPredictions = {};
    predictionDistribution.forEach((entry) => { formattedPredictions[entry._id] = entry.count; });
    const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const todayExercises = await Exercise.findOne({ userId, date: today });
    res.json({
        success: true,
        data: {
            recentReports,
            latestReport,
            averages: averageMetrics.length > 0 ? averageMetrics[0] : { avgJitter: 0, avgShimmer: 0, mfccMean: [], mfccStd: [] },
            weeklyData: weeklyData.map((entry) => ({ date: entry._id, jitter: entry.avgJitter, shimmer: entry.avgShimmer })),
            predictionDistribution: formattedPredictions,
            exerciseProgress: { completed: todayExercises?.completedExercises.length || 0, total: 9 },
        },
    });
});

export const diagnose = wrapAsync(async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No audio file provided" });
    const filePath = path.join("./backend/uploads", req.file.filename);
    try {
        const formData = new FormData();
        formData.append("audio", fs.createReadStream(filePath));
        const flaskResponse = await axios.post("http://127.0.0.1:8080/api/process_audio", formData, { headers: formData.getHeaders() });
        fs.unlink(filePath, () => {});
        if (!flaskResponse.data) return res.status(500).json({ success: false, message: "No response from AI model" });
        const { "Acoustic Features": acousticFeatures, "Confidence Scores": confidenceScores, "Findings": findings, "PDF_URL": pdfUrl, "Prediction": prediction } = flaskResponse.data;
        const analysisDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        const report = await Report.create({ userId: req.user._id, acousticFeatures, analysisDate, confidenceScores, findings, pdfUrl, prediction });
        res.json({ success: true, message: "Report generated successfully", report });
    } catch (error) {
        fs.unlink(filePath, () => {});
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});