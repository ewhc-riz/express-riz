
$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};

$(document).ready(function () {
  console.log("ready");
});

const BACKEND_URL = "http://127.0.0.1:4040";

function loadList() {
  $.ajax(
    BACKEND_URL + "/base-person", // request url
    {
      type: "GET" /* or type:"GET" or type:"PUT" */,
      data: {first_name: '', last_name: '', birthdate: '', selectionGender: '', citizen: ''},
      success: function (data, status, xhr) {
        console.log(data);
        for (let person of data.list) {
          // console.log(person);
          var citizen = "";
          if (person.citizen == "true") {
            citizen = "checked";
          }
          let rowHtml =
            `<tr>
                <td><a href="form.html?id=${person.id}">${person.id}</a></td>
                <td>${person.first_name}</td>
                <td>${person.last_name}</td>
                <td>${person.birthdate}</td>
                <td>${person.selectionGender}</td>
                <td><input type = "checkbox" ` +
            citizen +
            ` disabled></td>
                <td><button onclick="deletePerson(${person.id}, '${person.first_name}')">Delete</button></td>
            </tr>`;
          $("#table1 > tbody").append(rowHtml);
        }
      }, 
    }
  );
}

function goto(url) {
  window.location = url;
}

function save() {
  let registrationFormValue = $("#registrationForm").serializeObject();
  let id = registrationFormValue.id;
  $("#status_message1").html("");
  let url = +id > 0 ? id : "";
  $.ajax(
    // BACKEND_URL + "?action=" + action + "&id=" + id, // request url
    BACKEND_URL + "/base-person/" + url,
    {
      type: +id > 0 ? "PUT" : "POST",
      data: {
        registrationFormValue,
      },
      success: function (data, status, xhr) {
        console.log(data);
        if (data.status == 1) {
          console.log();
          // goto("index.html");
        } else {
          $("#status_message1").html(data.message);
          setTimeout(function () {
            $("#status_message1").fadeOut();
          }, 2000);
        }
      },
    }
  );
  // }
}

// function update() {
//   // alert("clicked save()");
//   let id = $("input[name=id]").val();
//   let first_name = $("input[name=first_name]").val();
//   let last_name = $("input[name=last_name]").val();
//   let action = +id > 0 ? "update" : "insert";
//   $.ajax(
//     // BACKEND_URL + "?action=" + action + "&id=" + id, // request url
//     BACKEND_URL + "/person/" + id,
//     {
//       type: "PUT",
//       data: {
//         first_name: first_name,
//         last_name: last_name,
//       },
//       success: function (data, status, xhr) {
//         // console.log(data);
//         if (data.status == 1) {
//           goto("index.html");
//         }
//       },
//     }
//   );
// }

function readyForm() {
  const urlParams = new URLSearchParams(window.location.search); // <= to get the param `id`
  let id = urlParams.get("id");

  // view
  if (+id > 0) {
    $.ajax(
      // BACKEND_URL + "?action=view&id=" + id, // request url
      BACKEND_URL + "/person/" + id,
      {
        // type: "GET",
        success: function (data, status, xhr) {
          console.log(data);
          let person = data.list[0];
          if (person) {
            // $("input[name=id]").val(person.id);
            // $("input[name=first_name]").val(person.first_name);
            // $("input[name=last_name]").val(person.last_name);
            // $("input[name=birthdate]").val(person.birthdate);
            // $("#selectionGender").val(person.selectionGender);
            

            let registrationFormValue = $("#registrationForm").serializeObject();
            for(let key of Object.keys(registrationFormValue)){
              $("input[name="+key+"]").val(person[key]);
              console.log("??key", key);
            }
            $("#citizen").prop("checked", person.citizen ? true : false);
          }
        },
      }
    );
  }
}

function deletePerson(id, firstName) {
  // console.log("deleting id: " + id, firstName);
  var confirmation = confirm(
    "Are you sure you want to delete " + firstName + "?"
  );

  // view
  if (confirmation) {
    $.ajax(
      BACKEND_URL + "/person/" + id, // request url
      {
        type: "DELETE",
        data: {
          id: id,
        },
        success: function (data, status, xhr) {
          // console.log("deleted!");
          if (data.status == 1) {
            $("#table1 > tbody").html("");
            loadList();
          }

          // let person = data.list[0];
          // if (person) {
          //   $("input[name=id]").val(person.id);
          //   $("input[name=first_name]").val(person.first_name);
          //   $("input[name=last_name]").val(person.last_name);
          // }
        },
      }
    );
  }
}

// function searchButton() {

//   let searchstr = $("input[name=personId]").val();
//   let url =  "";

//   if(searchstr != ""){
//     url = searchstr;
//   }
//   $.ajax(

//     BACKEND_URL + "/person/" + url, // request url

//     {
//       type: 'GET',
//       success: function (data, status, xhr) {
//         console.log(data);
//         $("#table1 > tbody").html("");
//         for (let person of data.list) {
//           // console.log(person);

//           let rowHtml = `<tr>
//                 <td><a href="form.html?id=${person.id}">${person.id}</a></td>
//                 <td>${person.first_name}</td>
//                 <td>${person.last_name}</td>
//                 <td><button onclick="deletePerson(${person.id}, '${person.first_name}')">Delete</button></td>
//             </tr>`;
//           $("#table1 > tbody").append(rowHtml);
//         }
//       },
//     }
//   );
// }

function exportExcel() {
  window.open(BACKEND_URL + "?action=download-excel");
}
