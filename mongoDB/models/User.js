// Define Mongoose
const { Schema, model } = require('mongoose');
const bcrypt = require("bcryptjs")

// Create a new instance of the Mongoose schema to define shape of each document
const userSchema = new Schema({

  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  email: {  
    type: String, 
    required: true, 
    unique: true 
  },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // blockedAcounts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // Use built in date method to get current date
  lastAccessed: { type: Date, default: Date.now },
  thoughts: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'thoughts' 
  }],
  reactions: [{
    type: Schema.Types.ObjectId, 
    ref: 'thoughts' 
  }]
});
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
}
)

 //create model 
 const User = model('users', userSchema);
//create user method
User.createUser = async function(req, res) {
  try {
    const user = new User({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email
    });
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({error: 'Error creating user' + err});
  }
};

//getallusers method
User.getAllUsers = async function(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: `Error getting all users${err}` });
  }
};
//add to following method
User.addToFollowing = async function(req, res) {
  try {

    userToFollowId = req.body.userToFollowId;

    const user = await User.findByIdAndUpdate(req.params.id, {$push: {following: req.body.userToFollowId}});
    const userToFollow = await User.findByIdAndUpdate(userToFollowId, {$push: {followers: req.params.id}});

    console.log(userToFollow);
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: `Error adding to following${err}` });
    
  }
;}

//remove from following method
User.removeFromFollowing = async function(req, res) {
  try {
    userToUnfollowId = req.body.userToUnfollowId;
    const user = await User.findByIdAndUpdate(req.params.id, {$pull: {following: userToUnfollowId}});
    const userToUnfollow = await User.findByIdAndUpdate(ruserToUnfollowId, {$pull: {followers: req.params.id}});
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: `Error removing from following${err}` });
  }
}



 // Export model
 module.exports = User;


