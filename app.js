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
  listItem.innerHTML = `
    <li>
        <input type="checkbox" class="need"/> 
        ${item} 
        <a href="#" class="delete">X</a>
    </li>
  `;
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
  }
};

// Add Grocery Event Listener
document
  .getElementById("grocery-form")
  .addEventListener("submit", function (e) {
    const item = document.getElementById("grocery").value;

    // Instantiate the UI
    const ui = new UI();

    ui.addItem(item);
    ui.clearField();
    e.preventDefault();
  });

// Event Listener for Delete
document.getElementById("grocery-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.deleteItem(e.target);
  e.preventDefault();
});
