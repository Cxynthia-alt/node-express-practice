const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', async function (req, res, next) {
  try {
    let { developers } = req.query
    let results = await Promise.all(developers.map(async d => {
      const res = await axios.get(`https://api.github.com/users/${d}`)
      return { bio: res.data.company, name: res.data.name }
    }))

    return res.send(JSON.stringify(results));
  } catch (err) {
    next(err);
  }
});

app.listen(3000, function () {
  console.log('App on port 3000');
})
