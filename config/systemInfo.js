export class SystemInfo {
    static instance = null; // Variable estática para almacenar la instancia única

    constructor() {
        if (!SystemInfo.instance) {
            SystemInfo.instance = this;

            this._API_STATUS = false;
            this._DB_STATUS = false;
            this._LOG_DB_STATUS = false;
        }
        return SystemInfo.instance; // Aseguramos que siempre se retorne la misma instancia
    }

    get data() { // Los getters no necesitan "get" en el nombre
        return {
            API_STATUS: this._API_STATUS,
            DB_STATUS: this._DB_STATUS,
            LOG_DB_STATUS: this._LOG_DB_STATUS,
        };
    }

    setApiStatus(status) {
        this._API_STATUS = status;
    }

    setDbStatus(status) {
        this._DB_STATUS = status;
    }

    setLogDbStatus(status) {
        this._LOG_DB_STATUS = status;
    }
}
