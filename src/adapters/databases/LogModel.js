import { DataTypes } from "sequelize";
import { sequelize } from "../../config/sqlite.js";

export const Log = sequelize.define("Log", {
    logLevel: { type: DataTypes.ENUM("info", "warn", "error"), allowNull: false },
    requestId: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("request", "response"), allowNull: false },
    token: { type: DataTypes.STRING, defaultValue: "anonymous" },
    endpoint: { type: DataTypes.STRING, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.JSON, defaultValue: null },
    ip: { type: DataTypes.STRING, allowNull: false },
    statusCode: { type: DataTypes.INTEGER, defaultValue: null },
    message: { type: DataTypes.STRING },
    errorCode: { type: DataTypes.STRING },
}, {
    timestamps: true,
    tableName: "Logs",
});

await Log.sync(); // crea la tabla si no existe