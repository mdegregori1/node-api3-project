const express = require('express');

const db = require("./userDb.js")
const posts = require("../posts/postDb.js")

const router = express.Router();


router.post('/', validateUser, (req, res) => {
  const input = req.body;
  db.insert(input)
  .then( user => {
    res.status(201).json({...user, ...input})
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({error: "There was an error adding the user to the database"})
  })

});

router.post('/:id/posts', validatePost,  (req, res) => {
  const id = req.params.id;
  const text = req.body.text;
posts.insert({
  user_id: id, text: text
})
.then( posts => {
 res.status(201).json(posts)
})
.catch(error => {
  console.log(error)
  res.status(500).json({ error: "The post information could not be added" })
})

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

router.get('/:id', validateUserId,  (req, res) => {
  const id = req.params.id
  db.getById(id)
  .then(user => {
    res.status(200).json(user)
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

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
    db.remove(id)
    .then( () => {
        res.status(200).json({message: "The user was successfully deleted."})
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post could not be removed" })
    })

});

router.put('/:id', validateUserId, (req, res) => {
  const id = req.params.id
  const post = req.body
  db.update(id, post)
  .then(user => {
    if (user) {
      res.status(200).json({...user, ...post})
    } else {
      res.status(404).json({message: "The user couldn't be found"})
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({error: "error editing the user"})
  })

});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id
  db.getById(id)
  .then(id => {
    if (id) {
      req.user = id;
    } else {
      res.status(400).json({message: "invalid user id"})
    }
  })
  next();
}

function validateUser(req, res, next) {
  const body = req.body;
  if (!body) {
    res.status(400).json({message: "missing user data"})
  } else if (body.name === "") {
    res.status(400).json({message: "missing required name field"})
  } else {
    next();
  }
 
} 

function validatePost(req, res, next) {
  const body = req.body;
  if(!body) {
    res.status(400).json({message: "Missing post data"})
  } else if (body.text === "") {
    res.status(400).json({message: "Missing required text field"})
  } else {
    next();
  }
}

module.exports = router;

