const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password,} = req.body;
  if (!email)
    return res.json({ status: "error", error: "Please Enter your Email" });
  else if (!password)
    return res.json({ status: "error", error: "Please Enter your Password" });
  else {
    db.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      async (err, result) => {

        console.log("id:", result[0].id)
        console.log("pending:", result[0].pending)

        if (err) throw err;
        if (
          !result.length ||
          !(await bcrypt.compare(password, result[0].password))
        ) {
          return res.json({
            status: "error",
            error: "Incorrect Email or Password",
          });
        } else if (result[0].pending === 0) {
          return res.json({
            status: "error",
            error: "Your account is still pending",
          });
        } else {
          const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES,
          });
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("userRegistered", token, cookieOptions);
          return res.json({
            status: "success",
            success: "User has been logged in",
          });
        }
      }
    );
  }
};
module.exports = login;