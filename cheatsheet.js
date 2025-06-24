// Mongoose Cheatsheet (Express.js Function Style with Comments)

const mongoose = require('mongoose'); // Import mongoose to interact with MongoDB

// Connect to MongoDB
const connectDB = async (req, res) => {
  try {
    // Try connecting to MongoDB with options to avoid deprecation warnings
    await mongoose.connect('mongodb://localhost:27017/dbname', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    res.status(200).json({ message: 'Connected to MongoDB' }); // Respond if successful
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle error
  }
};

// Define a Schema (structure of a document in a MongoDB collection)
const userSchema = new mongoose.Schema({
  name: String, // Name field of type String
  age: Number, // Age field of type Number
  email: { type: String, required: true, unique: true }, // Required and unique email
  createdAt: { type: Date, default: Date.now } // Auto-set the creation date
});

// SCHEMA METHOD - Adds instance method to user objects
userSchema.methods.sayHello = function () {
  return `Hello, my name is ${this.name}`; // Use instance's name to say hello
};

// STATIC METHOD - Adds a class method to the model itself
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }); // Find user by email
};

// VIRTUAL - Adds a computed property (not stored in DB)
userSchema.virtual('info').get(function () {
  return `${this.name} (${this.age})`; // Combine name and age for display
});

// MIDDLEWARE - Runs before saving a document
userSchema.pre('save', function (next) {
  console.log('User is about to be saved');
  next(); // Continue with save
});

// Create a Model from the schema (like a class to create users)
const User = mongoose.model('User', userSchema);

// CREATE - Add a new user to the database
const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body); // Create a new User instance with data from request
    const savedUser = await newUser.save(); // Save to MongoDB
    res.status(201).json(savedUser); // Respond with saved user
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle error
  }
};

// READ - Get all users from the database
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.status(200).json(users); // Send back the users
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get one user by name (parameter from URL)
const getUserByName = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }); // Find user by name
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get a user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find user by MongoDB ID
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - Update a user by name
const updateUser = async (req, res) => {
  try {
    const result = await User.updateOne({ name: req.params.name }, { $set: req.body });
    res.status(200).json(result); // Return update result
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - Update a user by ID
const updateUserById = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated); // Return updated user
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE - Delete user by name
const deleteUser = async (req, res) => {
  try {
    const result = await User.deleteOne({ name: req.params.name }); // Delete user
    res.status(200).json(result); // Return result
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE - Delete user by ID
const deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id); // Delete user by ID
    res.status(200).json(deleted); // Return deleted user
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POPULATE - Example of related Post model with reference to User
const postSchema = new mongoose.Schema({
  title: String, // Title of the post
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to user
});
const Post = mongoose.model('Post', postSchema); // Create Post model

const getPostsWithAuthors = async (req, res) => {
  try {
    const posts = await Post.find().populate('author'); // Populate user info in post
    res.status(200).json(posts); // Return posts with author details
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// AGGREGATION - Group users by age and count them
const groupByAge = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { age: { $gte: 18 } } }, // Only include users 18 or older
      { $group: { _id: '$age', total: { $sum: 1 } } } // Group by age and count
    ]);
    res.status(200).json(result); // Return grouped data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// COUNT - Count how many users are adults
const countAdults = async (req, res) => {
  try {
    const count = await User.countDocuments({ age: { $gt: 18 } }); // Count users older than 18
    res.status(200).json({ total: count }); // Return count
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DISTINCT - Get all unique ages in the database
const getUniqueAges = async (req, res) => {
  try {
    const ages = await User.distinct('age'); // Get unique age values
    res.status(200).json(ages); // Return the list
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TRANSACTION - Do multiple actions as one atomic operation
const runTransaction = async (req, res) => {
  const session = await mongoose.startSession(); // Start a DB session
  session.startTransaction(); // Start a transaction block
  try {
    await User.create([{ name: 'Alice', email: 'alice@example.com' }], { session }); // Create user in transaction
    await session.commitTransaction(); // Commit if all is okay
    res.status(200).json({ message: 'Transaction committed' });
  } catch (err) {
    await session.abortTransaction(); // Rollback if something fails
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession(); // Always end session
  }
};

// DISCONNECT - Close the MongoDB connection
const disconnectDB = async (req, res) => {
  try {
    await mongoose.disconnect(); // Disconnect from MongoDB
    res.status(200).json({ message: 'Disconnected from MongoDB' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
