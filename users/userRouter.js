const express = require('express');

const db = require("./userDb.js")

const router = express.Router();

router.post('/', (req, res) => {
  const input = req.body;
  if (input.name){
    db.insert(input)
    .then( name => {
      res.status(201).json({...name, ...input })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: "There was an error adding the user to the database"})
    })
  } else {
    res.status(400).json({error: "Please provide a name for the user"})
  }
});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {
  db.get()
  .then( users => {
    res.status(200).json(users)
  })
  .catch( error => {
    console.log(error)
    res.status(500).json({message: "The users could not be provided"})
  })
});

router.get('/:id', (req, res) => {
  const id = req.params.id
  db.getById(id)
  .then(id => {
    if(id) {
      res.status(200).json(id)
    } else {
      res.status(404).json({message: "The id doesn't exist"})
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({error: "The specific user could not be retrived"})
  })
});

router.get('/:id/posts', (req, res) => {
  const id = req.params.id;
  db.getUserPosts(id)
  .then( id => {
    if (id) {
      res.status(200).json(id)
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({ error: "The comments information could not be retrieved." })
})
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
    db.remove(id)
    .then( id => {
        if (id) {
            res.status(200).json({message: "The user was successfully deleted."})
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post could not be removed" })
    })

});

router.put('/:id', (req, res) => {
  const id = req.params.id
  const post = req.body
  if (post.name) {
      db.update(id, post)
      .then ( id => {
          if (id) {
              res.status(200).json({...id, ...post})
          } else {
              res.status(404).json({ message: "The user with the specified ID does not exist." })
          }
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({ error: "The user information could not be modified." })
      })
  } else {
      res.status(400).json({ errorMessage: "Please provide a name for the new user." })
  }
  
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
 
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
