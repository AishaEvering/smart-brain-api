const utils = require("../helpers/utils");
const validator = require("validator");

const handleProfileGet = (db) => async (req, res) => {
  const { id } = req.params;

  if (!validator.isInt(id)) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  db.select("*")
    .from(utils.userTableName)
    .where("id", "=", id)
    .then((user) => {
      if (user.length) {
        return utils.getSuccessResponse(res, user[0], "user found");
      }
      return utils.getFailedResponse(res, "user not found");
    })
    .catch((_) => {
      return utils.getFailedResponse(res, "user not found");
    });
};

const handleProfileUpdate = (db) => async (req, res) => {
  const { id, name } = req.body;

  if (!validator.isInt(id) || validator.isEmpty(name)) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  db(utils.userTableName)
    .where("id", "=", id)
    .update({ name: name })
    .returning(["id", "name", "email", "entries", "joined"])
    .then((response) => {
      if (response.length) {
        return utils.getSuccessResponse(res, response[0], "user updated");
      }
      return utils.getFailedResponse(res, "unable to update user");
    })
    .catch((_) => {
      return utils.getFailedResponse(res, "unable to update user");
    });
};

const handleProfileGetByEmail = (db) => (req, res) => {
  const { email } = req.body;
  console.log("calling handleProfileGetByEmail");
  if (!validator.isEmail(email)) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  db.select("*")
    .from(utils.userTableName)
    .where("email", "=", email)
    .then((user) => {
      if (user.length) {
        return utils.getSuccessResponse(res, user[0], "user found");
      }
      return utils.getFailedResponse(res, "user not found");
    })
    .catch((_) => {
      return utils.getFailedResponse(res, "user not found");
    });
};

const handleUpdatePassword = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email) || validator.isEmpty(password)) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  const hash = bcrypt.hashSync(password);

  db(utils.loginTableName)
    .where("email", "=", email)
    .update({
      hash: hash,
    })
    .returning(["email"])
    .then((email) => {
      console.log(email);
      if (email.length) {
        return utils.getSuccessResponse(res, email[0], "updated password");
      }
      return utils.getFailedResponse(res, "uable to updated password");
    })
    .catch((_) => {
      return utils.getFailedResponse(res, "uable to updated password");
    });
};

module.exports = {
  handleProfileGet,
  handleProfileGetByEmail,
  handleUpdatePassword,
  handleProfileUpdate,
};
