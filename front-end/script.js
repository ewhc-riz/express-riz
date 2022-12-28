// Front - end code

const BACKEND_URL = "http://127.0.0.1:3000";

function loadList() {
  $.ajax(
    BACKEND_URL + "/person", // request url
    {
      success: function (data, status, xhr) {
        console.log(data);
        for (let person of data.list) {
          // console.log(person);
          let rowHtml = `<tr>
                <td><a href="form.html?id=${person.id}">${person.id}</a></td>
                <td>${person.first_name}</td>
                <td>${person.last_name}</td>
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
  // alert("clicked save()");
  let id = $("input[name=id]").val();
  let first_name = $("input[name=first_name]").val();
  let last_name = $("input[name=last_name]").val();
  let action = +id > 0 ? "update" : "insert";
  $.ajax(
    // BACKEND_URL + "?action=" + action + "&id=" + id, // request url
    BACKEND_URL + "/person" + id,
    {
      type: "POST",
      data: {
        first_name: first_name,
        last_name: last_name,
      },
      success: function (data, status, xhr) {
        console.log(data);
        // if (data.status == 1) {
        //   goto("index.html");
        // }
      },
    }
  );
}

function update() {
  // alert("clicked save()");
  let id = $("input[name=id]").val();
  let first_name = $("input[name=first_name]").val();
  let last_name = $("input[name=last_name]").val();
  let action = +id > 0 ? "update" : "insert";
  $.ajax(
    // BACKEND_URL + "?action=" + action + "&id=" + id, // request url
    BACKEND_URL + "/person" + id,
    {
      type: "PUT",
      data: {
        first_name: first_name,
        last_name: last_name,
      },
      success: function (data, status, xhr) {
        // console.log(data);
        if (data.status == 1) {
          goto("index.html");
        }
      },
    }
  );
}

function readyForm() {
  const urlParams = new URLSearchParams(window.location.search); // <= to get the param `id`
  let id = urlParams.get("id");

  // view
  if (+id > 0) {
    $.ajax(
      // BACKEND_URL + "?action=view&id=" + id, // request url
      BACKEND_URL + "/person/" + id,
      {
        success: function (data, status, xhr) {
          console.log(data);
          let person = data.list[0];
          if (person) {
            $("input[name=id]").val(person.id);
            $("input[name=first_name]").val(person.first_name);
            $("input[name=last_name]").val(person.last_name);
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
      BACKEND_URL + "?action=delete&id=" + id, // request url
      {
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

function exportExcel() {
  window.open(BACKEND_URL + "?action=download-excel");
}
