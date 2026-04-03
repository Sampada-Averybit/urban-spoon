const Menu = require('../models/Menu');
const mongoose = require("mongoose");

async function fetchMenuWithFallback() {
  const menuItems = await Menu.find();
  if (Array.isArray(menuItems) && menuItems.length > 0) {
    return menuItems;
  }

  if (!mongoose.connection?.db) {
    return menuItems;
  }

  const legacyCollections = ["menu", "menuItems", "menuitems"];
  for (const collectionName of legacyCollections) {
    const exists = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .hasNext();

    if (exists) {
      const docs = await mongoose.connection.collection(collectionName).find({}).toArray();
      if (Array.isArray(docs) && docs.length > 0) {
        return docs;
      }
    }
  }

  return menuItems;
}

async function fetchMenuByIdWithFallback(id) {
  const item = await Menu.findById(id);
  if (item) {
    return item;
  }

  if (!mongoose.connection?.db) {
    return null;
  }

  const legacyCollections = ["menu", "menuItems", "menuitems"];
  for (const collectionName of legacyCollections) {
    const exists = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .hasNext();

    if (!exists) {
      continue;
    }

    const doc = await mongoose.connection
      .collection(collectionName)
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (doc) {
      return doc;
    }
  }

  return null;
}

// 1. getAllMenu: Fetch all menu items
const getAllMenu = async (req, res) => {
  try {
    const menuItems = await fetchMenuWithFallback();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. getMenuById: Fetch item using req.params.id
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item id" });
    }

    const menuItem = await fetchMenuByIdWithFallback(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. createMenu: Create new menu item using req.body
const createMenu = async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. updateMenu: Update item by id using req.params.id
const updateMenu = async (req, res) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMenu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. deleteMenu: Delete item by id
const deleteMenu = async (req, res) => {
  try {
    const deletedMenu = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedMenu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
};
