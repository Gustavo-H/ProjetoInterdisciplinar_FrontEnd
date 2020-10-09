const uriEmployee = "http://localhost:8080/car-rent/employees";
let employees = [];

function getEmployeeItems() {  

  fetch(uriEmployee + "/all")
    .then(response => response.json())
    .then(data => _displayEmployeesItems(data))
    .catch(error => console.error("Unable to get Employees.", error));
}

function addEmployeeItem() {

  const nameInputText = document.getElementById("add-employee-name");
  const serialInputText = document.getElementById("add-employee-serial");
  const cpfInputText = document.getElementById("add-employee-cpf");
  const roleInputText = document.getElementById("add-employee-role");

  const item = {
    name: nameInputText.value.trim(),
    serial: serialInputText.value.trim(),
    cpf: cpfInputText.value.trim(),
    role: parseInt(roleInputText.value.trim())
  };

  fetch(uriEmployee, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getEmployeeItems();
      nameInputText.value = "";
      serialInputText.value = "";
      cpfInputText.value = "";
      roleInputText.value = "";
    })
    .catch(error => console.error("Unable to add Employee.", error));
}

function deleteEmployeeItem() {
  const itemId = document.getElementById("delete-employee-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    deletedBy: 1
  };
  fetch(`${uriEmployee}/delete`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getEmployeeItems())
    .catch(error => console.error("Unable to Delete Employee.", error));
}

function displayDeleteForm_Employee(id) {
  const item = employees.find(item => item.id === id);
  document.getElementById("delete-employee-id").value = item.id;
}

function displayEditFormEmployee(id) {
  const item = employees.find(item => item.id === id);
  document.getElementById("edit-employee-id").value = item.id;
  document.getElementById("edit-employee-name").value = item.name;
  document.getElementById("edit-employee-serial").value = item.serial;
  document.getElementById("edit-employee-cpf").value = item.cpf;
  document.getElementById("edit-employee-role").value = item.role;
}

function updateEmployeeItem() {
  const itemId = document.getElementById("edit-employee-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    name: document.getElementById("edit-employee-name").value.trim(),
    serial: document.getElementById("edit-employee-serial").value.trim(),
    cpf: document.getElementById("edit-employee-cpf").value.trim(),
    role: parseInt(document.getElementById("edit-employee-role").value.trim())
  };

  fetch(`${uriEmployee}/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getEmployeeItems())
    .catch(error => console.error("Unable to update item.", error));

  return false;
}

function _displayCount(itemCount) {
  const name = itemCount === 1 ? "entry" : "entries";
  document.getElementById(
    "counter"
  ).innerHTML = `Showing <b>${itemCount}</b> ${name}`;
}

function _displayEmployeesItems(data) {
  data = JSON.stringify(data.responseObject);
  data = JSON.parse(data); 
  const tBody = document.getElementById("employees");
  tBody.innerHTML = "";
  _displayCount(data.length);
  const button = document.createElement("button");

  data.forEach(item => {
    let editButton = document.createElement("a");
    editButton.href = "#editEmployeeModal";
    editButton.className = "edit";
    editButton.setAttribute("onclick", `displayEditFormEmployee(${item.id})`);
    editButton.setAttribute("data-toggle", "modal");
    editButton.innerHTML =
      "<i class='material-icons' data-toggle='tooltip' title='Edit'>&#xE254;</i>";

    let deleteButton = document.createElement("a");
    deleteButton.href = "#deleteEmployeeModal";
    deleteButton.className = "delete";
    deleteButton.setAttribute("onclick", `displayDeleteForm_Employee(${item.id})`);
    deleteButton.setAttribute("data-toggle", "modal");
    deleteButton.innerHTML =
      "<i class='material-icons' data-toggle='tooltip' title='Delete'>&#xE872;</i>";

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    let textBrand = document.createTextNode(item.name);

    td1.appendChild(textBrand);

    let td2 = tr.insertCell(1);
    let textModel = document.createTextNode(item.serial);
    td2.appendChild(textModel);

    let td3 = tr.insertCell(2);
    let textYear = document.createTextNode(item.cpf);
    td3.appendChild(textYear);

    let td4 = tr.insertCell(3);
    let textEmployeePlate = document.createTextNode(item.role);
    td4.appendChild(textEmployeePlate);

    let td5 = tr.insertCell(4);
    td5.appendChild(editButton);
    td5.appendChild(deleteButton);
  });

  employees = data;
}
