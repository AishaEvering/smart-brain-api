const config = require("config");

const getFailedResponse = (res, data = {}, msg = "", code = 400) => {
  return res.status(code).json({
    success: false,
    message: msg,
    data: data,
  });
};

const getSuccessResponse = (res, data = {}, msg = "", code = 200) => {
  return res.status(code).json({
    success: true,
    message: msg,
    data,
  });
};

const userTableName = config.get("user_table");

const loginTableName = config.get("login_table");

module.exports = {
  getFailedResponse,
  getSuccessResponse,
  userTableName,
  loginTableName,
};
