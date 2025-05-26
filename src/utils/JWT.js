import jwt from "jsonwebtoken"
// import { sqlUsersManager } from "../dao/sql.users.manager.js";

const JWT_PRIVATE_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

export async function encriptar({ username, password }) {
    const payload = {
        username,
        password,
    }
    return jwt.sign(payload, JWT_PRIVATE_KEY);
}

export function desencriptar(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
            if (err) {
                reject(err)//return res.status(403).json({
            } else {
                resolve(decoded)
            }
        })
    })
}

export function extraerToken(req, res, next) {
    const authHeader = req.headers['authorization']
    req['accessToken'] = authHeader?.split(' ')[1]
    next()
}


// export async function auth(req, res, next) {

//     if (!req['accessToken']) {
//         return res.status(401).json({
//             error: 'not authenticated'
//         })
//     }

//     try {
//         // const decoded = await desencriptar(req['accessToken'])
//         // const userData = await sqlUsersManager.getUser(decoded.username)

//         // const userPassword = userData.FS_CLA_USUA
//         // const isValid = await bcrypt.compare(userPassword, decoded.password);
//         // req.userData = userData
//         // isValid ? next() : res.status(403).json({ error: 'not authorized' })
//     } catch (error) {
//         console.log(error.message);
//         res.status(403).json({
//             error: 'not authorized'
//         })
//     }
// };