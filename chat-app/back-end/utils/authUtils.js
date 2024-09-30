const User = require("../models/User");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const { generateRandomPassword } = require("./generateRandomPassword");
const sendVerificationEmail = require("../controllers/sendVerificationEmail");

exports.findOrCreateUserByGoogleId = async ({ sub, email, name, picture }) => {
  let user = await User.findOne({ googleId: sub });

  if (!user) {
    user = await User.findOne({ email });
    const verificationToken = uuid.v4();

    if (user) {
      user.googleId = sub;
    } else {
      const [firstName, lastName] = name.split(" ");
      user = new User({
        googleId: sub,
        email,
        name: firstName || "",
        lastName: lastName || "Unknown",
        avatar: picture,
        password: generateRandomPassword(),
        verificationToken,
        username: email.split("@")[0],
      });

      await sendEmailVerification(user.email, verificationToken);
    }
    await user.save();
  }

  return user;
};

exports.generateJwtToken = (user) => {
  return jwt.sign(
    {
      userAvatar: user.avatar,
      userId: user.id,
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      emailVerified: user.emailVerified,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};
