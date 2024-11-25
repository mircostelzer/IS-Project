const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('', async function(req, res) {
    
    try {
        var user = User.findOne({
            email: req.body.email
        }).exec();
    
        if (!user) {
            return res.status(404).json({ success: false, message: "Authentication failed: user not found" });
        }

        if (req.params.password !== user.password) {
            return res.status(401).json({ success: false, message: "Authentication failed: incorrect password" });
        }

        var payload = {
            email: user.email,
            password: user.password
        }
        var options = {
            expiresIn: 86400
        }
        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        return res.status(201).json({ 
            success: true,
            message: "JWT generated successfully",
            token: token,
            self: 'api/users/' + user._id,
            email: user.email
        });
    } catch(error) {
        res.status(500).json({ message: "Error in token creation"});
    }
} );

module.exports = router;