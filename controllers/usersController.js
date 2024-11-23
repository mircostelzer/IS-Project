const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error in user recovery" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error in user recovery" });
  }
}

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    user = await user.save();
    let userId = user._id;
    res.location('/api/users/' + userId).status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error in user creation" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Error in user deletion" });
  }
};

module.exports = { getUsers, getUserById, createUser, deleteUser };
