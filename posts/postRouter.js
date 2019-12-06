const express = require('express');

const db = require("../users/userDb.js")
const posts = require("./postDb.js")

const router = express.Router();

router.get('/', (req, res) => {
  posts.get()
  .then(post => {
    res.status(200).json(post)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: "failed to get a list of posts"})
  })
});


router.get('/:id', validatePostId, (req, res) => {
  posts.getById(req.params.id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(error => {
    res.status(500).json({message: "error retrieving posts"})
  })
});


router.delete('/:id', validatePostId, (req, res) => {
  const id = req.params.id;
    posts.remove(id)
    .then( e => {
        res.status(200).json({message: "The post was successfully deleted."})
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post could not be removed" })
    })

});

router.put('/:id', validatePostId, (req, res) => {
  const id = req.params.id;
  const input = req.body
  if(input.text){
    posts.update(id, input)
    .then( edit=> {
      res.status(200).json({...edit, ...input})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: "the post information could not be modified"})
    })
  } else {
    re.status(400).json({message: "Please provide content"})
  }
});

// custom middleware

function validatePostId(req, res, next) {
  posts.getById(req.params.id)
  .then(id => {
    if (id) {
      req.posts= id;
      next();
    } else {
      res.status(400).json({message: "Invalid User ID"})
    }
  })
}

module.exports = router;
