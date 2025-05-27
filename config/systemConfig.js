export class SystemConfig {
    static instance = null; // Variable estática para almacenar la instancia única

    constructor() {
        if (!SystemConfig.instance) {
            SystemConfig.instance = this;

            this._SAVE_LOGS = process.env.SAVE_LOGS === "1" ? true : false;
        }
        return SystemConfig.instance; // Aseguramos que siempre se retorne la misma instancia
    }

    get data() {
        return {
            SAVE_LOGS: this._SAVE_LOGS,
        };
    }
}
