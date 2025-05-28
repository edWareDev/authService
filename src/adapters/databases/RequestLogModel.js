import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/sqlite.js";
import { ResponseLog } from "./ResponseLogModel.js";

export const RequestLog = sequelize.define("RequestLog", {
    requestId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    endpoint: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    method: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    headers: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    queryParams: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    body: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false,
    indexes: [
        { fields: ["requestId"] },
        { fields: ["timestamp"] },
    ],
    tableName: "requestLogs"
});


// Relaciones
RequestLog.hasOne(ResponseLog, {
    foreignKey: 'requestId',
    sourceKey: 'requestId'
});

ResponseLog.belongsTo(RequestLog, {
    foreignKey: 'requestId',
    targetKey: 'requestId'
});