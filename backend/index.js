const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");
const server = require("http").createServer(app);
const { logger } = require("./utilities/winston");

require("./utilities/socket-io")(server);

// config ENV
dotenv.config({
  path: "./config/.env",
});

// catch unHandle Rejection
process.on("unhandledRejection", function (reason) {
  logger.error(reason);
});

// catch unHandle Exception
process.on("uncaughtException", function (error) {
  logger.error(error);
});

// connection with database noSql like mongodb atlas free hosting
require("./config/connect-database")(process.env.DATABASE_URI);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    path: "/",
    credentials: true,
    preflightContinue: true,
    methods: ["POST", "GET", "UPDATE", "DELETE", "OPTION"],
    exposedHeaders: [
      "authorization",
      "Set-Cookie",
      "headers",
      "cookies",
      "cookie",
    ],
  })
);

// init EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// static File
app.use(
  express.static(path.join(__dirname, "./", "uploads", "images", "products"))
);

app.use(helmet());

// in development mode
if (process.env.NODE_ENV === "development") {
  // get some info in dev mode
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Hello world this is API for EXPRESS X YOU");
});

app.use("/api", require("./routes/user-routes"));
app.use("/api", require("./routes/products-routes"));
app.use("/api", require("./routes/cart-routes"));
app.use("/api", require("./routes/order-routes"));
app.use("/api", require("./routes/admin-routes"));
app.use("/api", require("./routes/wishlist-routes"));

const PORT = process.env.PORT || 9000; // 9000

// start server with PORT 9000
server.listen(PORT);
