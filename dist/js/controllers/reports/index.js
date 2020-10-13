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
const util_1 = require("../../util");
const feedBackReport = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [{ $match: {
                type: type
            } },
        {
            $lookup: {
                from: "feedbacks",
                localField: "customerId",
                foreignField: "customerId",
                as: "feedback_docs"
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
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$feedback_docs", 0] }, "$$ROOT"] } }
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$customer_docs", 0] }, "$$ROOT"] } }
        },
        {
            $addFields: { CustomerName: "$name", AgentName: { $arrayElemAt: ["$agents_docs.name", 0] } }
        }
    ];
    if (type == 4) {
        pipeline.push({ $project: { "CustomerName": 1, "userComment": 1, "rating": 1, "startDate": 1 } });
    }
    else {
        pipeline.push({ $project: { "CustomerName": 1, "AgentName": 1, "startDate": 1, "endDate": 1, "type": 1, "callLog": 1 } });
    }
    const feedBackReport = yield report_1.default.aggregate(pipeline);
    return feedBackReport;
});
const genReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let ViewResult;
    let result;
    try {
        if (isNaN(req.params.type) || (parseInt(req.params.type) < 1 && parseInt(req.params.type) > 4))
            throw new Error('Not a valid type');
        if (req.params.type == "4") {
            result = yield feedBackReport(req.params.type);
        }
        else {
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
