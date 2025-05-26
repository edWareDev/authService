// import cron from 'node-cron';
import { VIDEO_TIME_AUTH } from '../../config/subscriber-player-config.js';
import { endInactiveSessions } from '../usecases/subscriberSessions/CloseMassiveSubscribersSessions.js';

const TIME_TO_VALIDATE = .75 * VIDEO_TIME_AUTH; // tiempo en segundos

export async function setupTaskScheduler() {
    // Programar la tarea a las 00:00 del día
    await endInactiveSessions();

    // Ejecutar la tarea cada .75 veces el tiempo de auth
    setInterval(async () => {
        await endInactiveSessions();
    }, TIME_TO_VALIDATE * 1000); // 20000 milisegundos = 20 segundos
}