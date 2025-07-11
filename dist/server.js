"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = require("http-status-codes");
const gateway_Routes_1 = require("./gateway.Routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(gateway_Routes_1.gatewayRouter);
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            error: err.message
        });
    }
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        messege: 'Internal server error'
    });
});
app.listen(process.env.PORT, () => console.log('Server online na porta', process.env.PORT));
