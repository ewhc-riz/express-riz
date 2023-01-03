// Back End code

// const http = require("http");
// const url = require("url");

// http
//   .createServer(function (req, res) {
//     console.log(`Request Method: ${req.method}`);

//     var result = {
//       status: 0,
//       message: "",
//       list: [],
//     };

//     // CORS

// if (req.method === "OPTIONS") {
//   res.writeHead(204, headers);
//   res.end();
//   return;
// }

//     // CORS - end

//     const queryObject = url.parse(req.url, true).query; // <= query params
//     const requestBody = req.body; // <= form values

//     // console.log(`Request Method: ${req.method}`);
//     // console.log("queryObject: ", queryObject);
//     // console.log("requestBody: ", requestBody);

//     if (req.method == "GET" && queryObject.action == "download-excel") {
//       console.log("download here...");

//       async function exTest() {
//         const workbook = new Excel.Workbook();
//         const worksheet = workbook.addWorksheet("My Sheet");
//         var fileName = "export.xlsx";

//         worksheet.columns = [
//           { header: "Id", key: "id", width: 10 },
//           { header: "First Name", key: "first_name", width: 32 },
//           { header: "LastName", key: "last_name", width: 32 },
//         ];

//         for (let person of listDataJson) {
//           worksheet.addRow({
//             id: person.id,
//             first_name: person.first_name,
//             last_name: person.last_name,
//           });
//         }

//         res.setHeader(
//           "Content-Type",
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//           "Content-Disposition",
//           "attachment; filename=" + fileName
//         );

//         // workbook.xlsx.write(res).then(function (data) {
//         //   res.end();
//         //   console.log("File write done........");
//         // });

//         await workbook.xlsx.write(res);

//         // await workbook.xlsx.writeFile("output/" + fileName);
//         res.end();
//         // return;
//       }

//       exTest();
//     }

//     // all other GET
//     if (req.method == "GET" && queryObject.action != "download-excel") {
//       switch (queryObject.action) {
//         case "list":
//           result.status = 1;
//           result.message = "Show the list of the person";
//           result.list = listDataJson;
//           break;

//         case "view":
//           result.status = 1;
//           result.list = listDataJson.filter((item) => {
//             return +item.id == +queryObject.id; // Note: + before variable means casting string value into integer
//           });
//           break;

//         case "delete":
//           result.status = 1;
//           let newList = listDataJson.filter((item) => {
//             return +item.id != +queryObject.id;
//           });

//           // reindex ids
//           let i = 1;
//           newList = newList.map((item) => {
//             item.id = i++;
//             return item;
//           });
//           writeFile(JSON.stringify(newList));
//           break;
//       }

//       res.writeHead(200, headers);
//       res.end(JSON.stringify(result));
//       return;
//     }

//     if (req.method == "POST") {
//       const chunks = [];
//       req.on("data", (chunk) => {
//         chunks.push(chunk);
//       });
//       req.on("end", () => {
//         console.log("all parts/chunks have arrived");
//         const data = Buffer.concat(chunks);
//         // console.log("Data: ", data);
//         const stringData = data.toString();
//         // console.log("stringData: ", stringData);
//         const parsedData = new URLSearchParams(stringData);
//         const dataObj = {};
//         for (var pair of parsedData.entries()) {
//           dataObj[pair[0]] = pair[1];
//         }
//         // console.log("DataObj: ", dataObj);

//         switch (queryObject.action) {
//           case "insert":
//             let newPerson = {
//               id: listDataJson.length + 1,
//               first_name: dataObj.first_name,
//               last_name: dataObj.last_name,
//             };
//             listDataJson.push(newPerson);
//             writeFile(JSON.stringify(listDataJson));
//             result.status = 1;
//             break;

//           case "update":
//             result.status = 1;
//             let updatedList = listDataJson.map((item) => {
//               if (+item.id == +queryObject.id) {
//                 item.first_name = dataObj.first_name;
//                 item.last_name = dataObj.last_name;
//               }
//               return item;
//             });
//             writeFile(JSON.stringify(updatedList));
//             break;
//         }

//         res.writeHead(200, headers);
//         res.end(JSON.stringify(result));
//         return;
//       });
//     }
//   })
//   .listen(8081);

// Console will print the message
var cors = require("cors");
const express = require("express");
const app = express();
const fs = require("fs");
const bodyparser = require("body-parser");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cors());

app.use(bodyparser.json());

var result = {
  status: 0,
  message: "",
  list: [],
};

app.listen(4040, function () {
  console.log("listening on 4040");
});

function writeFile(data) {
  fs.writeFile("database/person-list.json", data, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

var listDataJson = readFile();
// View all list
app.get("/person", function (req, res) {
  var listDataJson = readFile();
  result.status = 1;
  result.message = "Show the list of the person";
  result.list = listDataJson;
  res.send(result);
});
// view
app.get("/person/:id", function (req, res) {
  var id = req.params.id;
  result.status = 1;
  result.message = "Updating Person name and last name of id " + id;
    (result.list = listDataJson.filter((item) => {
      return +item.id == +id;
      // em.id == +req.body.id; // Note: + before variable means casting string value into integer
    }));
  res.send(result);
});
//Insert person
app.post("/person/", function (req, res) {
  let newPerson = {
    id: listDataJson.length + 1,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  listDataJson.push(newPerson);
  writeFile(JSON.stringify(listDataJson));
  result.status = 1;
  res.send(result);
});

// Update person
app.put("/person/:id", function (req, res) {
  var id = req.body.id;
  result.status = 1;
  let updatedList = listDataJson.map((item) => {
    if (+item.id == +id) {
      item.first_name = req.body.first_name;
      item.last_name = req.body.last_name;
    }
    return item;
  });
  result.list = updatedList;
  writeFile(JSON.stringify(updatedList));
  res.send(result);
});

// Delete person
app.delete("/person/:id", function (req, res) {
  var id = req.body.id;

  let newList = listDataJson.filter((item) => {
    return +item.id != +id;
  });

  // reindex ids
  let i = 1;
  newList = newList.map((item) => {
    item.id = i++;
    return item;
  });
  result.status = 1;
  result.message = "Person deleted";
  result.list = newList;
  writeFile(JSON.stringify(newList));
  res.send(result);
});

//search
// app.get('/person/:searchstr', (req, res) => {
//   var searchstr = req.params.searchstr;

//   result.status = 1;
//   result.message = "Displaying person with " + searchstr ;
//   result.list = listDataJson.filter((item) => {
//       return (+item.id == +searchstr || item.first_name.toLowerCase().includes(searchstr) || item.last_name.toLowerCase().includes(searchstr)); // Note: + before variable means casting string value into integer
//   });

//   res.send(result);

// });

function readFile() {
  let listDataRaw = fs.readFileSync("database/person-list.json");
  return JSON.parse(listDataRaw);
}

app.get("/person", function (req, res) {
  var listDataJson = readFile();
  result.status = 1;
  result.message = "downloading...";
  result.list = listDataJson;
  res.send(result);
});
