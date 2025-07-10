import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/sqlite.js";

export const ResponseLog = sequelize.define("ResponseLog", {
    requestId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    responseTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    body: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    statusCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    errorCode: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false,
    indexes: [
        { fields: ["requestId"] },
        { fields: ["timestamp"] },
    ],
    tableName: "responseLogs"
});
