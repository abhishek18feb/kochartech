"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_1 = require("../controllers/reports");
const router = express_1.Router();
router.get('/gen-reports/:type', reports_1.genReport);
exports.default = router;
