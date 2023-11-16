const { Schema, model } = require('mongoose');
const User = require('./User');
const { forEach } = require('../utils/data');


const thoughtSchema = new Schema({
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: false 
    },
    content: { 
      type: String, 
      required: true 
    },
    reactions: [{
      content: { 
        type: String, 
        required: true 
      },
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
      createdAt: {
        type: Date,
        default: Date.now,
        // use moment to format date on get
        get: (createdAtVal) => dateFormat(createdAtVal),
      },
      // Other fields...

      reacterId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: false 
    },
    }],        
    createdAt: {
      type: Date,
      default: Date.now,
      // use moment to format date on get
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    // Other fields...
  });
  

  const Thought = model('thoughts', thoughtSchema);
  ////////////////// create and delete thought methods //////////////////
//create thought
Thought.createThought = async function(req, res) {
    try {
        const thought = new Thought({
            userId: req.body.userId,
            content: req.body.content
        });
        const savedthought = await thought.save();
        const user = await User.findByIdAndUpdate(req.body.userId, {$push: {thoughts: savedthought._id}});
        res.status(200).json(savedthought);
    } catch (err) {
        res.status(500).json({error: `Error creating user${err}`});
    }
}
//delete thought
Thought.deleteThought = async function(req, res) {
    try {
        const thoughtId = req.body.thoughtId;
        const thought = await Thought.findByIdAndDelete(thoughtId);
        res.status(200).json(thought);
    } catch (err) {
        res.status(500).json({ error: `Error deleting thought${err}` });
    }
}
 ////////////////// create and delete reactions methods //////////////////
//create reaction
Thought.createReaction = async function(req, res) {
    try {
        const thoughtId = req.body.thoughtId;
        const reacterId = req.body.userId;
        const content = req.body.content;
        const thought = await Thought.findByIdAndUpdate(thoughtId, {$push: {reactions: {content: content, reacterId: reacterId}}}, {new: true});
        console.log(thought);
        const user = await User.findByIdAndUpdate(reacterId, {$push: {reactions: thought.reactions[thought.reactions.length - 1]._id}});
    res.status(200).json(user);
    } catch (err) {
        res.status(500).json({error: `Error creating reactions${err}`});
    }
}
//delete reaction
Thought.deleteReaction = async function(req, res) {
    try {
        const thoughtId = req.body.thoughtId;
        const reactionId = req.body.reactionId;

        const thought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $pull: { reactions: { reactionId: reactionId } } },
          { new: true }
        );

        if (!thought) {
            return res.status(404).json({ error: 'thought not found' });
        }

        res.status(200).json({ message: 'reaction deleted' });
    } catch (err) {
        res.status(500).json({ error: `Error deleting reaction: ${err}` });
    }
};



//get all reactions
Thought.getAllReactions = async function(req, res) {
    try {
    const reactions = await Thought.find(
        {reactions: {$exists: true}}
    );
    res.status(200).json(reactions);
    } catch (err) {
    res.status(500).json({ error: `Error getting all reactions${err}` });
    }
}

 ////////////////// find thoughts methods //////////////////
//get all thoughts
Thought.getAllThoughts = async function(req, res) {
    try {
    const thoughts = await Thought.find();
    res.status(200).json(thoughts);
    } catch (err) {
    res.status(500).json({ error: `Error getting all thoughts${err}` });
    }
}
//get thought by id
Thought.getThoughtById = async function(req, res) {
    try {
    const thought = await Thought.findById(req.params.id);
    res.status(200).json(thought);
    } catch (err) {
    res.status(500).json({ error: `Error getting thought${err}` });
    }
}
//get thought by user id
Thought.getThoughtByUserId = async function(req, res) {
    try {
    const thought = await Thought.findById(req.params.id);
    res.status(200).json(thought);
    } catch (err) {
    res.status(500).json({ error: `Error getting thoughts${err}` });
    }
}
//get thoughts by multiple user ids
Thought.getThoughtsByUserIds = async function(req, res) {
    try {
        const thoughts = [] 
    forEach(req.params.id, async function(id) {
        const thought = await Thought.findById(id);
        thoughts.push(thought);
    })
    res.status(200).json(thoughts);
    } catch (err) {
    res.status(500).json({ error: `Error getting thought${err}` });
    }
}

    //create thought model


module.exports = Thought;