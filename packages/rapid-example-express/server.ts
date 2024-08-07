import process from "process";
import express from "express";
import DatabaseAccessor from "./database-accessor";
import {
  RapidServer,
  createJwt,
  decodeJwt,
  verifyJwt,
  generateJwtSecretKey,
  MetaManagePlugin,
  DataManagePlugin,
  RouteManagePlugin,
  WebhooksPlugin,
  AuthPlugin,
  FileManagePlugin,
  EntityAccessControlPlugin,
} from "@ruiapp/rapid-core";
import { createRapidRequestHandler } from "@ruiapp/rapid-express";

import "dotenv/config";
import { Logger } from "winston";

export async function startServer(logger: Logger) {
  const app = express();

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable("x-powered-by");

  app.use(express.static("public"));

  const envFromFile: any = {};
  const envFromProcess = process.env;
  const env = {
    get: (name: string, defaultValue = "") => {
      return envFromFile[name] || envFromProcess[name] || defaultValue;
    },
  };

  const defaultJWTKey =
    "DyYR1em73ZR5s3rUV32ek3FCZBMxE0YMjuPCvpyQKn+MhCQwlwCiN+8ghgTYcoijtLhKX4G93DPxsJOIuf/ub5qRi0lx5AnHEYGQ8c2zpxJ873viF7marKQ7k5dtBU83f0Oki3aeugSeAfYbOzeK49+LopkgjDeQikgLMyC4JFo=";

  const rapidConfig = {
    dbHost: env.get("DATABASE_HOST", "127.0.0.1"),
    dbPort: parseInt(env.get("DATABASE_PORT"), 10) || 5432,
    dbName: env.get("DATABASE_NAME", "rapid"),
    dbUser: env.get("DATABASE_USERNAME", "postgres"),
    dbPassword: env.get("DATABASE_PASSWORD", "postgres"),
    dbDefaultSchema: env.get("DATABASE_DEFAULT_SCHEMA") || "public",
    dbPoolMaxConnections: parseInt(env.get("DATABASE_POOL_MAX_CONNECTIONS"), 10) || 20,
    sessionCookieName: env.get("SESSION_COOKIE_NAME", "RAPID_SESSION"),
    jwtKey: env.get("JWT_KEY", defaultJWTKey),
    localFileStoragePath: env.get("LOCAL_FILE_STORAGE_PATH", "/data/rapid-data/local-storage"),
  };
  logger.info("Starting server...", { rapidConfig });

  const databaseAccessor = new DatabaseAccessor({
    host: rapidConfig.dbHost,
    port: rapidConfig.dbPort,
    database: rapidConfig.dbName,
    user: rapidConfig.dbUser,
    password: rapidConfig.dbPassword,
    maxConnections: rapidConfig.dbPoolMaxConnections,
  });

  const rapidServer = new RapidServer({
    logger,
    databaseAccessor,
    databaseConfig: {
      dbHost: rapidConfig.dbHost,
      dbPort: rapidConfig.dbPort,
      dbName: rapidConfig.dbName,
      dbUser: rapidConfig.dbUser,
      dbPassword: rapidConfig.dbPassword,
      dbDefaultSchema: rapidConfig.dbDefaultSchema,
    },
    serverConfig: {
      sessionCookieName: rapidConfig.sessionCookieName,
      jwtKey: rapidConfig.jwtKey,
      localFileStoragePath: rapidConfig.localFileStoragePath,
    },
    plugins: [
      new MetaManagePlugin(),
      new DataManagePlugin(),
      new RouteManagePlugin(),
      new WebhooksPlugin(),
      new AuthPlugin(),
      new FileManagePlugin(),
      new EntityAccessControlPlugin(),
    ],
  });
  await rapidServer.start();

  const rapidRequestHandler = createRapidRequestHandler(rapidServer);
  app.use("/api", (req, res, next) => {
    rapidRequestHandler(req, res, next);
  });

  app.get("/", (req, res) => {
    res.send({
      status: "ok",
    });
  });

  app.get("/jwt", async (req, res) => {
    const secretKey = Buffer.from(defaultJWTKey, "base64");
    const token = await createJwt(
      {
        iss: "authManager",
        sub: "userAccessToken",
        aud: "10000",
        iat: Math.floor(Date.now() / 1000),
        act: "rapid",
      },
      secretKey,
    );

    const payload = verifyJwt(token, secretKey);

    const jwt = decodeJwt(token);

    res.send({
      token,
      jwt,
      payload,
    });
  });

  app.get("/gen-key", async (req, res) => {
    res.send({
      secretKey: await generateJwtSecretKey(),
    });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info("Express server listening on port %d", port);
  });
}
