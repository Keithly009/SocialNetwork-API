
const router = require('express').Router();
const { Thought, Reaction} = require('../../models')

//TODO: ROUTE TO GET ALL THOUGHTS
router.get('/', (req,res)=> {
    Thought.find({}, (err, thoughts) => { 
        res.status(200).json(thoughts); 
    });
});

//TODO: ROUTE TO CREATE A NEW THOUGHT
router.post('/', (req,res)=> {
    Thought.create({ 
        thoughtText: req.body.thoughtText, 
        username: req.body.username
    },
    (err,thought) => { 
        if(err) { 
            res.status(500).json(err); 
        } else { 
            res.status(200).json(true)
        }
    }
    );
});

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get('/:thoughtId', (req,res)=> {
    Thought.findById(req.params.thoughtId, (err, thought) => { 
        if(err) { 
            res.status(500).json(err);
        } else { 
            res.status(200).json(thought); 
        }
    }).populate('reactions')
})

//TODO: ROUTE TO UPDATE A THOUGHT
router.put('/', (req,res)=> {
    const options = {new: true}
    Thought.findOneAndUpdate(req.body.filter, req.body.update, options, (err, thought) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.status(200).json(thought)
    })
})

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete('/:thoughtId', (req,res)=> {
    Thought.findByIdAndDelete(
        {_id: req.params.thoughtId}, 
        (err,thought)=> {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json('Thought Has been Deleted')
            }
        })
});

//TODO: ROUTE TO ADD REACTION TO A THOUGHT
router.post("/:thoughtId/reactions", (req, res) => {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },
  )

//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete('/:thoughtId/reactions/:reactionId', (req,res)=> {
    Thought.findOneAndDelete(
    {_id: req.params.thoughtId }, 
    {$pull: {reactions: {reactionId: req.params.reactionId}}}
    ).then((result)=> res.status(200).json(result))
    .catch((err)=> res.status(500).json(err));
    });

module.exports = router;
