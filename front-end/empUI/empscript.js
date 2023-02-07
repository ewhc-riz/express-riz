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


const BACKEND_URL = "http://127.0.0.1:3000/api/main";

$(document).ready(function () {

  console.log("ready");
  $('#person_id').on('change', function(){
    let id = $('#person_id').val();
    // view
    if (+id > 0) {
      $.ajax(BACKEND_URL + "/base-persons/" + id, {
        // type: "GET",
        success: function (data, status, xhr) {
          console.log(data);
          let person = data;
          if (person) {
            let registrationFormValue = $("#registrationForm").serializeObject();
            for (let key of Object.keys(registrationFormValue)) {
              if (key != 'employee_no' && key != 'person_id') {
                $("[name=" + key + "]").val(person[key]);
      
              }
                         }
            }
        },
      });
    }
    else {
      let registrationFormValue = $("#registrationForm").serializeObject();
      for (let key of Object.keys(registrationFormValue)) {
        if (key != 'employee_no' && key != 'person_id') {
          $("[name=" + key + "]").val('');

        }
       
      }

    }
  
  })

  


});


function loadEmployee() {
  $.ajax(
    BACKEND_URL + "/base-employees", // request url
    {
      type: "GET" /* or type:"GET" or type:"PUT" */,
      data: {
        employee_no: "",
      },
      success: function (data, status, xhr) {
        console.log(data);
        for (let emp of data.list) {
          // console.log(emp);
          let rowHtml = `<tr>
                  <td><a href="emp-form.html?id=${emp.id}">${emp.id}</a></td>
                  <td>${emp.person_id}</td>
                  <td>${emp.employee_no}</td>
                  <td>${emp.last_name}</td>
                  <td>${emp.first_name}</td>
                  
                  <td><button class="btn btn-danger" onclick="deleteEmployee(${emp.id})">Delete</button></td>
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

function loadPerson() {
  var person_id = $("#person_id").val();
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
  $.ajax(BACKEND_URL + "/base-employees/get-employee-no", {
    type: "GET",
    success: function (data) {
      console.log(data);
      $("#employee_no").val(data.employee_no);
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

  // construct payload json
  let employeeEducations = [];
  $("#employee_education > tbody > tr").each(function (index) {
    console.log(index);
    var level = $("#level_" + index).val();
    var school_name = $("#school_name_" + index).val();
    var year_graduated = $("#year_graduated_" + index).val();

    employeeEducations.push({
      level: level,
      school_name: school_name,
      year_graduated: year_graduated,
    });
  });

  registrationFormValue["employee_educations"] = employeeEducations;

  console.log("??payload: ", registrationFormValue);

  $("#status_message1").html("");
  let url = +id > 0 ? id : "";
  $.ajax(BACKEND_URL + "/base-employees/" + url, {
    type: +id > 0 ? "PUT" : "POST",
    data: registrationFormValue,
    success: function (data, status, xhr) {
      console.log(data);
      if (data.status == 1) {
        console.log();
        goto("../empUI/emp.html");
      } else {
        $("#status_message1").html(data.message);
        setTimeout(function () {
          $("#status_message1").fadeOut();
        }, 2000);
      }
    },
  });


  }


function deleteEmployee(id) {
  var confirmation = confirm("Are you sure you want to delete ?");

  // view
  if (confirmation) {
    $.ajax(
      BACKEND_URL + "/base-employees/delete-employee/" + id, // request url
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

var index = 0;
function addEducation() {
  //var index = $("#employee_education tbody tr").length -1;
  

  html = `
    <tr>
      <td>
        <select class="form-select" id="level_${index}">
          <option value="">Please Select</option>
          <option value="ELEMENTARY">ELEMENTARY</option>
          <option value="HIGH SCHOOL">HIGH SCHOOL</option>
          <option value="COLLEGE">COLLEGE</option>
          <option value="VOCATIONAL">VOCATIONAL</option>
          <option value="MASTERS DEGREE">MASTERS DEGREE</option>
          <option value="PHD">PHD</option>
        </select>
      </td>
      <td><input class="form-control" type="text" id="school_name_${index}"/></td>
      <td><input class="form-control" type="number" id="year_graduated_${index}" min="1900" max="2003" /></td>
    </tr>
  `;
  $("#employee_education tbody").append(html);
  //console.log("??index: ", index);
index ++;
}
