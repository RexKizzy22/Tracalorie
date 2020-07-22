// Storage Controller
const StorageCtrl = (function() {
  // Public methods
  return {
    storeItems: function(newItem) {
      let items;
      // Check to see if items in LS
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(newItem);
        // Store item in LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(newItem);
        // Store item in LS
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItems: function() {
      let items;
      // Check to see if items in LS
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    updateItemFromLS: function(updatedItem) {
      items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (item.id === updatedItem.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      // Store item in LS
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromLS: function(selectedItem) {
      items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (item.id === selectedItem.id) {
          items.splice(index, 1);
        }
      });
      // Store item in LS
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromLS: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, meal, calories) {
    this.id = id;
    this.meal = meal;
    this.calories = calories;
  };

  // Data Structure
  const data = {
    items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalories: 0,
  };
  // Public methods
  return {
    addNewItems: function (meal, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create new item
      const newItem = new Item(ID, meal, calories);
      // Add to data structure
      data.items.push(newItem);
      return newItem;
    },
    logData: function () {
      return data;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach((item) => {
        total += parseInt(item.calories);
      });

      data.totalCalories = total;
      return data.totalCalories;
    },
    getItems: function () {
      return data.items;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    updateNewItem: function(meal, calories) {
      calories = parseInt(calories);
      // Fetch items
      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.meal = meal;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteFromDS: function(item) {
      let itemID = item.id;
      // Get all ids
      const ids = data.items.map((item) => {
        return item.id;
      });
      const index = ids.indexOf(itemID);
      // Delete item from items
      data.items.splice(index,1);
    },
    removeAllFromDS: function() {
      data.items = [];
    }
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelector = {
    itemList: "item-list",
    listItems: ".collection-item",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "item-name",
    itemCaloriesInput: "item-calories",
    totalCalories: ".total-calories"
  };
  // Public methods
  return {
    populateList: function (items) {
      // Show list
      document.getElementById(UISelector.itemList).style.display = "block";

      let html = "";

      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.meal}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fa fa-pencil edit-item"></i>
        </a>
      </li>
        `;
      });

      document.getElementById(UISelector.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        meal: document.getElementById(UISelector.itemNameInput).value,
        calories: document.getElementById(UISelector.itemCaloriesInput).value,
      };
    },
    getSelectors: function () {
      return UISelector;
    },
    renderNewItem: function (item) {
      // Show list
      document.getElementById(UISelector.itemList).style.display = "block";
      //Create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.meal}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fa fa-pencil edit-item"></i>
        </a>`;
      // Append li to ul
      const itemList = document.getElementById(UISelector.itemList);
      itemList.insertAdjacentElement("beforeend", li);
    },
    updateNewItem: function(item) {
      // Fetch list item
      let listItems = document.querySelectorAll(UISelector.listItems);
      // From node list to array
      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        const listID = listItem.getAttribute("id");
        if (listID === `item-${item.id}`) {
          document.querySelector(`#${listID}`).innerHTML =
          `<strong>${item.meal}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="fa fa-pencil"></i>
            </a>`;
        }
      });

    },
    removeFromUI: function(item) {
      // Fetch list item
      let listItems = document.querySelectorAll(UISelector.listItems);
      // From node list to array
      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        let id = listItem.getAttribute("id");
        id = id.split("-");
        id = parseInt(id[1]);
        if (item.id === id) {
          listItem.remove();
        }
      });
    },
    clearAllItems: function() {
      // Fetch list item
      let listItems = document.querySelectorAll(UISelector.listItems);
      // From node list to array
      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        listItem.remove();
      });
    },
    hideList: function(){
      document.getElementById(UISelector.itemList).style.display = "none";
    },
    addTotalCalories: function(totalCalories) {
      document.querySelector(UISelector.totalCalories).textContent = totalCalories;
    },
    clearInputFields: function () {
      document.getElementById(UISelector.itemNameInput).value = "";
      document.getElementById(UISelector.itemCaloriesInput).value = "";
    },
    clearEditState: function(){
      UICtrl.clearInputFields();
      document.querySelector(UISelector.updateBtn).style.display = "none";
      document.querySelector(UISelector.deleteBtn).style.display = "none";
      document.querySelector(UISelector.backBtn).style.display = "none";
      document.querySelector(UISelector.addBtn).style.display = "inline";
    },
    createEditState: function(id) {
      // Fetch items
      const data = ItemCtrl.logData();
      // Find matching list items
      data.items.forEach((item) => {
        if (item.id === id) {
          // Set current item
          ItemCtrl.setCurrentItem(item);
          // Set edit clearEditState
          UICtrl.setEditState(item);
        }
      });
    },
    setEditState: function(item) {
      document.getElementById(UISelector.itemNameInput).value = item.meal;
      document.getElementById(UISelector.itemCaloriesInput).value = item.calories;
      document.querySelector(UISelector.updateBtn).style.display = "inline";
      document.querySelector(UISelector.deleteBtn).style.display = "inline";
      document.querySelector(UISelector.backBtn).style.display = "inline";
      document.querySelector(UISelector.addBtn).style.display = "none";
    }
  };
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListener = function () {
    // Get selectors
    const UISelector = UICtrl.getSelectors();

    // Load events
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    const updateBtn = document.querySelector(UISelector.updateBtn);
    const formBtn = document.querySelector(UISelector.addBtn);
    const backBtn = document.querySelector(UISelector.backBtn);
    const deleteBtn = document.querySelector(UISelector.deleteBtn);
    const clearBtn = document.querySelector(UISelector.clearBtn);
    const itemList = document.getElementById(UISelector.itemList);

    formBtn.addEventListener("click", addItems);
    updateBtn.addEventListener("click", updateItemSubmit);
    backBtn.addEventListener("click", UICtrl.clearEditState);
    deleteBtn.addEventListener("click", deleteItem);
    clearBtn.addEventListener("click", clearListItems);
    itemList.addEventListener("click", updateItemSelect);
  }

  // Add new items
  const addItems = function (e) {
    // Get inputs
    const input = UICtrl.getItemInput();
    // Validate inputs
    if (input.meal !== "" && input.calories !== "") {
      // Add new items to data structure
      const newItem = ItemCtrl.addNewItems(input.meal, input.calories);
      // Store in LS
      StorageCtrl.storeItems(newItem);
      // Render new item
      UICtrl.renderNewItem(newItem);
      // Fetch total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.addTotalCalories(totalCalories);
      // Clear input fields
      UICtrl.clearInputFields();
    }
    e.preventDefault();
  }

  // Change form state to update item selected
  const updateItemSelect = function(e) {
    let listID;
    if (e.target.classList.contains("edit-item")) {
      // console.log(e.target);
      // Get list ID
      listID = e.target.parentElement.parentElement.id;
      listID = listID.split("-");
      listID = parseInt(listID[1]);

      // Create edit state
      UICtrl.createEditState(listID);
    }
  }

  // Update item selected in the data structure and UI
  const updateItemSubmit = function(e) {
    // Fetch new inputs
    const input = UICtrl.getItemInput();
    // Get updated items
    const updatedItem = ItemCtrl.updateNewItem(input.meal, input.calories);
    // Update item in UI
    UICtrl.updateNewItem(updatedItem);
    // Update item in LS
    StorageCtrl.updateItemFromLS(updatedItem);
    // Fetch total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.addTotalCalories(totalCalories);
    // Clear edit state
    UICtrl.clearEditState();
  }

  // Delete selected item from UI and LS
  const deleteItem = function() {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete item from data structure
    ItemCtrl.deleteFromDS(currentItem);
    // Delete from UI
    UICtrl.removeFromUI(currentItem);
    // Delete from LS
    StorageCtrl.deleteItemFromLS(currentItem);
    // Fetch total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.addTotalCalories(totalCalories);
    // Clear edit state
    UICtrl.clearEditState();
  }

  // Clear all items from UI and LS
  const clearListItems = function() {
    // Delete all items from DS
    ItemCtrl.removeAllFromDS();
    // Clear all listItems from UI
    UICtrl.clearAllItems();
    // Clear from LS
    StorageCtrl.clearItemsFromLS();
    // Hide UL
    UICtrl.hideList();
    // Fetch total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.addTotalCalories(totalCalories);
  }
  // Public methods
  return {
    init: function () {
      // Clear edit state
      UICtrl.clearEditState();
      // Fetch items from items controller
      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate items
        UICtrl.populateList(items);
      }
      // Fetch total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.addTotalCalories(totalCalories);
      // load event listeners
      loadEventListener();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
