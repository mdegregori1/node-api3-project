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

router.get('/:id', (req, res) => {
  const id = req.params.id;
  posts.getById(id) 
  .then( id => {
    if(id){
      res.status(200).json(id)
    } else {
      res.status(404).json({message: "Invalid User Id"})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: "Error retrieving data"})
  })
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  posts.remove(id)
  .then( id => {
    if(id) {
      res.status(200).json({message: "user was deleted successfully"})
    } else {
      res.status(400).json({message: "Invalid user id"})
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({message: "Error erasing data"})
  })

});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const input = req.body
  if(input.text){
    posts.update(id, input)
    .then(id => {
      if(id) {
        res.status(200).json({...id, input})
      } else {
        res.status(404).json({message: "the post with the specified id does not exist"})
      }
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
  // do your magic!
}

module.exports = router;
