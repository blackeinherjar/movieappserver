const express = require('express');
const app = express();
const axios = require('axios');
const Character = require('./Character');
//const path = require('path'); //---heroku---
const cors = require('cors');
const apikey = '385e80';

const port = process.env.PORT || 2000;

app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//http://localhost:2000/storeCharacter?name=Jon Snow
app.get('/addCharacter', (req, res) => {
  const name = req.query.name;
  const querystr = `https://www.anapioficeandfire.com/api/characters?name=${name}`;

  axios
    .get(querystr)
    .then(response => {
      const character = new Character({
        name: response.data[0].name,
        gender: response.data[0].gender,
        culture: response.data[0].culture,
        born: response.data[0].born,
        title: response.data[0].title,
        aliases: response.data[0].aliases,
        father: response.data[0].father,
        mother: response.data[0].mother,
        spouse: response.data[0].spouse
      });

      // console.log(response.data[0].name);
      if (!character.name) {
        res.status(200).json('Not found');
        return;
      }
      character
        .save()
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(400).json(error);
        });
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

//localhost:2000/getallcharacters
app.get('/getallcharacters', (req, res) => {
  Character.find({})
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//localhost:2000/deletecharacter?name=charactername
app.get('/deletecharacter', (req, res) => {
  Character.deleteMany({ name: req.query.name })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
