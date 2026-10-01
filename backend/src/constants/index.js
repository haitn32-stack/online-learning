const ROLES = require('./roles');
const status = require('./status');

module.exports = {
  ROLES,
  ...status
};
