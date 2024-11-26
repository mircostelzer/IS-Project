const User = require('../models/user');
const pathApiUsers = '/api/users/';

const getUsers = async (req, res) => {
  try {
    let users = await User.find();
    users = users.map(user => {
      return {
        self: pathApiUsers + user._id,
        email: user.email,
        role: user.role
      };
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error in user recovery" });
  }
};

const getUserById = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user = {
      self: pathApiUsers + user._id,
      email: user.email,
      role: user.role
    };
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error in user recovery" });
  }
}

const createUser = async (req, res) => {
  try {
    let user = new User(req.body);
    user = await user.save();
    let userId = user._id;
    res.location(pathApiUsers + userId).status(201).send();
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
