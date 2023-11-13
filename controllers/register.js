const utils = require("../helpers/utils");
const validator = require("validator");

const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;

  if (
    !validator.isEmail(email) ||
    validator.isEmpty(name) ||
    validator.isEmpty(password)
  ) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            return utils.getSuccessResponse(
              res,
              user[0],
              "Registerd successfully"
            );
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((_) => utils.getFailedResponse(res, "unable to register"));
};

module.exports = {
  handleRegister,
};
