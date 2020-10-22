const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//Load User Model
const User = require("../../models/User");

// get
router.get("/test", (req, res) => res.json({ msg: "Users work" }));

// post Creating account
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json("Email aready exists");
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: 200, //size
        r: "pg", //raiting
        d: "mm", //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// post login
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    //Check for user
    if (!user) {
      return res.status(404).json({ email: "email not match" });
    }
    //User Matched

    //Check Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //Password Matched
        // Payload for jwt sign
        const payload = { user: user.id, name: user.name, avatar: user.avatar };

        // Sign Token
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 },(err,token)=>{
            res.json({
                succes:true,
                token:'Bearer ' + token
            })
        });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
