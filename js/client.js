const uriClient = "http://localhost:8080/car-rent/clients";
let clients = [];

function getClientItems() {

  fetch(uriClient + "/all")
    .then(response => response.json())
    .then(data => _displayClientsItems(data))
    .catch(error => console.error("Unable to get Clients.", error));
}

function addClientItem() {
    const item = {
    name: document.getElementById("add-client-name").value.trim(),
    birthday: document.getElementById("add-client-birthday").value.trim(),
    rg: document.getElementById("add-client-rg").value.trim(),
    cpf: document.getElementById("add-client-cpf").value.trim(),
    contact: document.getElementById("add-client-contact").value.trim(),
    email: document.getElementById("add-client-email").value.trim(),
    //Address Fields
    address: {
      cep: document.getElementById("add-client-cep").value.trim(),
      street: document.getElementById("add-client-street").value.trim(),
      number: parseInt(document.getElementById("add-client-number").value.trim()),
      neighborhood: document.getElementById("add-client-neighborhood").value.trim(),
      city: document.getElementById("add-client-city").value.trim(),
      state: document.getElementById("add-client-state").value.trim(),
      complement: document.getElementById("add-client-complement").value.trim()
    }
  };

  fetch(uriClient, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getClientItems();
      document.getElementById("add-client-name").value = "";
      document.getElementById("add-client-rg").value = "";
      document.getElementById("add-client-cpf").value = "";
      document.getElementById("add-client-contact").value = "";
      document.getElementById("add-client-email").value = "";
      document.getElementById("add-client-birthday").value = "";
      //Address Fields
      document.getElementById("add-client-cep").value = "";
      document.getElementById("add-client-street").value = "";
      document.getElementById("add-client-number").value = "";
      document.getElementById("add-client-neighborhood").value = "";
      document.getElementById("add-client-city").value = "";
      document.getElementById("add-client-state").value = "";
      document.getElementById("add-client-complement").value = "";
    })
    .catch(error => console.error("Unable to add Client.", error));
}

function loadCep(op, cep) {
  $.ajax({
    url: 'https://viacep.com.br/ws/' + cep + '/json/unicode/',
    dataType: 'json',
    success: function (data) {
      $("#" + op + "street").val(data.logradouro);
      $("#" + op + "complement").val(data.complemento);
      $("#" + op + "neighborhood").val(data.bairro);
      $("#" + op + "city").val(data.localidade);
      $("#" + op + "state").val(data.uf);
      if (document.getElementById(op + "street").value.length < 2)
        $("#" + op + "street").focus();
      else
        $("#" + op + "number").focus();
    }
  });
}

function deleteClientItem() {
  const itemId = document.getElementById("delete-client-id").value.trim();
  console.log(itemId);

  const item = {
    id: parseInt(itemId, 10),
    deletedBy: currentUser
  };

  console.log(item);
  fetch(`${uriClient}/delete`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getClientItems())
    .catch(error => console.error("Unable to Delete Client.", error));
}

function displayDeleteForm_Client(id) {
  const item = clients.find(item => item.id === id);
  document.getElementById("delete-client-id").value = item.id;
}

function displayEditForm_Client(id) {
  const item = clients.find(item => item.id === id);
  
  document.getElementById("edit-client-id").value = item.id;
  document.getElementById("edit-client-name").value = item.name;
  document.getElementById("edit-client-rg").value = item.rg;
  document.getElementById("edit-client-cpf").value = item.cpf;
  document.getElementById("edit-client-contact").value = item.contact;
  document.getElementById("edit-client-email").value = item.email;
  document.getElementById("edit-client-birthday").value = item.birthday;
  //Address Fields
  document.getElementById("edit-client-address-id").value = item.address.id;
  document.getElementById("edit-client-cep").value = item.address.cep;
  document.getElementById("edit-client-street").value = item.address.street;
  document.getElementById("edit-client-number").value = item.address.number;
  document.getElementById("edit-client-neighborhood").value = item.address.neighborhood;
  document.getElementById("edit-client-city").value = item.address.city;
  document.getElementById("edit-client-state").value = item.address.state;
  document.getElementById("edit-client-complement").value = item.address.complement;
}

function updateClientItem() {
  const itemId = document.getElementById("edit-client-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    birthday: document.getElementById("edit-client-birthday").value.trim(),
    name: document.getElementById("edit-client-name").value.trim(),
    rg: document.getElementById("edit-client-rg").value.trim(),
    cpf: document.getElementById("edit-client-cpf").value.trim(),
    contact: document.getElementById("edit-client-contact").value.trim(),
    email: document.getElementById("edit-client-email").value.trim(),

    //Address Fields
    address: { 
      id: document.getElementById("edit-client-address-id").value.trim(),
      cep: document.getElementById("edit-client-cep").value.trim(),
      street: document.getElementById("edit-client-street").value.trim(),
      number: parseInt(document.getElementById("edit-client-number").value.trim()),
      neighborhood: document.getElementById("edit-client-neighborhood").value.trim(),
      city: document.getElementById("edit-client-city").value.trim(),
      state: document.getElementById("edit-client-state").value.trim(),
      complement: document.getElementById("edit-client-complement").value.trim()
    }
  };

  fetch(`${uriClient}/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getClientItems())
    .catch(error => console.error("Unable to update item.", error));

  return false;
}

function _displayCount(itemCount) {
  const name = itemCount === 1 ? "entry" : "entries";
  document.getElementById(
    "counter"
  ).innerHTML = `Showing <b>${itemCount}</b> ${name}`;
}

function _displayClientsItems(data) {
  data = JSON.stringify(data.responseObject);
  data = JSON.parse(data);

  const tBody = document.getElementById("clients");
  tBody.innerHTML = "";
  _displayCount(data.length);
  const button = document.createElement("button");

  data.forEach(item => {
    let editButton = document.createElement("a");
    editButton.href = "#editClientModal";
    editButton.className = "edit";
    editButton.setAttribute("onclick", `displayEditForm_Client(${item.id})`);
    editButton.setAttribute("data-toggle", "modal");
    editButton.innerHTML =
      "<i class='material-icons' data-toggle='tooltip' title='Edit'>&#xE254;</i>";

    let deleteButton = document.createElement("a");
    deleteButton.href = "#deleteClientModal";
    deleteButton.className = "delete";
    deleteButton.setAttribute("onclick", `displayDeleteForm_Client(${item.id})`);
    deleteButton.setAttribute("data-toggle", "modal");
    deleteButton.innerHTML =
      "<i class='material-icons' data-toggle='tooltip' title='Delete'>&#xE872;</i>";

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);    
    let txtName = document.createTextNode(item.name);
    td1.appendChild(txtName);

    let td2 = tr.insertCell(1);
    let txtRg = document.createTextNode(item.rg);
    td2.appendChild(txtRg);

    let td3 = tr.insertCell(2);
    let txtCpf = document.createTextNode(item.cpf);
    td3.appendChild(txtCpf);

    let td4 = tr.insertCell(3);
    let txtBirthday = document.createTextNode(item.birthday);
    td4.appendChild(txtBirthday);

    let td5 = tr.insertCell(4);
    let txtContact = document.createTextNode(item.contact);
    td5.appendChild(txtContact);

    let td6 = tr.insertCell(5);
    let txtEmail = document.createTextNode(item.email);
    td6.appendChild(txtEmail);

    let td7 = tr.insertCell(6);
    td7.appendChild(editButton);
    td7.appendChild(deleteButton);
  });

  clients = data;
}
