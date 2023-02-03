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

const BACKEND_URL = "http://127.0.0.1:3000/api/main";

function loadEmployeeEd() {
  $.ajax(
    BACKEND_URL + "/base-employees-education", // request url
    {
      type: "GET" /* or type:"GET" or type:"PUT" */,
      data: {
        employee_no: "",
      },
      success: function (data, status, xhr) {
        console.log(data);
        for (let edu of data.list) {
          // console.log(emp);
          let rowHtml = `<tr>
                    <td><a href="emp-form.html?id=${edu.id}">${edu.id}</a></td>
                    <td>${edu.employee_id}</td>
                    <td>${edu.level}</td>
                    <td><button class="btn btn-danger" onclick="deletePerson(${edu.id}, '${edu.employee_no}')">Delete</button></td>
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

function loadPersonForm() {
  $.ajax(BACKEND_URL + "/base-persons", {
    type: "GET",
    success: function (data) {
      console.log(data);
      $("#person_id").empty();
      $("#person_id").append('<option value="">Select option</option>');

      Object.values(data.list).forEach((value) => {
        $("#person_id").append(
          $(
            "<option value='" +
              value.id +
              "'>" +
              (value.last_name + ", " + value.first_name) +
              "</option>"
          )
        );
      });
    },
  });
}

function readyForm() {
  const urlParams = new URLSearchParams(window.location.search); // <= to get the param `id`
  let id = urlParams.get("id");

  // view
  if (+id > 0) {
    $.ajax(BACKEND_URL + "/base-employees/" + id, {
      // type: "GET",
      success: function (data, status, xhr) {
        console.log(data);
        let person = data;
        if (person) {
          let registrationFormValue = $("#registrationForm").serializeObject();
          for (let key of Object.keys(registrationFormValue)) {
            $("[name=" + key + "]").val(person[key]);
            // console.log("??key", key);
          }
          // $("#citizen").prop("checked", person.citizen ? true : false);
        }
      },
    });
  }
}

function save() {
  let registrationFormValue = $("#registrationForm").serializeObject();
  let id = registrationFormValue.id;
  $("#status_message1").html("");
  let url = +id > 0 ? id : "";
  $.ajax(BACKEND_URL + "/base-employees-education/" + url, {
    type: +id > 0 ? "PUT" : "POST",
    data: registrationFormValue,
    success: function (data, status, xhr) {
      console.log(data);
      if (data.status == 1) {
        console.log();
        goto("../empEdUI/edu.html");
      } else {
        $("#status_message1").html(data.message);
        setTimeout(function () {
          $("#status_message1").fadeOut();
        }, 2000);
      }
    },
  });
  // }
}

function deletePerson(id, employee_no) {
  var confirmation = confirm(
    "Are you sure you want to delete " + employee_no + "?"
  );

  // view
  if (confirmation) {
    $.ajax(
      BACKEND_URL + "/base-persons/" + id, // request url
      {
        type: "DELETE",
        data: {
          id: id,
        },
        success: function (data, status, xhr) {
          if (data.status == 1) {
            $("#table1 > tbody").html("");
            loadList();
          }
        },
      }
    );
  }
}
