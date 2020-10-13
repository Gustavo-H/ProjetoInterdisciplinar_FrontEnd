const uriCars = "http://localhost:8080/car-rent/cars";
let cars = [];
let carsEdit = [];

function getCarItems() {  
  /*axios.get('http://localhost:8080/car-rent/cars/all')
  .then((response) => {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
    displayItems(data);
  });*/

  fetch(uriCars + "/all")
    .then(response => response.json())
    .then(data => _displayCarItems(data))
    .catch(error => console.error("Unable to get Cars.", error));

  fetch(uriCars + "/all/edit")
  .then(response => response.json())
  .then(function a(data) {
    data = JSON.stringify(data.responseObject);
    data = JSON.parse(data);
    carsEdit = data;
  })
  .catch(error => console.error("Unable to get Cars.", error));
}

function addCarItem() {
  const brandInputText = document.getElementById("add-car-brand");
  const modelInputText = document.getElementById("add-car-model");
  const yearInputText = document.getElementById("add-car-year");
  const carPlateInputText = document.getElementById("add-car-plate");
  const colorInputText = document.getElementById("add-car-color");
  const group = document.getElementById("add-car-group");
  const dailyCost = document.getElementById("add-car-daily-cost");
  const item = {
    brand: parseInt(brandInputText.value.trim()),
    model: modelInputText.value.trim(),
    year: parseInt(yearInputText.value.trim()),
    carPlate: carPlateInputText.value.trim(),
    color: parseInt(colorInputText.value.trim()),
    group: parseInt(group.value.trim()),
    rentPrice: parseFloat(dailyCost.value.trim())
  };

  fetch(uriCars, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(response => response.json())
    .then(() => {
      getCarItems();
      brandInputText.value = "";
      modelInputText.value = "";
      yearInputText.value = "";
      carPlateInputText.value = "";
      colorInputText.value = "";
      group.value = "";
      dailyCost.value = "";
    })
    .catch(error => console.error("Unable to add Car.", error));
}

function deleteCarItem() {
  const itemId = document.getElementById("delete-car-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    deletedBy: currentUser
  };
  console.log(item);
  fetch(`${uriCars}/delete`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getCarItems())
    .catch(error => console.error("Unable to Delete Car.", error));
}

function displayDeleteForm_Car(id) {
  const item = cars.find(item => item.id === id);
  document.getElementById("delete-car-id").value = item.id;
}

function displayEditForm_Car(id) {
  const item = carsEdit.find(item => item.id === id);

  document.getElementById("edit-car-id").value = item.id;
  document.getElementById("edit-car-brand").value = item.brand;
  document.getElementById("edit-car-model").value = item.model;
  document.getElementById("edit-car-year").value = item.year;
  document.getElementById("edit-car-plate").value = item.carPlate;
  document.getElementById("edit-car-color").value = item.color;
  document.getElementById("edit-car-group").value = item.group;
  document.getElementById("edit-car-daily-cost").value = item.rentPrice;
}

function updateCarItem() {
  const itemId = document.getElementById("edit-car-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    brand: parseInt(document.getElementById("edit-car-brand").value.trim()),
    model: document.getElementById("edit-car-model").value.trim(),
    year: parseInt(document.getElementById("edit-car-year").value.trim()),
    carPlate: document.getElementById("edit-car-plate").value.trim(),
    color: parseInt(document.getElementById("edit-car-color").value.trim()),
    group: parseInt(document.getElementById("edit-car-group").value.trim()),
    rentPrice: parseFloat(document.getElementById("edit-car-daily-cost").value.trim())
  };

  fetch(`${uriCars}/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  })
    .then(() => getCarItems())
    .catch(error => console.error("Unable to update item.", error));

  return false;
}

function _displayCount(itemCount) {
  const name = itemCount === 1 ? "entry" : "entries";
  document.getElementById(
    "counter"
  ).innerHTML = `Showing <b>${itemCount}</b> ${name}`;
}

function _displayCarItems(data) {
  data = JSON.stringify(data.responseObject);
  data = JSON.parse(data);
  
  const tBody = document.getElementById("cars");
  tBody.innerHTML = "";
  _displayCount(data.length);
  const button = document.createElement("button");

  data.forEach(item => {
    let editButton = document.createElement("a");
    editButton.href = "#editCarModal";
    editButton.className = "edit";
    editButton.setAttribute("onclick", `displayEditForm_Car(${item.id})`);
    editButton.setAttribute("data-toggle", "modal");
    editButton.innerHTML =
      "<i class='material-icons' data-toggle='tooltip' title='Edit'>&#xE254;</i>";

    let deleteButton = document.createElement("a");
    deleteButton.href = "#deleteCarModal";
    deleteButton.className = "delete";
    deleteButton.setAttribute("onclick", `displayDeleteForm_Car(${item.id})`);
    deleteButton.setAttribute("data-toggle", "modal");
    deleteButton.innerHTML =
      "<i class='material-icons' data-toggle='tooltip' title='Delete'>&#xE872;</i>";

    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    let textBrand = document.createTextNode(item.brand);

    td1.appendChild(textBrand);

    let td2 = tr.insertCell(1);
    let textModel = document.createTextNode(item.model);
    td2.appendChild(textModel);

    let td3 = tr.insertCell(2);
    let textYear = document.createTextNode(item.year);
    td3.appendChild(textYear);

    let td4 = tr.insertCell(3);
    let textCarPlate = document.createTextNode(item.carPlate);
    td4.appendChild(textCarPlate);

    let td5 = tr.insertCell(4);
    let txtGroup = document.createTextNode(item.group);
    td5.appendChild(txtGroup);

    let td6 = tr.insertCell(5);
    let textColor = document.createTextNode(item.color);
    td6.appendChild(textColor);

    let td7 = tr.insertCell(6);
    let txtCost = document.createTextNode(item.rentPrice);
    td7.appendChild(txtCost);

    let td8 = tr.insertCell(7);
    td8.appendChild(editButton);
    td8.appendChild(deleteButton);
  });

  cars = data;
}
