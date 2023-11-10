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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../../lib/prisma/db");
var check_password_strength_1 = require("check-password-strength");
//Users
/*
    id        Int      @id @default(autoincrement())
    firstName String
    lastName  String
    phone     String?
    email     String   @unique
    password  String
    tasks     Task[]
*/
// pages/api/user.js
function handler(route, req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (route) {
                case '/user':
                    switch (req.method) {
                        case 'POST':
                            Userpost(req, res);
                            break;
                        case 'DELETE':
                            Userdelete(req, res);
                            break;
                        case 'PUT':
                            Userput(req, res);
                            break;
                        default:
                            res.status(405).json({ error: 'Method Not Allowed' });
                    }
                    break;
                case '/user/:userId':
                    Userget(req, res);
                    break;
                case '/task':
                    switch (req.method) {
                        case 'POST':
                            Taskpost(req, res);
                            break;
                        case 'DELETE':
                            Taskdelete(req, res);
                            break;
                        case 'PUT':
                            Taskput(req, res);
                            break;
                        default:
                            res.status(405).json({ error: 'Method Not Allowed' });
                    }
                    break;
                case '/task/:taskId':
                    Taskget(req, res);
                    break;
                default:
                    res.status(404).json({ error: 'Not Found' });
            }
            return [2 /*return*/];
        });
    });
}
exports.default = handler;
function Userget(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = Array.isArray(req.query.userId) ? req.query.userId[0] : req.query.userId || '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: parseInt(userId) },
                        })];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                    }
                    res.json(user);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(500).json({ error: "Failed to fetch user" });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function Userpost(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, firstName, lastName, _b, phone, email, password, user, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _a = req.body, firstName = _a.firstName, lastName = _a.lastName, _b = _a.phone, phone = _b === void 0 ? null : _b, email = _a.email, password = _a.password;
                    if ((0, check_password_strength_1.passwordStrength)(password).value !== 'Strong') {
                        return [2 /*return*/, res.status(400).json({
                                message: "Password must be strong",
                            })];
                    }
                    if (!firstName ||
                        !lastName ||
                        !email ||
                        !password) {
                        return [2 /*return*/, res.status(400).json({
                                message: "Missing required fields",
                            })];
                    }
                    return [4 /*yield*/, db_1.prisma.user.create({
                            data: {
                                firstName: firstName,
                                lastName: lastName,
                                phone: phone,
                                email: email,
                                password: password
                            },
                        })];
                case 1:
                    user = _c.sent();
                    return [2 /*return*/, res.status(201).json({ message: "User Created", user: user })];
                case 2:
                    error_2 = _c.sent();
                    return [2 /*return*/, res.status(500).json({ error: error_2.message })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function Userdelete(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rawuserId, userId, deletedResource, eror_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rawuserId = Array.isArray(req.query.userId) ? req.query.userId[0] : req.query.userId || '';
                    userId = parseInt(rawuserId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.user.delete({
                            where: { id: userId },
                        })];
                case 2:
                    deletedResource = _a.sent();
                    res.json({ message: "Deleted resource with ID ".concat(deletedResource.id) });
                    return [3 /*break*/, 4];
                case 3:
                    eror_1 = _a.sent();
                    res.status(500).json({ error: "Failed to delete user" });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function Userput(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, updatedUser, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.userId) {
                        return [2 /*return*/, res.status(400).json({ error: "No request body" })];
                    }
                    userId = parseInt(req.body.userId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: userId },
                            data: req.body,
                        })];
                case 2:
                    updatedUser = _a.sent();
                    res.json(updatedUser);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.status(500).json({ error: "Failed to update user" });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//Task
/*
    id           Int      @id @default(autoincrement())
    name         String
    description  String
    taskType     String
    userid       Int
    createdDate  DateTime
    dueDate      DateTime
    completedDate DateTime?
    user         User     @relation(fields: [userid], references: [id])
*/
function Taskpost(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name_1, description, taskType, userid, createdDate, dueDate, _b, completedDate, task, error_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    _a = req.body, name_1 = _a.name, description = _a.description, taskType = _a.taskType, userid = _a.userid, createdDate = _a.createdDate, dueDate = _a.dueDate, _b = _a.completedDate, completedDate = _b === void 0 ? null : _b;
                    if (!req.body.name ||
                        !req.body.description ||
                        !req.body.taskType ||
                        !req.body.userid ||
                        !req.body.createdDate ||
                        !req.body.dueDate) {
                        return [2 /*return*/, res.status(400).json({
                                message: "Missing required fields",
                            })];
                    }
                    return [4 /*yield*/, db_1.prisma.task.create({
                            data: {
                                name: name_1,
                                description: description,
                                taskType: taskType,
                                userid: userid,
                                createdDate: createdDate,
                                dueDate: dueDate,
                                completedDate: completedDate
                            },
                        })];
                case 1:
                    task = _c.sent();
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: task.userid },
                            data: {
                                tasks: {
                                    connect: { id: task.id }, // Connect the new task to the user
                                },
                            },
                        })];
                case 2:
                    _c.sent();
                    return [2 /*return*/, res.status(201).json({ message: "Task Created for ".concat(userid), task: task })];
                case 3:
                    error_4 = _c.sent();
                    return [2 /*return*/, res.status(500).json({ error: error_4.message })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function Taskget(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var taskId, task, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.taskId) {
                        return [2 /*return*/, res.status(400).json({ error: "Task not Found" })];
                    }
                    taskId = Array.isArray(req.query.taskId) ? req.query.taskId[0] : req.query.taskId || '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.task.findUnique({
                            where: { id: parseInt(taskId) },
                        })];
                case 2:
                    task = _a.sent();
                    if (!task) {
                        return [2 /*return*/, res.status(404).json({ error: "Task not found" })];
                    }
                    res.json(task);
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ error: "Failed to fetch task" })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function Taskput(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var taskId, updatedTask, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.body || !req.body.taskId) {
                        return [2 /*return*/, res.status(400).json({ error: "Task not Found" })];
                    }
                    taskId = parseInt(req.body.taskId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: taskId },
                            data: req.body,
                        })];
                case 2:
                    updatedTask = _a.sent();
                    res.json(updatedTask);
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ error: error_6.message })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function Taskdelete(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var taskId, deletedResource, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    taskId = req.body.taskId;
                    return [4 /*yield*/, db_1.prisma.task.delete({
                            where: { id: taskId },
                        })];
                case 1:
                    deletedResource = _a.sent();
                    res.json({ message: "Deleted resource with ID ".concat(deletedResource.id) });
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ error: "Failed to delete task" })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
