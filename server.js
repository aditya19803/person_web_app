const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const Person = require('./models/Person');

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.get('/person', async (req, res) => {
  const people = await Person.find();
  res.render('index', { people });
});

app.get('/person/new', (req, res) => {
  res.render('form', { person: {}, action: '/person', method: 'POST' });
});

app.post('/person', async (req, res) => {
  await Person.create(req.body);
  res.redirect('/person');
});

app.get('/person/:id/edit', async (req, res) => {
  const person = await Person.findById(req.params.id);
  res.render('form', { person, action: `/person/${person._id}`, method: 'POST' });
});

app.post('/person/:id', async (req, res) => {
  await Person.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/person');
});

app.get('/person/:id/delete', async (req, res) => {
  const person = await Person.findById(req.params.id);
  res.render('delete', { person });
});

app.post('/person/:id/delete', async (req, res) => {
  await Person.findByIdAndDelete(req.params.id);
  res.redirect('/person');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
