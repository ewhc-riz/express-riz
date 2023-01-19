const express = require("express");
var cors = require("cors");
const app = express();
const port = 4040;
const dataBasePerson = require("./model/base-person.js");
const router = express.Router();
const bodyParser = require("body-parser");

const basePerson = dataBasePerson.dataBasePerson;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

function validate(data) {
  let errorMessage = "";
  if (data.first_name.trim() == "") {
    errorMessage = "First name is required";
  } else if (data.last_name.trim() == "") {
    errorMessage = "Last name is required";
  } else if (data.gender.trim() == "") {
    errorMessage = "Gender is required";
  }
  return errorMessage;
}

router.get("/base-person", async (req, res) => {
  res.send(await basePerson.getAll(req.query));
});

router.get("/base-person/:id", async (req, res) => {
  let person = await basePerson.get(+req.params.id);
  res.send(person);
});

router.post("/base-person", async (req, res) => {
  let errorMessage = validate(req.body);

  if (errorMessage == "") {
    await basePerson.insert(req.body);
    res.send({
      status: 1,
      message: "Successful!",
    });
  } else {
    res.send({
      status: 0,
      message: errorMessage,
    });
  }
});

router.put("/base-person/:id", async (req, res) => {
  let errorMessage = validate(req.body);

  req.body.id = +req.params.id;

  if (errorMessage == "") {
    await basePerson.update(req.body);
    res.send({
      status: 1,
      message: "Successful!",
    });
  } else {
    res.send({
      status: 0,
      message: errorMessage,
    });
  }
});

router.delete("/base-person/:id", async (req, res) => {
    await basePerson.delete(+req.params.id);
      res.send({
        status: 1,
        message: "Successful!",
      });
  });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
