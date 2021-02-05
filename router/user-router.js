import express from 'express';
import dotenv from 'dotenv';
import User from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config();

const router = express.Router();

router.post('/register', (req, res) => {
    if (!req.body) return res.status(400).send({
        message: 'User data not provided'
    });

    const user = new User(req.body);
    bcrypt.hash(req.body.password, 10).then(hash => {
        user.password = hash;
        console.log(user);
        const saveUser = user.save();
        saveUser.then(result => res.status(200).send(result));
    });
});

router.post('/login', async (req, res) => {
    if (!req.body) return res.status(400).send({
        message: 'User data not provided',
        auth: false,
        token: null
    });

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email: email});

    if (!email || !password) {
        return res.status(401).send({
            message: 'Not all data provided',
            auth: false,
            token: null
        });
    }

    if (!user) {
        return res.status(404).send({
            message: 'User not found',
            auth: false,
            token: null
        });
    }

    const passwordMatch = await passwordCheck(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send({
            message: 'Invalid user password',
            auth: false,
            token: null
        });
    }

    return res.status(200).send({auth: true, token: signToken(email), email: user.email});
});

async function passwordCheck(pwd, pwdDb) {
    const pwdCheck = await bcrypt.compare(pwd, pwdDb);
    return pwdCheck;
}

function signToken(email) {
    return jwt.sign({email: email}, process.env.ACCESS_SECRET_KEY, {expiresIn: 86400});
}

router.get('/me', verifyToken, async (req, res) => {
    const user = await User.findOne({email: req.userEmail}, {password: 0});
    if (!user) {
        return res.status(404).send({
            message: 'User not found',
            auth: false,
            token: null
        });
    }

    res.status(200).send(user);
});

async function verifyToken(req, res, next) {
    const token = req.headers['access-token'];

    if (token === 'null' || !token) {
        return res.status(404).send({
            message: 'No token provided',
            auth: false,
            token: null
        });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(500).send({
                message: 'Token expired',
                auth: false,
                token: null
            }); 
        }

        req.userEmail = decoded.email;
        next();
    });
}

export default router;