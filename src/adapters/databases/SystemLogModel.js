import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/sqlite.js";

export const SystemLog = sequelize.define("SystemLog", {
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    errorCode: {
        type: DataTypes.JSON, // Para representar un array de strings
        allowNull: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    severityLevel: {
        type: DataTypes.ENUM("info", "warning", "error", "critical", "fatal"),
        allowNull: false,
    },
}, {
    timestamps: false,
    indexes: [
        {
            fields: ["timestamp"]
        }
    ],
    tableName: "systemLogs"
});
