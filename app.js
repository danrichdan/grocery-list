// Grocery Item Constructor
function Item(item) {
  this.item = item;
}

// UI Constructor
function UI() {}

// Add Item Prototype
UI.prototype.addItem = function (item) {
  const list = document.getElementById("grocery-list");
  const listItem = document.createElement("li");
  listItem.innerHTML = `<input type="checkbox" class="need"/> ${item} <a href="#" class="delete">X</a>`;
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

// Add Grocery Event Listener
document
  .getElementById("grocery-form")
  .addEventListener("submit", function (e) {
    const item = document.getElementById("grocery").value;

    // Instantiate the UI
    const ui = new UI();

    if (item === "") {
      ui.showAlert("Please add a grocery item", "danger");
    } else {
      ui.addItem(item);
      ui.showAlert("Grocery Item Added!", "success");
      ui.clearField();
    }
    e.preventDefault();
  });

// Event Listener for Delete and Checking Item
document.getElementById("grocery-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.deleteItem(e.target);
  ui.checkCheckbox(e.target);
});

// Event Listener for Unchecking
document.getElementById("have-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.deleteItem(e.target);
  ui.uncheckCheckbox(e.target);
});
