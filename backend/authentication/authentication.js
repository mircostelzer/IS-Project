import { Router } from 'express';
const router = Router();
import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;
import User from '../models/user.js';

router.post('', async function(req, res) {
    try {
        var user = await User.findOne({
            email: req.body.email
        }).exec();
    
        if (!user) {
            return res.status(404).json({ success: false, message: "Authentication failed: user not found" });
        }

        if (req.body.password !== user.password) {
            return res.status(401).json({ success: false, message: "Authentication failed: incorrect password" });
        }

        var payload = {
            email: user.email,
            id: user.id,
            role: user.role
        }
        var options = {
            expiresIn: 86400
        }
        var token = sign(payload, process.env.SUPER_SECRET, options);

        return res.status(201).json({ 
            success: true,
            message: "JWT generated successfully",
            token: token,
            self: 'api/users/' + user._id,
            email: user.email,
            role: user.role
        });
    } catch(error) {
        res.status(500).json({ message: "Error in token creation"});
    }
} );

export default router;