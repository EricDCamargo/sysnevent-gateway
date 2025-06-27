"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gatewayRouter = void 0;
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
exports.gatewayRouter = router;
router.use((req, res, next) => {
    const start = performance.now();
    console.log('\n--- Incoming Request ---');
    console.log(`[METHOD] ${req.method}`);
    console.log(`[URL] ${req.originalUrl}`);
    console.log('[HEADERS]', req.headers);
    res.on('finish', () => {
        const duration = (performance.now() - start).toFixed(2);
        console.log(`[STATUS] ${res.statusCode}`);
        console.log(`[DURATION] ${duration} ms`);
        console.log('------------------------\n');
    });
    next();
});
const proxyWithLogging = (prefix, target, preservePath) => (0, http_proxy_middleware_1.createProxyMiddleware)({
    target,
    changeOrigin: true,
    pathRewrite: preservePath ? undefined : { [`^${prefix}`]: '' },
    on: {
        proxyReq: (proxyReq, req, res) => {
            const expressReq = req;
            console.log(`[PROXY] Forwarding to: ${target}${expressReq.originalUrl}`);
        },
        proxyRes: (proxyRes, req, res) => {
            console.log(`[PROXY] Response from target with status ${proxyRes.statusCode}`);
        }
    }
});
// === PARTICIPANT SERVICE ===
router.use('/participants', proxyWithLogging('/participants', process.env.PARTICIPANT_SERVICE, false));
// === EVENT SERVICE ===
router.use('/events', proxyWithLogging('/events', process.env.EVENT_SERVICE, false));
// === REPORTS SERVICE ===
router.use('/reports', proxyWithLogging('/reports', process.env.REPORT_SERVICE, false));
// === USER SERVICE — passando todo o tráfego para ele ===
router.use('/', proxyWithLogging('/', process.env.USER_SERVICE, true));
