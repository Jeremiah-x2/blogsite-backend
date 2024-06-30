"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var usersRoutes_1 = require("../routes/usersRoutes");
var blogRoutes_1 = require("../routes/blogRoutes");
var commentRoutes_1 = require("../routes/commentRoutes");
var mongoose_1 = require("mongoose");
var cookieParser = require("cookie-parser");
var errorHandler_1 = require("../middlewares/errorHandler");
var passport = require("passport");
var express_session_1 = require("express-session");
var MongoStore = require("connect-mongo");
// import { session } from "passport";
require("../strategies/githubStrategy");
dotenv_1.default.config();
var app = (0, express_1.default)();
mongoose_1.default.connect(process.env.MONGODB_URI);
var port = process.env.PORT || 8000;
var db = mongoose_1.default.connection;
db.on("connected", function () { return console.log("Connected to DataBase successfully"); });
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
app.use(function (req, res, next) {
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
app.listen(port, function () {
    console.log("Server is Fire at http://localhost:".concat(port));
});
app.use(errorHandler_1.default);
