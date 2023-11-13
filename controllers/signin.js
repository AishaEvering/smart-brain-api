const utils = require("../helpers/utils");
const validator = require("validator");

const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email) || validator.isEmpty(password)) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  db.select("email", "hash")
    .where("email", "=", email)
    .from("login")
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            return utils.getSuccessResponse(
              res,
              user[0],
              "Signed In successfully"
            );
          })
          .catch((_) => res.status(400).json("unable to get user"));
      }
      return utils.getFailedResponse(res, "wrong credentials");
    })
    .catch((_) => utils.getFailedResponse(res, "wrong credentials"));
};

module.exports = {
  handleSignIn,
};
