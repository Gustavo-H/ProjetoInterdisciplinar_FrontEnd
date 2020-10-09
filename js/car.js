const uriCars = "http://localhost:8080/car-rent/cars";
let cars = [];

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
}

function addCarItem() {
  const brandInputText = document.getElementById("add-car-brand");
  const modelInputText = document.getElementById("add-car-model");
  const yearInputText = document.getElementById("add-car-year");
  const carPlateInputText = document.getElementById("add-car-plate");
  const colorInputText = document.getElementById("add-car-color");

  const item = {
    brand: brandInputText.value.trim(),
    model: modelInputText.value.trim(),
    year: yearInputText.value.trim(),
    carPlate: carPlateInputText.value.trim(),
    color: parseInt(colorInputText.value.trim())
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
    })
    .catch(error => console.error("Unable to add Car.", error));
}

function deleteCarItem() {
  const itemId = document.getElementById("delete-car-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    deletedBy: 1
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
  const item = cars.find(item => item.id === id);
  document.getElementById("edit-car-id").value = item.id;
  document.getElementById("edit-car-brand").value = item.brand;
  document.getElementById("edit-car-model").value = item.model;
  document.getElementById("edit-car-year").value = item.year;
  document.getElementById("edit-car-plate").value = item.carPlate;
  document.getElementById("edit-car-color").value = item.color;
}

function updateCarItem() {
  const itemId = document.getElementById("edit-car-id").value.trim();
  const item = {
    id: parseInt(itemId, 10),
    brand: document.getElementById("edit-car-brand").value.trim(),
    model: document.getElementById("edit-car-model").value.trim(),
    year: document.getElementById("edit-car-year").value.trim(),
    carPlate: document.getElementById("edit-car-plate").value.trim(),
    color: parseInt(document.getElementById("edit-car-color").value.trim())
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
    let textColor = document.createTextNode(item.color);
    td5.appendChild(textColor);

    let td6 = tr.insertCell(5);
    td6.appendChild(editButton);
    td6.appendChild(deleteButton);
  });

  cars = data;
}
