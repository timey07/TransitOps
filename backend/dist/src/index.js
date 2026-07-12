"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const auth_1 = __importDefault(require("./routes/auth"));
const drivers_1 = __importDefault(require("./routes/drivers"));
const maintenance_1 = __importDefault(require("./routes/maintenance"));
const auth_2 = require("./routes/auth");
// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'TransitOps Backend API is running' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/vehicles', auth_2.authenticateToken, vehicles_1.default);
app.use('/api/drivers', auth_2.authenticateToken, drivers_1.default);
app.use('/api/maintenance', auth_2.authenticateToken, maintenance_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
