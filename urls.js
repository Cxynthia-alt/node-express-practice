const axios = require('axios');
const fs = require('fs')
const process = require('process');



function saveURL(data, fileName) {
  fs.writeFile(fileName, data, 'utf8', (err) => {
    if (err) {
      console.log("Error:", err)
      process.kill(1)
    }
  })
}


function readFile(path) {
  const fileContents = fs.readFileSync(path, 'utf-8')
  const lines = fileContents.split('\n').filter(line => line)
  const promises = lines.map(url => {
    return axios.get(url)
      .then(res => {
        const fileName = new URL(`${url}`).hostname
        saveURL(res.data, fileName)
        return { url: fileName }
      })
      .catch(error => {
        return { url, error }
      })
  })
  Promise.all(promises)
    .then(results => {
      results.forEach(result => {
        if (!result) {
          console.log(`Coudln't download ${result.url}`)
        } else {
          console.log(`Wrote to ${result.url}`)
        }
      })
    })
}
readFile(process.argv[2])
