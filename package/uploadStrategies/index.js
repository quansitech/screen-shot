const ossUploader = require('./ossUploader');
const tosUploader = require('./tosUploader');

const uploadStrategies = {
    oss: ossUploader,
    tos: tosUploader,
};

module.exports = uploadStrategies;