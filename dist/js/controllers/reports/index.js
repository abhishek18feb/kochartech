"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genReport = exports.addFeedback = exports.addReport = void 0;
const report_1 = __importDefault(require("../../models/report"));
const feedback_1 = __importDefault(require("../../models/feedback"));
const addReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        console.log('request body', req.body);
        const report = new report_1.default(Object.assign({}, body));
        const newReport = yield report.save();
        const allReports = yield report_1.default.find();
        res.status(201).json({ message: 'Report added', report: newReport, reports: allReports });
    }
    catch (error) {
        throw error;
    }
});
exports.addReport = addReport;
const addFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        console.log('request body', req.body);
        const feedback = new feedback_1.default(Object.assign({}, body));
        const newFeedBack = yield feedback.save();
        const allFeedBack = yield feedback_1.default.find();
        res.status(201).json({ message: 'FeedBack added', feedback: newFeedBack, feedbacks: allFeedBack });
    }
    catch (error) {
        throw error;
    }
});
exports.addFeedback = addFeedback;
const genReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedBackReport = yield report_1.default.aggregate([{ $match: {
                    type: req.params.type
                } },
            {
                $lookup: {
                    from: "feedbacks",
                    localField: "customerId",
                    foreignField: "customerId",
                    as: "report_docs"
                }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer_docs"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$report_docs", 0] }, "$$ROOT"] } }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$customer_docs", 0] }, "$$ROOT"] } }
            },
            { $project: { "name": 1, "userComment": 1, "rating": 1, "startDate": 1, } }
        ]);
        const result = feedBackReport.map(feedback => ({
            "Customer Name": feedback.name,
            "UserComments": feedback.userComment,
            "rating": feedback.rating,
            "startDate": feedback.startDate
        }));
        console.log(feedBackReport);
        const allReports = yield report_1.default.find({ type: req.params.type })
            .select('customerId agentId startDate endDate type callLog')
            .populate({ path: 'customerId', select: 'name' })
            .populate({ path: 'agentId', select: 'name' });
        const ViewResult = allReports.map((feedback) => {
            var _a, _b;
            return {
                "Customer Name": (_a = feedback.customerId) === null || _a === void 0 ? void 0 : _a.name,
                "Agent Name": (_b = feedback.agentId) === null || _b === void 0 ? void 0 : _b.name,
                startDate: feedback.startDate,
                endDate: feedback.endDate,
                type: feedback.type,
                callLog: feedback.callLog
            };
        });
        res.status(200).json({
            status_code: 200,
            data: req.params.type == "4" ? result : ViewResult,
            message: "Record fetched Successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            status_code: 400,
            message: "Something went wrong",
            errors: error.message
        });
    }
});
exports.genReport = genReport;
