const uriUser = "http://localhost:8080/car-rent/users";
let users = [];
var client;
var employee;

function getUserItems() {
  fetch(uriUser + "/all")
    .then(response => response.json())
    .then(data => _displayUsersItems(data))
    .catch(error => console.error("Unable to get Users.", error));
}

function validateLogin() {
  event.preventDefault();
  const item = {
    login: document.getElementById("input-login").value.trim(),
    password: document.getElementById("input-password").value.trim()
  };


  fetch(uriUser + "/check", {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(data => _checkUser(data))
    .catch(error => console.error("Unable to get Users.", error));
}

function _checkUser(data) {
  data = JSON.stringify(data.responseObject);
  data = JSON.parse(data);

  if (data.login == document.getElementById("input-login").value.trim()) {
    document.getElementById("msg-error").style.visibility = "hidden";
    window.open("./html/client.html", "_self")
  }
  else {
    document.getElementById("input-password").style.borderColor = 'red';
    document.getElementById("input-login").style.borderColor = 'red';
    document.getElementById("msg-error").style.visibility = "visible";
  }
}

function checkForLogin(login) {

  if (login.length > 0)

    fetch(uriUser + "/login/" + login)
      .then(response => response.json())
      .then(function a(data) {
        data = JSON.stringify(data.responseObject);
        data = JSON.parse(data);

        if (data.login == login) {
          document.getElementById("msg-error-login").style.display = "";
          document.getElementById("add-login").style.borderColor = 'red';
          document.getElementById("btn-add").setAttribute("disabled", "disabled");
        }
        else {
          document.getElementById("btn-add").removeAttribute("disabled");
          document.getElementById("msg-error-login").style.display = "none";
        }
      })
      .catch(error => console.error("Unable to get User.", error));
}

function checkForCpf(cpf) {
  const url = "http://localhost:8080/car-rent/";
  if (document.getElementById('rd-client').checked) {
    fetch(url + "clients/cpf/" + cpf)
      .then(response => response.json())
      .then(function a(data) {
        data = JSON.stringify(data.responseObject);
        data = JSON.parse(data);

        if (data.cpf == cpf) {
          client = data;

          document.getElementById("lbl-add-login").style.visibility = "visible";
          document.getElementById("add-login").style.visibility = "visible";
          document.getElementById("lbl-add-password").style.visibility = "visible";
          document.getElementById("add-password").style.visibility = "visible";
          document.getElementById("msg-error-cpf").style.display = "none";
          document.getElementById("add-cpf").style.borderColor = "";
        }
        else {
          document.getElementById("msg-error-cpf").style.display = "";
          document.getElementById("msg-error-cpf").style.color = "red";
          document.getElementById("add-cpf").style.borderColor = "red";
        }
      })
      .catch(error => console.error("Unable to get Client.", error));
  }
  else if (document.getElementById('rd-employee').checked) {
    fetch(url + "employees/cpf/" + cpf)
      .then(response => response.json())
      .then(function a(data) {
        data = JSON.stringify(data.responseObject);
        data = JSON.parse(data);
        if (data.cpf == cpf) {
          employee = data;
          document.getElementById("lbl-add-login").style.visibility = "visible";
          document.getElementById("add-login").style.visibility = "visible";
          document.getElementById("lbl-add-password").style.visibility = "visible";
          document.getElementById("add-password").style.visibility = "visible";
          document.getElementById("msg-error-cpf").style.display = "none";
          document.getElementById("add-cpf").style.borderColor = "";
        }
        else {
          document.getElementById("msg-error-cpf").style.display = "";
          document.getElementById("msg-error-cpf").style.color = "red";
          document.getElementById("add-cpf").style.borderColor = "red";
        }
      })
      .catch(error => console.error("Unable to get Client.", error));
  }
}

function radioClick(value) {
  document.getElementById("lbl-add-cpf").style.visibility = "visible";
  document.getElementById("add-cpf").style.visibility = "visible";

  if (value == 1) {
    document.getElementById("add-birthday").style.display = "none"
    document.getElementById("lbl-add-birthday").style.display = "none"
    document.getElementById("add-birthday").removeAttribute("required");

    document.getElementById("lbl-add-serial").style.display = "";
    document.getElementById("add-serial").style.display = "";

    document.getElementById("lbl-add-serial").style.visibility = "visible";
    document.getElementById("add-serial").style.visibility = "visible";
    document.getElementById("add-serial").setAttribute("required", "true");
  }
  else {
    document.getElementById("lbl-add-serial").style.display = "none";
    document.getElementById("add-serial").style.display = "none";
    document.getElementById("add-serial").removeAttribute("required");

    document.getElementById("add-birthday").style.display = ""
    document.getElementById("lbl-add-birthday").style.display = ""

    document.getElementById("lbl-add-birthday").style.visibility = "visible";
    document.getElementById("add-birthday").style.visibility = "visible";
    document.getElementById("add-birthday").setAttribute("required", "true");
  }
}


function addUserItem() {
  const txtLogin = document.getElementById("add-login");
  const txtPassword = document.getElementById("add-password");
  var txtName;
  var txtType;
  var txtOwnerId
  if (document.getElementById('rd-client').checked) {
    txtType = 2;
    txtOwnerId = client.id
    txtName = client.name;
  }
  else if (document.getElementById('rd-employee').checked) {
    txtType = 1;
    ownerId = employee.id;
    txtName = employee.name;
  }

  const item = {
    login: txtLogin.value.trim(),
    password: txtPassword.value.trim(),
    type: parseInt(txtType),
    ownerId: parseInt(txtOwnerId),
    name: txtName
  };

  fetch(uriUser, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      document.getElementById("add-cpf").value = "";
      document.getElementById("add-birthday").value = "";
      document.getElementById("add-serial").value = "";
      document.getElementById("add-login").value = "";
      document.getElementById("add-password").value = "";
    })
    .catch(error => console.error("Unable to add User.", error));
}

function deleteUserItem() {
  const itemId = document.getElementById("delete-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    deletedBy: 1
  };
  
  fetch(`${uriUser}/delete`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getUserItems())
    .catch(error => console.error("Unable to Delete User.", error));
}

function displayDeleteForm(id) {
  const item = users.find(item => item.id === id);
  document.getElementById("delete-id").value = item.id;
}

function displayEditForm(id) {
  const item = users.find(item => item.id === id);
  document.getElementById("edit-id").value = item.id;
  document.getElementById("edit-brand").value = item.brand;
  document.getElementById("edit-model").value = item.model;
  document.getElementById("edit-year").value = item.year;
  document.getElementById("edit-user-plate").value = item.userPlate;
  document.getElementById("edit-color").value = item.color;
}

function updateUserItem() {
  const itemId = document.getElementById("edit-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    brand: document.getElementById("edit-brand").value.trim(),
    model: document.getElementById("edit-model").value.trim(),
    year: document.getElementById("edit-year").value.trim(),
    userPlate: document.getElementById("edit-user-plate").value.trim(),
    color: parseInt(document.getElementById("edit-color").value.trim())
  };

  fetch(`${uriUser}/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getUserItems())
    .catch(error => console.error("Unable to update item.", error));

  return false;
}

function _displayCount(itemCount) {
  const name = itemCount === 1 ? "entry" : "entries";
  document.getElementById(
    "counter"
  ).innerHTML = `Showing <b>${itemCount}</b> ${name}`;
}

function _displayUsersItems(data) {
  data = JSON.stringify(data.responseObject);
  data = JSON.parse(data);

  const tBody = document.getElementById("users");
  tBody.innerHTML = "";
  _displayCount(data.length);
  const button = document.createElement("button");

  data.forEach(item => {
    let editButton = document.createElement("a");
    editButton.href = "#editUserModal";
    editButton.className = "edit";
    editButton.setAttribute("onclick", `displayEditForm(${item.id})`);
    editButton.setAttribute("data-toggle", "modal");
    editButton.innerHTML =
      "<i class='material-icons' data-toggle='tooltip' title='Edit'>&#xE254;</i>";

    let deleteButton = document.createElement("a");
    deleteButton.href = "#deleteUserModal";
    deleteButton.className = "delete";
    deleteButton.setAttribute("onclick", `displayDeleteForm(${item.id})`);
    deleteButton.setAttribute("data-toggle", "modal");
    deleteButton.innerHTML =
      "<i class='material-icons' data-toggle='tooltip' title='Delete'>&#xE872;</i>";

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    let txtName = document.createTextNode(item.name);

    td1.appendChild(txtName);

    let td2 = tr.insertCell(1);
    let txtLogin = document.createTextNode(item.login);
    td2.appendChild(txtLogin);

    let td3 = tr.insertCell(2);
    let txtType = document.createTextNode(item.type);
    td3.appendChild(txtType);

    let td4 = tr.insertCell(3);
    td4.appendChild(editButton);
    td4.appendChild(deleteButton);
  });

  users = data;
}
