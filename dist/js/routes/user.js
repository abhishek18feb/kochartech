"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const router = express_1.Router();
router.get('/users', users_1.getUsers);
router.post('/add-user', users_1.addUser);
router.put('/edit-user/:id', users_1.updateUser);
router.delete('/delete-user/:id', users_1.deleteUser);
exports.default = router;
