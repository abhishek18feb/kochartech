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
const util_1 = require("../../util");
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
const feedBackReport = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const feedBackReport = yield report_1.default.aggregate([{ $match: {
                type: type
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
            $lookup: {
                from: "agents",
                localField: "agentId",
                foreignField: "_id",
                as: "agents_docs"
            }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$report_docs", 0] }, "$$ROOT"] } }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$customer_docs", 0] }, "$$ROOT"] } }
        },
        {
            $unwind: "$agents_docs"
        },
        { $project: { "name": 1, "agents_docs.name": 1, "userComment": 1, "rating": 1, "startDate": 1, "endDate": 1, "type": 1, "callLog": 1 } }
    ]);
    let result = [];
    if (type == 4) {
        result = feedBackReport.map((feedback) => ({
            "CustomerName": feedback.name,
            "UserComments": feedback.userComment,
            "rating": feedback.rating,
            "startDate": feedback.startDate
        }));
    }
    else {
        result = feedBackReport.map((feedback) => {
            var _a;
            return ({
                "CustomerName": feedback.name,
                "AgentName": (_a = feedback.agents_docs) === null || _a === void 0 ? void 0 : _a.name,
                "startDate": feedback.startDate,
                "endDate": feedback.endDate,
                "type": feedback.type,
                "callLog": feedback.callLog
            });
        });
    }
    return result;
});
const otherReports = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const allReports = yield report_1.default.find({ type: type })
        .select('customerId agentId startDate endDate type callLog')
        .populate({ path: 'customerId', select: 'name' })
        .populate({ path: 'agentId', select: 'name' });
    const ViewResult = allReports.map((feedback) => {
        var _a, _b;
        return {
            CustomerName: (_a = feedback.customerId) === null || _a === void 0 ? void 0 : _a.name,
            AgentName: (_b = feedback.agentId) === null || _b === void 0 ? void 0 : _b.name,
            startDate: feedback.startDate,
            endDate: feedback.endDate,
            type: feedback.type,
            callLog: feedback.callLog
        };
    });
    return ViewResult;
});
const genReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let ViewResult;
    let result;
    try {
        // if(req.params.type > 4) throw new Error("Invalid Type");
        if (isNaN(req.params.type) || (parseInt(req.params.type) < 1 && parseInt(req.params.type) > 4))
            throw new Error('Not a valid type');
        if (req.params.type == "4") {
            result = yield feedBackReport(req.params.type);
        }
        else {
            // ViewResult = await otherReports(req.params.type)
            ViewResult = yield feedBackReport(req.params.type);
        }
        return util_1.successReponse(res, {
            result: req.params.type == "4" ? result : ViewResult,
            message: "Record fetched Successfully"
        });
    }
    catch (error) {
        return util_1.errorReponse(res, {
            status_code: 400,
            message: error.message
        });
    }
});
exports.genReport = genReport;
