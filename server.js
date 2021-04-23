require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const morgan = require("morgan");
// const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const router = require('./routes');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

app.use(mongoSanitize()); // Sanitize request
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent xss attacks
// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minuates
    max: 100, // 100 requests
});
app.use(limiter);
app.use(hpp()); // Prevent http param polution
app.use(cors()); // Enable cors


connectDB();

// routes
// require("./routes/auth.routes")(app);
// require("./routes/user.routes")(app);
app.use(router);
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(errorHandler);

app.use(errorHandler);
app.use(express.static(path.join(__dirname, "public")));

// Catch all route
app.use("*", (req, res) => {
    res.status(404).json({
        error: "Not a valid route",
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server up in ${process.env.NODE_ENV} mode on port ${PORT}.`));