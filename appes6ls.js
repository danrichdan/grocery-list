// Item Class with Constructor
class Item {
  constructor(item, isChecked) {
    this.item = item;
    this.isChecked = isChecked;
  }
}

// UI Class and Methods
class UI {
  // Add Item to DOM
  addItem(item) {
    const list = document.getElementById("grocery-list");
    const listItem = document.createElement("li");
    listItem.innerHTML = `<input type="checkbox" class="need"/>${item.item}<a href="#" class="delete">X</a>`;
    list.appendChild(listItem);
  }

  // Add Item to the Have List
  haveItem(item) {
    const list = document.getElementById("have-list");
    const listItem = document.createElement("li");
    listItem.className = "have";
    listItem.innerHTML = `<input type="checkbox" class="need" checked/>${item.item}<a href="#" class="delete">X</a>`;
    list.appendChild(listItem);
  }

  // Clear the Form Field
  clearField() {
    document.getElementById("grocery").value = "";
  }

  // Show Alert
  showAlert(message, className) {
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
  }

  // Delete Item from DOM
  deleteItem(target) {
    if (target.className === "delete") {
      target.parentElement.remove();
      this.showAlert("Grocery Item Removed!", "success");
      Store.removeItem(target);
    }
  }

  // Check the checkbox, remove item list, add to have list
  checkCheckbox(target) {
    if (target.className === "need") {
      const li = target.parentElement;
      const haveList = document.getElementById("have-list");
      li.remove();
      this.showAlert("Item Moved To Have List", "success");
      haveList.appendChild(li);
      li.className = "have";
    }
  }

  // Uncheck, remove item from have list add to list
  uncheckCheckbox(target) {
    if (target.className === "need") {
      const li = target.parentElement;
      const groceryList = document.getElementById("grocery-list");
      li.remove();
      this.showAlert("Item Added Back to List", "success");
      li.classList.remove("have");
      groceryList.appendChild(li);
    }
  }
}

// Local Storage Class and Functions
class Store {
  // Get Items from LS
  static getItems() {
    let items;
    if (localStorage.getItem("items") === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem("items"));
    }
    return items;
  }

  // Display items from LS
  static displayItems() {
    const items = Store.getItems();

    items.forEach(function (item) {
      const ui = new UI();

      if (!item.isChecked) {
        ui.addItem(item);
      } else {
        ui.haveItem(item);
      }
    });
  }

  // Add Item to LS
  static addItemToStorage(item) {
    const items = Store.getItems();

    items.push(item);

    localStorage.setItem("items", JSON.stringify(items));
  }

  // Update Item in LS
  static updateItem(target) {
    const itemText = target.parentElement.textContent.substr(
      0,
      target.parentElement.textContent.length - 1
    );

    const items = Store.getItems();

    items.forEach(function (item, index) {
      if (item.item === itemText) {
        items[index].isChecked
          ? (items[index].isChecked = false)
          : (items[index].isChecked = true);
      }
    });

    localStorage.setItem("items", JSON.stringify(items));
  }

  // Remove Item from LS
  static removeItem(target) {
    const items = Store.getItems();

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
  }
}

// DOM Load Event Listener
document.addEventListener("DOMContentLoaded", Store.displayItems);

// Add Grocery Event Listener
document
  .getElementById("grocery-form")
  .addEventListener("submit", function (e) {
    const groceryItem = document.getElementById("grocery").value;

    const item = new Item(groceryItem, false);

    // Instantiate the UI
    const ui = new UI();

    if (item === "") {
      ui.showAlert("Please add a grocery item", "danger");
    } else {
      ui.addItem(item);
      Store.addItemToStorage(item);
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
  Store.updateItem(e.target);
});

// Event Listener for Unchecking
document.getElementById("have-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.deleteItem(e.target);
  ui.uncheckCheckbox(e.target);
  Store.updateItem(e.target);
});
