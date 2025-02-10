import { Router } from 'express';
const router = Router();
import jsonwebtoken from 'jsonwebtoken';
const { sign } = jsonwebtoken;
import User from '../models/user.js';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // If the request specified a Google Workspace domain:
  // const domain = payload['hd'];
  return payload;
}

router.post("", async function (req, res) {
    let user = {};
    try {
        if (req.body.googleToken) {
            const payload = await verify(req.body.googleToken).catch(console.error);

            user = await User.findOne({ email: payload["email"] }).exec();
            if (!user) {
                user = new User({
                    email: payload["email"],
                    password: "default-google-password-to-be-changed",
                });
                await user.save();
            }
        } else {
            user = await User.findOne({
                email: req.body.email,
            }).exec();

            if (!user) {
                return res
                    .status(404).json({ success: false, message: "Authentication failed: user not found" });
            }

            if (req.body.password !== user.password) {
                return res.status(401).json({ success: false, message: "Authentication failed: incorrect password"});
            }
        }

            var payload = {
                email: user.email,
                id: user.id,
                role: user.role
            };
            const options = { expiresIn: 86400 };
            const token = sign(payload, process.env.SUPER_SECRET, options);

            return res.status(201).json({
                success: true,
                message: "JWT generated successfully",
                token: token,
                self: "api/users/" + user._id,
                email: user.email,
                role: user.role,
            });
    } catch (error) {
        res.status(500).json({ message: "Error in token creation" });
    }
});

export default router;