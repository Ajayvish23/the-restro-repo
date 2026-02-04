import MenuItem from "../models/MenuItem.js";


const getMenu= async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export default getMenu;