"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const sessionSecret = process.env.SESSION_SECRET || 'default_secret_key';
app.use((0, express_session_1.default)({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use('/api/', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use(errorMiddleware_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
