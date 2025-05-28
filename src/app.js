import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express"; // for serving swagger documentation
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerFile = require('../swagger_output.json');// swagger documentation file

// import configurations and service connections
import { connectMongoDB } from "../config/mongodb.js"; // connects to MongoDB
import { startServer } from "../config/api-rest.js"; // starts the Express server
// import { corsOptions } from "../config/cors-config.js"; // cors configuration

// import middlewares
import { createLoggingMiddleware } from "./middlewares/loggingMiddleware.js"; // logging middleware

// import routers
import { apiRouter } from "./adapters/routers/apiRouter.js"; // main api routes
import { healthRouter } from "./adapters/routers/healthRouter.js"; // server health check routes
import { connectSQLite } from "../config/sqlite.js";

// import { errorRouter } from "./adapters/routers/404Router.js"; // handles 404 errors
import { validateAccessToken } from "./middlewares/validationMiddleware.js"; // token validation middleware
import { authRouter } from "./adapters/routers/authRouter.js";
// import { setupTaskScheduler } from "./schedulers/taskScheduler.js"; // scheduled tasks

export const app = express();
const loggingMiddleware = createLoggingMiddleware();

// enable cors with custom options
app.use(cors());
// app.use(cors(corsOptions));

// parse json request bodies
app.use(express.json());

// trust proxy headers for client ip and protocol
app.set('trust proxy', true);

// enable logging middleware
app.use(loggingMiddleware);

// define api routes
// protect api routes with bearer token validation

app.use('/api', validateAccessToken, apiRouter);

app.use('/auth', authRouter)

// serve swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    customSiteTitle: "API del Servicio de Autenticación",
    customCss: '.swagger-ui .topbar { display: none }',
}));

app.use('/health', healthRouter);

// handle all other routes (404)
// app.use('/*', errorRouter);
app.use('/*', (_, res) => res.status(404).json({ error: "Endpoint not found" }));

// connect to mongodb
await connectSQLite();

// connect to mongodb
await connectMongoDB();


// start the server
await startServer(app);

// run scheduled tasks
// setupTaskScheduler();
