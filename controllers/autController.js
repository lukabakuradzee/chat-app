const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require("../models/User");

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/",
});

exports.authSuccess = (req, res) => {
  res.redirect("/profile");
};

exports.authLogout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};

exports.getProfile = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(
    `<h1>Profile Page</h1><pre>${JSON.stringify(
      req.user,
      null,
      2
    )}</pre><a href="/logout">Logout</a>`
  );
};

exports.verifyGoogleToken = async (req, res) => {
    const { token } = req.body;
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const { sub, email, name, picture } = payload;
  
      // First, try to find a user by googleId
      let user = await User.findOne({ googleId: sub });
  
      if (!user) {
        // If no user with this googleId, try to find by email
        user = await User.findOne({ email });
  
        if (user) {
          // If a user exists with this email, update their record to include googleId
          user.googleId = sub;
          await user.save();
        } else {
          // If no user exists with this email, create a new user
          user = new User({
            googleId: sub,
            email,
            name,
            avatar: picture,
            password: '', 
            verificationToken: '', 
            username: email.split('@')[0], 
            lastName: '', 
            age: 0, 
          });
          await user.save();
        }
      }
  
      req.login(user, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Login failed' });
        return res.status(200).json({ success: true, user });
      });
  
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };
  
