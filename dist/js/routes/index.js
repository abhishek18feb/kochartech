"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_1 = require("../controllers/reports");
const router = express_1.Router();
router.post('/add-report', reports_1.addReport);
router.post('/add-feedback', reports_1.addFeedback);
router.get('/gen-reports/:type', reports_1.genReport);
exports.default = router;
