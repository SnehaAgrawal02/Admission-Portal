const jwt = require('jsonwebtoken')

const authRole = (roles) => {
    return (req, res, next) => {
        console.log(req.userData.role);
        if (!roles.includes(req.userData.role)) {
            req.flash('error', 'Unauthorised user please login');
            return res.redirect('/');
        }
        next();
    };
};

module.exports = authRole