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
                    <td><a href="education-form.html?id=${edu.base_employee_education_id}">${edu.base_employee_education_id}</a></td>
                    <td>${edu.employee_id}</td>
                    <td>${edu.last_name}, ${edu.first_name}</td>
                    <td>${edu.level}</td>
                    <td>${edu.school_name}</td>
                    <td>${edu.year_graduated}</td>
                    
                    <td><button class="btn btn-danger" onclick="deleteEmployeeEducation(${edu.base_employee_education_id})">Delete</button></td>
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
  $.ajax(BACKEND_URL + "/base-employees", {
    type: "GET",
    success: function (data) {
      console.log(data);
      $("#employee_id").empty();
      $("#employee_id").append('<option value="">Select option</option>');

      Object.values(data.list).forEach((value) => {
        $("#employee_id").append(
          $(
            "<option value='" +
              value.employee_id +
              "'>" +
              (value.last_name + ", " + value.first_name) +
              "</option>"
          )
        );
      });
    },
  });

  const urlParams = new URLSearchParams(window.location.search); // <= to get the param `id`
  let id = urlParams.get("id");
  // view
  if (+id > 0) {
    $.ajax(BACKEND_URL + "/base-employees-education/get-education/" + id, {
      type: "GET",
      success: function (data, status, xhr) {
        console.log(data);
        let person = data;
        if (person) {
          let registrationFormValue = $("#registrationForm").serializeObject();
          for (let key of Object.keys(registrationFormValue)) {
            $("[name=" + key + "]").val(person[key]);
             console.log("??key", key);
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
        goto("../empEdUI/education-list.html");
      } else {

        $("#status_message1").html(data.message);

        // setTimeout(function () {
        //   $("#status_message1").fadeOut();
        // }, 5000);
      }
    },
  });
  // }
}

function deleteEmployeeEducation(id) {
  var confirmation = confirm(
    "Are you sure you want to delete ?"
  );
  // view
  if (confirmation) {
    $.ajax(
      BACKEND_URL + "/base-employees-education/delete/" + id, // request url
      {
        type: "DELETE",
        data: {
          id: id,
        },
        success: function (data, status, xhr) {
          if (data.status == 1) {
            location.reload();
          }
        },
      }
    );
  }
}
