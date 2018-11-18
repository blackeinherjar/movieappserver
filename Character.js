const mongoose = require('mongoose');
const db = 'mongodb://assignment:hanhan1993@ds215961.mlab.com:15961/assignment';

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Mongoose connetion error: ', error);
  });

const schema = mongoose.Schema({
  name: { type: String },
  gender: { type: String },
  culture: { type: String },
  born: { type: String },
  titles: { type: String },
  aliases: { type: String },
  father: { type: String },
  mother: { type: String },
  spouse: { type: String }
});

const Character = mongoose.model('Character', schema, 'character_list');

module.exports = Character;
