import express from "express";
import cookieParser from "cookie-parser";

// import swaggerUi from "swagger-ui-express"; // for serving swagger documentation
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const swaggerFile = require('../swagger_output.json');// swagger documentation file

// import configurations and service connections
import { connectMongoDB } from "../config/mongodb.js"; // connects to MongoDB
import { startServer } from "../config/api-rest.js"; // starts the Express server

// import middlewares
import { createLoggingMiddleware } from "./adapters/web/middlewares/loggingMiddleware.js"; // logging middleware

// import routers
import { apiRouter } from "./adapters/routers/apiRouter.js"; // main api routes
import { healthRouter } from "./adapters/routers/healthRouter.js"; // server health check routes
import { connectSQLite } from "../config/sqlite.js";

import { authRouter } from "./adapters/routers/authRouter.js";
import { corsMiddleware } from "./adapters/web/middlewares/corsMiddleware.js";
import { HTTP_CODES } from "./utils/http_error_codes.js";
import { validationMiddleware } from "./adapters/web/middlewares/validationMiddleware.js";
import { systemValidationMiddleware } from "./adapters/web/middlewares/systemValidationMiddleware.js";
import { firstRunSetup } from "../config/firstRunSetup.js";
import { apiInternalRouter } from "./adapters/routers/apiInternalRouter.js";

export const app = express();
const loggingMiddleware = createLoggingMiddleware();

app.use(corsMiddleware);
app.use(cookieParser());

// parse json request bodies
app.use(express.json());

// trust proxy headers for client ip and protocol
app.set('trust proxy', true);

// enable logging middleware
app.use(loggingMiddleware);

app.use('/api', validationMiddleware, apiRouter);

app.use('/api-internal', systemValidationMiddleware, apiInternalRouter);

app.use('/auth', authRouter);

app.use('/health', healthRouter);

app.use('/{*splat}', (_, res) => res.status(HTTP_CODES._404_NOT_FOUND).json({ error: "Endpoint not found" }));

// connect to sqlite
await connectSQLite();

// connect to mongodb
await connectMongoDB();

// firstRun&Setup
await firstRunSetup();

// start the server
await startServer(app);