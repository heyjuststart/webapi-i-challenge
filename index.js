// implement your API here
const express = require('express');
const User = require('./data/db');

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.get('/', (req, res) => {
  res.send('Hello World');
});

server.post('/api/users', (req, res) => {
  const user = req.body;

  try {
    if (!user.name || !user.bio) {
      res
        .status(400)
        .send({ errorMessage: 'Please provide name and bio for the user.' });
    }

    User.insert(user).then(created => res.status(201).send(created));
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: 'There was an error while saving the user to the database.'
    });
  }
});

server.get('/api/users', async (_req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res
      .status(500)
      .send({ error: 'The users information could not be retrieved.' });
  }
});

server.get('/api/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).json({
          message: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(() =>
      res
        .status(500)
        .send({ error: 'The user information could not be retrieved.' })
    );
});

server.delete('/api/users/:id', (req, res) => {
  User.remove(req.params.id)
    .then(num => {
      if (num === 0) {
        res
          .status(404)
          .send({ message: 'The user with the specified ID does not exist.' });
      } else {
        res.status(200);
      }
    })
    .catch(() => {
      res.status(500).send({ error: 'The user could not be removed' });
    });
});

server.put('/api/users/:id', (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    return res.status(400).send({ errorMessage: 'Please provide name and bio for the user.' });
  }

  User.update(req.params.id, user).then(updated => {
    if (updated.length === 0) {
      return res.status(404).send({ message: 'The user with the specified ID does not exist.' });
    }

    return res.status(200).send(updated[0]);
  }).catch(() => {
    return res.status(500).send({ error: 'The user information could not be modified' });
  });
});

server.listen(4000, () => console.log('Server started on port 4000'));
