export function autenticacion(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/')
    }
}

export function isAutenticated(req, res, next) {
    if (req.session.user) {
        res.redirect('/registro')
    } else {
        next()
    }
}