// Grocery Item Constructor
function Item(item, isChecked) {
  this.item = item;
  this.isChecked = isChecked;
}

// UI Constructor
function UI() {}

// Add Item Prototype
UI.prototype.addItem = function (item) {
  const list = document.getElementById("grocery-list");
  const listItem = document.createElement("li");
  listItem.innerHTML = `<input type="checkbox" class="need"/>${item.item}<a href="#" class="delete">X</a>`;
  list.appendChild(listItem);
};

UI.prototype.haveItem = function (item) {
  const list = document.getElementById("have-list");
  const listItem = document.createElement("li");
  listItem.className = "have";
  listItem.innerHTML = `<input type="checkbox" class="need" checked/>${item.item}<a href="#" class="delete">X</a>`;
  list.appendChild(listItem);
};

// Clear Field Prototype
UI.prototype.clearField = function () {
  document.getElementById("grocery").value = "";
};

// Delete Item Prototype
UI.prototype.deleteItem = function (target) {
  if (target.className === "delete") {
    target.parentElement.remove();
    this.showAlert("Grocery Item Removed!", "success");
    const store = new Store();
    store.removeItem(target);
  }
};

UI.prototype.showAlert = function (message, className) {
  // Create div, add classes, and message text
  const div = document.createElement("div");
  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(message));

  // Insert into DOM
  const container = document.querySelector(".container");
  const form = document.querySelector("form");
  container.insertBefore(div, form);

  // Give it a time limit
  setTimeout(function () {
    document.querySelector(".alert").remove();
  }, 2000);
};

// Check Checkbox Prototype
UI.prototype.checkCheckbox = function (target) {
  if (target.className === "need") {
    const li = target.parentElement;
    const haveList = document.getElementById("have-list");
    li.remove();
    this.showAlert("Item Moved To Have List", "success");
    haveList.appendChild(li);
    li.className = "have";
  }
};

// Uncheck Checkbox Prototype
UI.prototype.uncheckCheckbox = function (target) {
  if (target.className === "need") {
    const li = target.parentElement;
    const groceryList = document.getElementById("grocery-list");
    li.remove();
    this.showAlert("Item Added Back to List", "success");
    li.classList.remove("have");
    groceryList.appendChild(li);
  }
};

// Store constructor for Local Storage
function Store() {}

// Get Items from LS
Store.prototype.getItems = function () {
  let items;
  if (localStorage.getItem("items") === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem("items"));
  }
  return items;
};

// Display Items from LS
Store.prototype.displayItems = function () {
  const store = new Store();
  const items = store.getItems();
  items.forEach(function (item) {
    const ui = new UI();

    if (!item.isChecked) {
      ui.addItem(item);
    } else {
      ui.haveItem(item);
    }
  });
};

// Add Items to LS
Store.prototype.addItemToStorage = function (item) {
  const store = new Store();
  const items = store.getItems();

  items.push(item);

  localStorage.setItem("items", JSON.stringify(items));
};

// Update Item in LS
Store.prototype.updateItem = function (target) {
  const itemText = target.parentElement.textContent.substr(
    0,
    target.parentElement.textContent.length - 1
  );
  const store = new Store();
  const items = store.getItems();

  items.forEach(function (item, index) {
    if (item.item === itemText) {
      items[index].isChecked
        ? (items[index].isChecked = false)
        : (items[index].isChecked = true);
    }
  });

  localStorage.setItem("items", JSON.stringify(items));
};

// Remove Items from LS
Store.prototype.removeItem = function (target) {
  const store = new Store();
  const items = store.getItems();

  const itemText = target.parentElement.textContent.substr(
    0,
    target.parentElement.textContent.length - 1
  );

  items.forEach(function (item, index) {
    if (item.item === itemText) {
      items.splice(index, 1);
    }
    localStorage.setItem("items", JSON.stringify(items));
  });
};

// DOM Loaded Event Listener
document.addEventListener("DOMContentLoaded", function () {
  const store = new Store();
  store.displayItems();
});

// Add Grocery Event Listener
document
  .getElementById("grocery-form")
  .addEventListener("submit", function (e) {
    const groceryItem = document.getElementById("grocery").value;

    const item = new Item(groceryItem, false);

    // Instantiate the UI
    const ui = new UI();

    // Instantiate the Store class
    const store = new Store();

    if (item === "") {
      ui.showAlert("Please add a grocery item", "danger");
    } else {
      ui.addItem(item);
      store.addItemToStorage(item);
      ui.showAlert("Grocery Item Added!", "success");
      ui.clearField();
    }
    e.preventDefault();
  });

// Event Listener for Delete and Checking Item
document.getElementById("grocery-list").addEventListener("click", function (e) {
  const ui = new UI();
  const store = new Store();
  ui.deleteItem(e.target);
  ui.checkCheckbox(e.target);
  store.updateItem(e.target);
});

// Event Listener for Unchecking
document.getElementById("have-list").addEventListener("click", function (e) {
  const ui = new UI();
  const store = new Store();
  ui.deleteItem(e.target);
  ui.uncheckCheckbox(e.target);
  store.updateItem(e.target);
});
