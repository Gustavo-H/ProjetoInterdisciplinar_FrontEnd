const uriRent = "http://localhost:8080/car-rent/rents";
let rents = [];
let selectCars = [];


function AddNewRental() {    
    const item = {
    clientId: parseInt(document.getElementById("new-rental-client-select").value.trim()),
    employeeId: parseInt(currentUser),
    carId: parseInt(document.getElementById("new-rental-car-select").value.trim()),
    discount: parseFloat(document.getElementById("new-rental-discount").value.trim()),
    dailyCost: document.getElementById("new-rental-daily-cost").value.trim(),
    expectedReturnDate: document.getElementById("new-rental-expected-return-date").value.trim()
  };

  fetch(uriRent, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {      
      callRentTableOpen();
    })
    .catch(error => console.error("Unable to add Client.", error));    
}

function getRentAll() {
  fetch(uriRent + "/all")
    .then(response => response.json())
    .then(data => _displayRentsItems(data))
    .catch(error => console.error("Unable to get Rents.", error));
}

function loadRentNew() {
  const apiUrl = "http://localhost:8080/car-rent/"

    //load all available cars
    fetch(apiUrl + "cars/available")
    .then(response => response.json())
    .then(function a(data) {
      data = JSON.stringify(data.responseObject);
      data = JSON.parse(data);
      
      var selectCar = document.getElementById("new-rental-car-select")

      data.forEach(car => {
        var opt = document.createElement("option");
        opt.value = car.id;
        opt.innerHTML = car.model + " - " + car.carPlate;        
        selectCar.appendChild(opt);
        
      })
      selectCars = data;
    })
    .catch(error => console.error("Unable to get Cars.", error));

  //load all clients
  fetch(apiUrl + "clients/all")
    .then(response => response.json())
    .then(function a(data) {
      data = JSON.stringify(data.responseObject);
      data = JSON.parse(data);
      
      var selectClient = document.getElementById("new-rental-client-select")

      data.forEach(client => {
        var opt = document.createElement("option");
        opt.value = client.id;
        opt.innerHTML = client.name + " - " + client.cpf;        
        selectClient.appendChild(opt);
      })
    })
    .catch(error => console.error("Unable to get Clients.", error));

    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " - "  
                    + currentdate.getHours() + ":"  
                    + ((currentdate.getMinutes().length === 1) ? "0" + currentdate.getMinutes() : currentdate.getMinutes());
    document.getElementById("new-rental-date-withdrawal").value =  datetime;
}


function getRentOpen() {
  fetch(uriRent + "/open")
    .then(response => response.json())
    .then(data => _displayRentsItems(data, "open"))
    .catch(error => console.error("Unable to get Rents.", error));
}

function getRentClose() {
  fetch(uriRent + "/closed")
    .then(response => response.json())
    .then(data => _displayRentsItems(data, "closed"))
    .catch(error => console.error("Unable to get Rents.", error));
}

function addRentItem() {
  const nameInputText = document.getElementById("add-rent-name");
  const serialInputText = document.getElementById("add-rent-serial");
  const cpfInputText = document.getElementById("add-rent-cpf");
  const roleInputText = document.getElementById("add-rent-role");

  const item = {
    name: nameInputText.value.trim(),
    serial: serialInputText.value.trim(),
    cpf: cpfInputText.value.trim(),
    role: parseInt(roleInputText.value.trim())
  };

  fetch(uriRent, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getRentItems();
      nameInputText.value = "";
      serialInputText.value = "";
      cpfInputText.value = "";
      roleInputText.value = "";
    })
    .catch(error => console.error("Unable to add Rent.", error));
}

function displayEditFormRent(id) {
  const item = rents.find(item => item.id === id);
  document.getElementById("edit-rent-id").value = item.id;
  document.getElementById("edit-rent-name").value = item.name;
  document.getElementById("edit-rent-serial").value = item.serial;
  document.getElementById("edit-rent-cpf").value = item.cpf;
  document.getElementById("edit-rent-role").value = item.role;
}

function updateRentItem() {
  const itemId = document.getElementById("edit-rent-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    name: document.getElementById("edit-rent-name").value.trim(),
    serial: document.getElementById("edit-rent-serial").value.trim(),
    cpf: document.getElementById("edit-rent-cpf").value.trim(),
    role: parseInt(document.getElementById("edit-rent-role").value.trim())
  };

  fetch(`${uriRent}/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getRentItems())
    .catch(error => console.error("Unable to update item.", error));

  return false;
}

function _displayRentCount(itemCount) {
  const name = itemCount === 1 ? "entry" : "entries";
  document.getElementById(
    "rent-counter"
  ).innerHTML = `Showing <b>${itemCount}</b> ${name}`;
}

function displayClientModal(id) {
  const item = rents.find(item => item.rental.id === id);

  document.getElementById("rental-client-name").value = item.client.name;
  document.getElementById("rental-client-rg").value = item.client.rg;
  document.getElementById("rental-client-cpf").value = item.client.cpf;
  document.getElementById("rental-client-contact").value = item.client.contact;
  document.getElementById("rental-client-email").value = item.client.email;
  document.getElementById("rental-client-birthday").value = item.client.birthday;
}

function displayEmployeeModal(id) {
  const item = rents.find(item => item.rental.id === id);

  document.getElementById("rental-employee-name").value = item.employee.name;
  document.getElementById("rental-employee-serial").value = item.employee.serial;
  document.getElementById("rental-employee-cpf").value = item.employee.cpf;
  document.getElementById("rental-employee-role").value = (item.employee.role === 1 ) ? "Vendedor" : "Gerente";

}

function displayCarModal(id) {
  const item = rents.find(item => item.rental.id === id);
  console.log(item);
  document.getElementById("rental-car-model").value = item.car.model;
  document.getElementById("rental-car-plate").value = item.car.carPlate;
  document.getElementById("rental-car-brand").value = item.car.brand;
  document.getElementById("rental-car-group").value = item.car.group;
  document.getElementById("rental-car-color").value = item.car.color;
  document.getElementById("rental-car-year").value = item.car.year;
  document.getElementById("rental-car-rent-price").value = item.car.rentPrice;
}

function displayCheckReturnForm_Rent(id) {
  document.getElementById("rental-id").value = id;
}

function setRentReturn() {
  let id = document.getElementById("rental-id").value;

  fetch(uriRent + "/return/" + id)
    .then(response => response.json())
    .then(function a(data) {
      callRentTableOpen();
    })
    .catch(error => console.error("Unable to Update Rental.", error));
}

function _displayRentsItems(data, st) {
  data = JSON.stringify(data.responseObject);
  data = JSON.parse(data);

  let tBody;

  if (st == "closed") {
    tBody = document.getElementById("rent-close");
  }
  else {
    tBody = document.getElementById("rent-open");
  }

  tBody.innerHTML = "";
  _displayRentCount(data.length);

  data.forEach(item => {
    let tr = tBody.insertRow();
    let btn;
    let txt;

    let td1 = tr.insertCell(0);
    btn = document.createElement("a");
    btn.href = "#showClientModal";
    btn.setAttribute("onclick", `displayClientModal(${item.rental.id})`);
    btn.setAttribute("data-toggle", "modal");
    btn.innerHTML = "<span>" + item.client.name + "</span>";
    td1.appendChild(btn);

    let td2 = tr.insertCell(1);
    btn = document.createElement("a");
    btn.href = "#showEmployeeModal";
    btn.setAttribute("onclick", `displayEmployeeModal(${item.rental.id})`);
    btn.setAttribute("data-toggle", "modal");
    btn.innerHTML = "<span>" + item.employee.name + "</span>";
    td2.appendChild(btn);

    let td3 = tr.insertCell(2);
    btn = document.createElement("a");
    btn.href = "#showCarModal";
    btn.setAttribute("onclick", `displayCarModal(${item.rental.id})`);
    btn.setAttribute("data-toggle", "modal");
    btn.innerHTML = "<span>" + item.car.model + "</span>";
    td3.appendChild(btn);

    let td4 = tr.insertCell(3);
    txt = document.createTextNode(item.rental.dailyCost);
    td4.appendChild(txt);

    let td5 = tr.insertCell(4);
    txt = document.createTextNode(item.rental.discount);
    td5.appendChild(txt);

    let td6 = tr.insertCell(5);
    txt = document.createTextNode(item.rental.dateWithdrawal);
    td6.appendChild(txt);

    let td7 = tr.insertCell(6);
    txt = document.createTextNode(item.rental.expectedReturnDate);
    td7.appendChild(txt);
    if (st == "closed") {
      let td8 = tr.insertCell(7);
      txt = document.createTextNode(item.rental.effectiveReturnDate);
      td8.appendChild(txt);
    }
    else {
      let td8 = tr.insertCell(7);
      btn = document.createElement("a");
      btn.href = "#checkReturnRent";
      btn.className = "create";
      btn.setAttribute("onclick", `displayCheckReturnForm_Rent(${item.rental.id})`);
      btn.setAttribute("data-toggle", "modal");
      btn.innerHTML =
        "<i class='material-icons' data-toggle='tooltip' title='Check'>&#xe86c;</i>";
      td8.appendChild(btn);
    }
  });

  rents = data;
}
