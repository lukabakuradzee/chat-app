const twoFactor = require("node-2fa");
const QRCode = require('qrcode')

exports.generate2FASecret = async (req, res) => {
    const {email} = req.body;

    if(!email) {
        return res.status(400).json({message: "Email is required"})
    }

    const newSecret = twoFactor.generateSecret({name: "SocialApp", account: email})
    try {
        const qrCodeUrl = await QRCode.toDataURL(newSecret.uri);
        
        res.json({secret: newSecret.secret, qrCode: qrCodeUrl})

        console.log("Secret QR: ", qrCodeUrl )
    } catch (error) {
        console.error("Error generating qr code", error)
        res.status(500).json({ message: "Error generating QR code" });
    }
};

exports.verify2FAToken = async (req, res) => {
    const {token, secret} = req.body;
    
    if(!token || !secret) {
        return res.status(400).json({message: "Token and secret are required"})
    }

    const result = twoFactor.verifyToken(token, secret)

    if(result & result.delta === 0) {
        res.json({message: '2FA token is invalid'})
    } else {
        res.status(400).json({message: "Invalid 2FA token"})
    }
}
