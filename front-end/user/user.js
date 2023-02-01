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
  
  function loadList() {
    $.ajax(
      BACKEND_URL + "/base-users", // request url
      {
        type: "GET" /* or type:"GET" or type:"PUT" */,
        data: {
          first_name: "",
          last_name: "",
          date_of_birth: "",
          selectionGender: "",
          citizen: "",
        },
        success: function (data, status, xhr) {
          console.log(data);
          for (let user of data.list) {
            // console.log(person);
            var citizen = "";
            
            let rowHtml = `<tr>
                  <td><a href="form.html?id=${user.id}">${user.id}</a></td>
                  <td>${user.username}</td>
                  <td>${user.password}</td>
                  <td><button class="btn btn-danger" onclick="deletePerson(${user.id}, '${user.username}')">Delete</button></td>
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
    $.ajax(BACKEND_URL + "/base-user/" + url, {
      type: +id > 0 ? "PUT" : "POST",
      data: registrationFormValue,
      success: function (data, status, xhr) {
        console.log(data);
        if (data.status == 1) {
          console.log();
          goto("../personUI/index.html");
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
  
  function readyForm() {
    const urlParams = new URLSearchParams(window.location.search); // <= to get the param `id`
    let id = urlParams.get("id");
  
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
              $("[name=" + key + "]").val(person[key]);
              // console.log("??key", key);
            }
            $("#citizen").prop("checked", person.citizen ? true : false);
          }
        },
      });
    }
  }
  
  function deletePerson(id, firstName) {
    var confirmation = confirm(
      "Are you sure you want to delete " + firstName + "?"
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
  
  function exportExcel() {
    window.open(BACKEND_URL + "?action=download-excel");
  }
  