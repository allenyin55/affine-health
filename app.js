const express = require('express')
const app = express()
const path = require('path')
const parse = require('csv-parse')
var bodyParser = require('body-parser');
const fs = require('fs')

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// End ponit for searching physician
app.post('/entries', function (req, res) {
  //read the csv file
  fs.readFile(path.join(__dirname, "OP_DTL_OWNRSHP_PGYR2016_P06302017.csv"), function (err, fileData) {
    parse(fileData, {trim: true}, function(err, rows) {
      // The CSV data is in an array of arrys passed to this callback as rows.

      // Iterate through the file looking for the physician's name
      for (i=0; i < rows.length; i++){
        if(rows[i][2].toUpperCase() === req.body.firstName.toUpperCase()
        && rows[i][3].toUpperCase() === ("" || req.body.middleName.toUpperCase())
        && rows[i][4].toUpperCase() === req.body.lastName.toUpperCase()){
          return res.send(rows[i])
        }
      }

      // Error handling: Not found
      res.status(400).send({
        message: 'No such person in the database!'
     });
    })
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})