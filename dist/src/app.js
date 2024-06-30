"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const usersRoutes_1 = __importDefault(require("../routes/usersRoutes"));
const blogRoutes_1 = __importDefault(require("../routes/blogRoutes"));
const commentRoutes_1 = __importDefault(require("../routes/commentRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookieParser = require("cookie-parser");
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const passport = require("passport");
const express_session_1 = __importDefault(require("express-session"));
const MongoStore = require("connect-mongo");
// import { session } from "passport";
require("../strategies/githubStrategy");
dotenv_1.default.config();
const app = (0, express_1.default)();
mongoose_1.default.connect("mongodb+srv://hussainianna757:tJsEbu1i5xeRN5st@blog-site.0pgxa6f.mongodb.net/blog");
const port = process.env.PORT || 8000;
const db = mongoose_1.default.connection;
db.on("connected", () => console.log("Connected to DataBase successfully"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_session_1.default)({
    secret: "jeremiah",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 * 60 },
    store: MongoStore.create({ client: mongoose_1.default.connection.getClient() }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.ACCESS_ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
app.get("/user/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/user/gitoauth/callback", passport.authenticate("github", { failureRedirect: "/login" }), function (req, res) {
    res.redirect("/");
    return;
});
app.use("/users", usersRoutes_1.default);
app.use("/blogs", blogRoutes_1.default);
app.use("/comments", commentRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
app.use(errorHandler_1.default);
