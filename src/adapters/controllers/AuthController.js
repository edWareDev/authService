import { VIDEO_TIME_AUTH } from "../../../config/subscriber-player-config.js";
import { createDevice } from "../../usecases/devices/CreateDevice.js";
import { getDeviceByToken } from "../../usecases/devices/GetDeviceByToken.js";
import { getDevicesBySubscriberId } from "../../usecases/devices/GetDevicesBySubscriberId.js";
import { getPeerById } from "../../usecases/peers/GetPeerById.js";
import { getSubscriberById } from "../../usecases/subscribers/GetSubscriberById.js";
import { validateSubscriberLogin } from "../../usecases/subscribers/ValidateSubscriber.js";
import { createSubscriberSession } from "../../usecases/subscriberSessions/CreateSubscriberSession.js";
import { getSubscriberSessionById } from "../../usecases/subscriberSessions/GetSubscriberSessionById.js";
import { updateSubscriberSession } from "../../usecases/subscriberSessions/UpdateSubscriberSession.js";
import { CustomError } from "../../utils/CustomError.js";
import { fetchResponse } from "../../utils/fetchResponse.js";
import { getDeviceDataFromUserAgent } from "../../utils/getDeviceIdentifier.js";
import { isPrivateIP } from "../../utils/isPrivateIP.js";
import { objectToPlaylist } from "../../utils/objectToPlaylist.js";

const TIME_TO_AUTH = VIDEO_TIME_AUTH; // tiempo en segundos

export async function controllerGetPlaylist(req, res) {
    try {
        // Destructurar los parámetros de la solicitud y aplicar trim()
        const {
            subscriberIdentifier: rawIdentifier,
            subscriberPassword: rawPassword,
            responseFormat: rawFormat,
            videoFormat: rawVideoFormat
        } = req.params;

        const HOST = `${req.protocol}://${req.get('host')}`;

        const subscirberIdentifier = String(rawIdentifier).trim();
        const subscriberPassword = String(rawPassword).trim();
        const responseFormat = String(rawFormat).trim();
        const videoFormat = String(rawVideoFormat).trim();

        // Validar credenciales
        if (!subscirberIdentifier || !subscriberPassword) {
            throw new CustomError('Error al obtener la lista de reproducción.', 400, 'Credenciales Incorrectas.');
        }

        // Validar el login del suscriptor
        const subscriber = await validateSubscriberLogin(subscirberIdentifier, subscriberPassword);
        if (!subscriber || subscriber.error) {
            throw new CustomError('Error al obtener la lista de reproducción.', 400, 'Credenciales incorrectas.');
        }

        // Obtener información del dispositivo
        const userAgent = req.get('User-Agent');
        const deviceData = getDeviceDataFromUserAgent(userAgent);
        const subscriberDevices = await getDevicesBySubscriberId(subscriber.id);

        // Buscar el dispositivo en la lista de dispositivos del usuario
        let deviceInfo = subscriberDevices.find(device => device.deviceName === deviceData.deviceName);

        // Si el dispositivo no existe, verificar si se puede crear uno nuevo
        if (!deviceInfo) {
            if (subscriberDevices.length < subscriber.subscriberMaxSessions) {
                // Crear nuevo dispositivo y obtener el dispositivo creado con su token
                deviceInfo = await createDevice({
                    subscriber: subscriber.id,
                    name: deviceData.deviceName,
                    info: JSON.stringify(deviceData.deviceData),
                    userAgent: userAgent
                });

                // Verificar que el dispositivo se haya creado correctamente
                if (!deviceInfo || deviceInfo.error) {
                    throw new CustomError('Error al crear nuevo dispositivo.', 500, 'Error interno del servidor');
                }

            } else {
                throw new CustomError('Se ha superado el límite de dispositivos.', 400, 'Límite de dispositivos alcanzado');
            }
        }

        const cdnInfo = await getPeerById(subscriber.subscriberPeer)
        if (!cdnInfo || cdnInfo.error) throw new CustomError('Error al generar la lista', 400, "El peer no existe o no está activo");

        const cleanIp = (req.ip).replace('::ffff:', '');
        console.log("🚀 ~ controllerGetPlaylist ~ cleanIp:", cleanIp)
        const serverUrl = isPrivateIP(cleanIp) ? cdnInfo.peerOutputLocalUrl : cdnInfo.peerOutputPublicUrl || cdnInfo.peerOutputLocalUrl;
        console.log("🚀 ~ controllerGetPlaylist ~ serverUrl:", serverUrl)

        const subscriberInfo = await getSubscriberById(subscriber.id);
        const subscriberPackages = subscriberInfo?.subscriberPlan?.planPackages;
        const allStreams = [];

        if (subscriberPackages && Array.isArray(subscriberPackages)) {
            for (const subscriberPackage of subscriberPackages) {
                const streamsOfPackage = subscriberPackage?.packageStreams;

                if (streamsOfPackage && Array.isArray(streamsOfPackage)) {
                    Array.prototype.push.apply(allStreams, streamsOfPackage);
                }
            }
        }

        // Eliminar duplicados basados en alguna propiedad única
        const streamMap = new Map();
        for (const stream of allStreams) {
            // Asumiendo que cada stream tiene un id único
            if (stream && stream._id) {
                streamMap.set(stream._id, stream);
            }
        }
        const allSubscriberStreams = Array.from(streamMap.values());

        const outputFile = await objectToPlaylist(serverUrl, deviceInfo, HOST, allSubscriberStreams, responseFormat, videoFormat)
        if (!outputFile || outputFile.error) throw new CustomError('Formato de respuesta no soportado.', 400, outputFile.error);
        if (responseFormat === 'json') {
            res.setHeader('Content-Type', 'application/json').json(outputFile);
        } else if (responseFormat === 'm3u8') {
            res.setHeader('Content-Type', 'application/x-mpegurl').send(outputFile);
        } else {
            throw new CustomError('Formato de respuesta no soportado.', 400, 'Formato inválido');
        }
    } catch (error) {
        if (error instanceof CustomError) {
            const { message, httpErrorCode, errorCode } = error.toJSON();
            return fetchResponse(res, {
                statusCode: httpErrorCode,
                message,
                errorCode
            });
        }

        return fetchResponse(res, {
            statusCode: 500,
            message: "Un error inesperado ha ocurrido",
            errorCode: "ERR_UNEXPECTED"
        });
    }
}

export async function controllerValidateToken(req, res) {
    try {
        const sessionInfo = req.query;
        console.log("🚀 ~ controllerValidateToken ~ sessionInfo:", sessionInfo)
        if (!sessionInfo) throw new Error('Sin información de sesión');
        if (!sessionInfo?.token) throw new Error('Token inválido');


        const requestType = sessionInfo.request_type
        if (requestType === 'new_session') {
            const deviceInfo = await getDeviceByToken(sessionInfo.token)
            // console.log("🚀 ~ controllerValidateToken ~ deviceInfo:", deviceInfo)

            if (deviceInfo.error || !deviceInfo) throw new Error('Dispositivo no permitido');

            const initialUserAgent = String(sessionInfo.user_agent).split(', your')
            // console.log("🚀 ~ controllerValidateToken ~ initialUserAgent:", initialUserAgent)
            const receivedDeviceData = getDeviceDataFromUserAgent(initialUserAgent[0]);
            // console.log("🚀 ~ controllerValidateToken ~ tokenDeviceData:", receivedDeviceData)

            // COMPARAR DATOS RECIBIDOS POR EL USERAGENT CON LOS DATOS DEL DISPOSITIVO
            const deviceParsed = JSON.parse(deviceInfo.deviceInfo)
            if (deviceParsed.brand === receivedDeviceData.deviceData.brand && deviceParsed.model === receivedDeviceData.deviceData.model && deviceParsed.osName === receivedDeviceData.deviceData.osName && deviceParsed.deviceType === receivedDeviceData.deviceData.deviceType && deviceParsed.browserName === receivedDeviceData.deviceData.browserName) {
                const subscriberId = String(deviceInfo.subscriber)
                // console.log("🚀 ~ controllerValidateToken ~ USERID:", subscriberId)

                await createSubscriberSession(sessionInfo, deviceInfo.subscriber, deviceInfo._id)

                res.setHeader('X-AuthDuration', String(TIME_TO_AUTH));
                res.setHeader('X-UserId', subscriberId);
                res.status(200).json({ message: 'Token is ok' });
            } else {
                throw new Error('Sesión Rechazado al no hacer match de caracteristicas')
            }

        } else if (requestType === 'update_session') {
            const deviceInfo = await getDeviceByToken(sessionInfo.token)
            // console.log("🚀 ~ controllerValidateToken ~ deviceInfo:", deviceInfo)
            const subscriberId = String(deviceInfo.subscriber)
            // console.log("🚀 ~ controllerValidateToken ~ USERID:", subscriberId)
            if (!deviceInfo) throw new Error('Sin ínformación del dispositivo');

            const sessionId = sessionInfo.session_id;
            if (!deviceInfo) throw new Error('Sin id de sesión');

            const subscriberSession = await getSubscriberSessionById(sessionId)
            if (subscriberSession.error) {
                await createSubscriberSession(sessionInfo, deviceInfo.subscriber, deviceInfo._id)
            } else {
                const updateResult = await updateSubscriberSession(sessionInfo, sessionId)
                if (updateResult.error) throw new Error(updateResult.error);
            }

            res.setHeader('X-AuthDuration', TIME_TO_AUTH);
            res.setHeader('X-UserId', subscriberId);
            res.status(200).json({ message: 'Token is ok' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Reproducción no permitida' })
    }

}