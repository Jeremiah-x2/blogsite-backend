import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import userRoutes from "../routes/usersRoutes";
import blogRoutes from "../routes/blogRoutes";
import commentRoutes from "../routes/commentRoutes";
import mongoose, { mongo, Mongoose } from "mongoose";
import cookieParser = require("cookie-parser");
import errorHandler from "../middlewares/errorHandler";
import passport = require("passport");
import session from "express-session";
import MongoStore = require("connect-mongo");
// import { session } from "passport";
import "../strategies/githubStrategy";

dotenv.config();

const app: Application = express();

mongoose.connect(process.env.MONGODB_URI!);
const port = process.env.PORT || 8000;

const db = mongoose.connection;
db.on("connected", () => console.log("Connected to DataBase successfully"));

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "jeremiah",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000 * 60 },
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", process.env.ACCESS_ORIGIN);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get(
  "/user/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/user/gitoauth/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
    return;
  }
);

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments", commentRoutes);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

app.use(errorHandler);
