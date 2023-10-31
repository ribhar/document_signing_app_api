const bcrypt = require('bcrypt');
const passport = require('../configs/passport')
const {userModel} = require('../models/')


const register = async (req, res) => {
    try {
        const { password, ...payload } = req.body;
        const CheckUser = await userModel.findOne({ email: payload.email });

        const hash = await bcrypt.hash(password, 5);
        const user = new userModel({
          ...payload,
          password: hash,
        });
  
        await user.save();
        user.getAuthorizationToken();
        return res.status(200).json({
          status: 200,
          message: 'User registered successfully.',
          credentials: user,
          token: user.token,
        });
        // return res.status(201).json({
        //   status: 200,
        //   message: "User registered successfully.",
        //   credentials: user,
        // });
      } catch (error) {

        return res.status(500).json({ message: "Registration failed" });
      }
};

const login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      user.getAuthorizationToken();
      return res.status(200).json({
        status: 200,
        message: 'Login Success',
        credentials: user,
        token: user.token,
      });
    });
  })(req, res, next);
};


module.exports = {
  register,
  login,
};
