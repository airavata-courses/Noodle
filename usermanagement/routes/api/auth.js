const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route   GET api/auth
// @desc    Test Route
// @access  Public

router.get('/', auth, async (req, res) => {

	return res.status(200).send('Request receieved');
    // Send back user details using token
    //try {
    //    const user = await User.findById(req.user.id).select('-password');
    //    res.json(user);
    //} catch (err){
    //    console.error(err.message);
    //    res.status(500).send('Server error!');
    //}
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public

router.post(
    '/',
    [
        check('email', 'Please include valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
		

        const { email, password } = req.body;
        try {
            // Check if credentials are valid for user
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid credentials!" }] });
            }

            // Match email and password

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid credentials!" }] });
            }
            // Return json web token
            const payload = {
                user: {
                    name: user.name
                }
            };
            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                });

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error!");
        }
    }
);
module.exports = router;