const express = require("express");
var cors = require("cors");
const app = express();
const port = 4040;
const dataBasePerson = require('./model/base-person.js');
const router = express.Router();
const bodyParser = require('body-parser');

const basePerson = dataBasePerson.dataBasePerson;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);


router.get('/base-person', async (req, res)=>{
    res.send(await basePerson.getAll(req.query));
});

router.get('/base-person/:id', async (req, res)=>{
  
      res.send({status: 1, list: await basePerson.get(req.query.id) });
 });

router.post('/base-person', async (req, res)=>{
    res.send(await basePerson.insert(req.query));
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });


  