const Menu = require("../models/Menu");

async function findMenuItemsByIds(ids = []) {
  if (!ids.length) return [];
  return Menu.find({ _id: { $in: ids } }).select("_id name price available").lean();
}

module.exports = {
  findMenuItemsByIds,
};
