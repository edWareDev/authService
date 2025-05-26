import session from 'express-session'
import MongoStore from 'connect-mongo'
import { MONGODB_CNX_STR } from '../config/mongodb.config.js'

export default session({
    store: MongoStore.create({ mongoUrl: MONGODB_CNX_STR }),
    saveUninitialized: false,
    resave: false,
    secret: 'SESSION_SECRET',
    cookie: {
        maxAge: 1 * 60 * 60 * 1000 // 24 horas en milisegundos hora*minutos*segundos*milisegundos
    }
})