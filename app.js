// heroku : powerful-reef-62967
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

const imageUrl = {
  'Jon Snow':
    'https://drive.google.com/open?id=1ivXHNz92v4-QC18h2FQQZhcWEspcHaLH',
  'Jaime Lannister':
    'https://drive.google.com/open?id=1ArFrOeRZQkX1Wh2AfZ31zRiNyGSMXk_B',
  'Margaery Tyrell':
    'https://drive.google.com/open?id=1mLcnWxMw5phSo2SD0-nwVKR-qWR4XLz5',
  'Tywin Lannister':
    'https://drive.google.com/open?id=1HebyGUfPtMfsg2EfKR1n4jCcxwFhTLZs',
  'Aemon Targaryen':
    'https://drive.google.com/open?id=1zB17-SshWlL_LmjZzLhBrCH3mBoGJ8Ez',
  'Balon Greyjoy':
    'https://drive.google.com/open?id=1I7VjgFplPiRUjIVGaJRd7HrDSRUovdmq',
  'Aron Santagar':
    'https://drive.google.com/open?id=1kuF6Qbu9tABVbpM5_W--dLkZQYHthCA6',
  'Alyn Estermont':
    'https://drive.google.com/open?id=149nkFDODr9PpuQCVLdWA5a2DXXhpxFd-',
  'Aerys II':
    'https://drive.google.com/open?id=1YpLjbhJJ5p_258X_VdeC5KRkqCY96rUH',
  'Aerys I':
    'https://drive.google.com/open?id=1pulJ-Dk8YLL9IhUboXxVFnMpwhdbVMAK'
};

//http://localhost:2000/addCharacter?name=Jon Snow
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
        spouse: response.data[0].spouse,
        character_image: imageUrl[name]
      });

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
