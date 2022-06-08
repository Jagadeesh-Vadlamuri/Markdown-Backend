const router = require('express').Router();
const {check, validationResult} =  require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const {users} = require('../database/database');
require('dotenv').config();

// Signup
router.post(
    '/signup',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password must be atleast 6 characters long').isLength({
            min: 6,
        }),
    ],
    async(req, res) => {
        const {email, password} = req.body;

        // Validate Userinput
        const errors = await validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        let user = await users.find((item) => {
            return item.email===email
        })

        if(user){
            return res.status(200).json({
                errors: [
                    {
                        email: user.email,
                        msg: 'User already exists'
                    }
                ]
            })
        }

        const salt = await bcrypt.genSalt(10);
        console.log('salt:', salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('hashedPassword:', hashedPassword);

        users.push({
            email,
            password: hashedPassword,
        });

        const accessToken = await JWT.sign(
            { email },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '3600s',
            }
        );

        res.json({
            accessToken,
        })
    }
)

// Get all users
router.get('/users', (req, res) => {
    res.json(users);
})

// Login
router.post('/login', async (req, res) => {
    const {email, password} = await req.body;

    let user = await users.find((user) => {
        return user.email === email
    });

    if(!user){
        return res.status(400).json({
            errors: [
                {
                    msg: 'Invalid Credentials'
                }
            ]
        })
    }

    // Compare hashed password with user password if they're valid
    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(401).json({
            errors: [
                {
                    msg: 'Email Or Password is Invalid'
                }
            ]
        })
    }

    // Send JWt
    const accessToken = JWT.sign(
        { email },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '3600s',
        }
    );

    res.json({
        accessToken
    });
});
let refreshTokens = []

router.post('/token', async(req, res) => {
    var refreshToken = await req.body.refreshToken;

    if(!refreshToken){
        res.status(401).json({
            errors: [
                {
                    msg : 'Token not found'
                }
            ]
        })
    }

    if(!refreshToken.includes(refreshToken)){
        res.status(403).json({
            errors: [
                {
                    msg: 'Invalid refresh token'
                }
            ]
        })
    }

    try{
        const user = JWT.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const {email} = user;
        const accessToken = JWT.sign(
            { email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '3600s' }
        );
        res.json({ accessToken});
    } catch(error){
        res.status(403).json({
            errors: [
                {
                    msg: "Invalid token"
                },
            ],
        })
    }
    refreshTokens.push(refreshToken);

    res.json({
        accessToken,
        refreshToken
    })
})

module.exports = router;
