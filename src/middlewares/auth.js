const jwt = require('jsonwebtoken');
const User = require('../models/users.js')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({erro: 'Por favor autentifique'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({error:'Usuário não encontrado'});s
        }

  
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({erro: 'Token inválido ou expirado'});
    }
} 
module.exports = auth;