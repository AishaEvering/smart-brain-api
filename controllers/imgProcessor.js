const utils = require("../helpers/utils");
const validator = require("validator");
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const fs = require("fs");
const path = require("path");

const handleGetEntries = (db) => (req, res) => {
  const { id } = req.body;

  if (!validator.isInt(id)) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      return utils.getSuccessResponse(
        res,
        entries[0].entries,
        "Retuning entries"
      );
    })
    .catch((_) => {
      return utils.getFailedResponse(res, "unable to get entries");
    });
};

const handleGetModelDataWithLocalImg = (modelId, key) => (req, res) => {
  if (validator.isEmpty(modelId) || validator.isEmpty(key)) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  const parentDir = path.join(__dirname, "../");
  const imageBytes = fs.readFileSync(parentDir + "/public/South-Park.webp");
  const input = { base64: imageBytes };
  return _handleGetModelData(modelId, key, res, input);
};

const handleGetModelDataWithImageUrl = (modelId, key) => (req, res) => {
  const imgUrl = req.body.input;

  if (
    !validator.isURL(imgUrl) ||
    validator.isEmpty(modelId) ||
    validator.isEmpty(key)
  ) {
    return utils.getFailedResponse(res, "invalid parameters");
  }

  return _handleGetModelData(modelId, key, res, { url: imgUrl });
};

const _handleGetModelData = (modelId, key, res, input) => {
  const stub = ClarifaiStub.grpc();

  const metadata = new grpc.Metadata();
  metadata.set("authorization", `Key ${key}`);

  stub.PostModelOutputs(
    {
      model_id: modelId,
      inputs: [{ data: { image: input } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        return utils.getFailedResponse(res, "unable to get data");
      }

      if (response.status.code !== 10000) {
        return utils.getFailedResponse(
          res,
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details
        );
      }

      return utils.getSuccessResponse(res, response, "success");
    }
  );
};

module.exports = {
  handleGetEntries,
  handleGetModelDataWithLocalImg,
  handleGetModelDataWithImageUrl,
};
