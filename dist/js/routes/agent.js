"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agents_1 = require("../controllers/agents");
const router = express_1.Router();
router.get('/agents', agents_1.getAgents);
exports.default = router;
