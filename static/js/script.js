// Select formular
const formElem = document.querySelector("#formElem");

// Select table
const table = document.querySelector("#list-entries");
const tableBody = document.querySelector("tbody");

// Select the button that generates a random password
const genButton = document.querySelector("#generator");

// Select the password field
const passField = document.querySelector("#password");

//Select the search bar
const search = document.querySelector("#search-bar");

//Select the new-entry button
const newEntry = document.querySelector("#add-entry");

if (newEntry) {
  newEntry.addEventListener("click", () => {
    formElem.classList.remove("is-hidden");
  });
}

//Search in the page
let searchResults;
if (search) {
  search.addEventListener("keyup", () => {
    //Clear the Results
    if (searchResults) {
      searchResults.innerHTML = "";
    }
    // Minimum 2 letters for the search to happen
    if (search.value.length > 1) {
      const toDisplay = [];
      let timeoutId;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(function () {
        let names = document.querySelectorAll(".name-search");
        let links = document.querySelectorAll(".link-search");

        //loop over the Name row
        for (let i = 0; i < names.length; i++) {
          // If you find the search string in the name
          if (
            names[i].innerHTML
              .toLowerCase()
              .includes(search.value.toLowerCase()) ||
            links[i].innerHTML
              .toLowerCase()
              .includes(search.value.toLowerCase())
          ) {
            //Add the row where the name was found.
            if (!toDisplay.includes([table.rows[i + 1].innerHTML])) {
              toDisplay.push([table.rows[i + 1].innerHTML]);
            }
          }
        }

        //Add results on the page
        searchResults = document.querySelector("#search-results");

        if (toDisplay.length > 0) {
          searchResults.innerHTML = "";
          for (let i = 0; i < toDisplay.length; i++) {
            searchResults.innerHTML += `<div><td>${toDisplay[i]}</td></div>`;
            if (!search.value) {
              searchResults.innerHTML = "";
            }
          }
        } else {
          searchResults.innerHTML = "No results Found";
        }
      }, 500);
    }
  });
}

//If we are on the index page where #formElem is.
if (formElem) {
  //When the new entry is submited
  formElem.onsubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    //Select all the input from the user and encrypt the password
    const name = document.querySelector("#name").value;
    const link = document.querySelector("#link").value;
    const username = document.querySelector("#username").value;
    const password = crypt.encrypt(document.querySelector("#password").value);

    //Add everything to data
    data.append("name", name);
    data.append("link", link);
    data.append("username", username);
    data.append("password", password);

    //Send the info to the back-end
    let response = await fetch("/", {
      method: "POST",
      body: data,
    });

    //Check if the new entry already exist in the DB.
    if (response.status == 409) {
      alert("The Website or the link exists already in the database!");
    }

    //If everything was fine in Flask clear the inputs
    if (response.status == 202) {
      document.querySelector("#name").value = "";
      document.querySelector("#link").value = "";
      document.querySelector("#username").value = "";
      document.querySelector("#password").value = "";

      // Reload the page after any first entry.
      location.reload();

      //Add the new entry in the view.
      formElem.classList.add("is-hidden");
    }
  };
}

//Listen to the "generate" button and generate random password when clicked.
if (genButton) {
  genButton.addEventListener("click", function () {
    let password = generatePass(18);
    const passField2 = document.querySelector("#password2");
    if (passField2) {
      passField2.innerHTML = password;
    }

    passField.value = password;
  });
}

//Function to run when the password button is clicked
function htmlActivate(elm) {
  let passwordX = crypt.decrypt(elm.querySelector(".is-hidden").innerHTML);

  changeText = () => {
    elm.outerHTML = `<p id="password2">${passwordX}</p>`;
  };
  //Check password
  pw_prompt({
    lm: "Please enter your password:",
    callback: function (password) {
      if (rx === password) {
        response = true;
        changeText();
      } else {
        response = false;
        alert("password not good!");
      }
    },
  });
}

//Create a new <tr> in the table.
function updateTable(name, link, username, password) {
  return `
      <tr>
        <td class="name-search">${name}</td>
        <td> <a class="link-search" target="_blank" href="${link}">${link}</a></td>
        <td><p>${username}</p></td>
        <td class="password-td"><button onclick="htmlActivate(this)">Reveal Password <p class="is-hidden">${password}</p></button> </td>
      </tr>
    `;
}

makeRequests = async (data) => {
  return (response = await fetch("/edit", {
    method: "POST",
    body: JSON.stringify(data),
  }));
};

combineArrays = (first, second) => {
  return first.reduce((acc, val, ind) => {
    acc[val] = second[ind];
    return acc;
  }, {});
};

// Inspired and helped by "The Codeholic" youtube channel.
// class that helps edit cells
class TableCellEditing {
  constructor(table) {
    this.tbody = table.querySelector("tbody");
  }

  init() {
    this.tds = this.tbody.querySelectorAll("td");
    this.tds.forEach((td) => {
      if (td.getAttribute("contenteditable")) {
        td.setAttribute("contenteditable", false);
      } else {
        td.setAttribute("contenteditable", true);
      }

      td.addEventListener("click", (ev) => {
        if (!this.inEditing(td)) {
          this.startEditing(td);
        }
      });
    });
  }

  startEditing(td) {
    const activeTd = this.findEditing();
    if (activeTd) {
      this.cancelEditing(activeTd);
    }

    td.className = "in-editing";
    td.setAttribute("data-old-value", td.innerHTML);
    this.createButtonToolbar(td);
  }

  cancelEditing(td) {
    td.innerHTML = td.getAttribute("data-old-value");
    td.classList.remove("in-editing");
  }

  finishEditing(td) {
    td.classList.remove("in-editing");
    const data = {};

    let elm = td.parentElement.children;
    let id = elm[0].getAttribute("data-entry-id");
    let name = elm[0].innerHTML;
    let link = elm[1].querySelector("a").innerHTML;
    let username = elm[2].querySelector("p").innerText;
    let hash;
    //If password was not changed
    if (elm[3].querySelector(".is-hidden")) {
      console.log("not changed")
      hash = elm[3].querySelector(".is-hidden").innerHTML;
    }
    //If password was changed
    else {
      hash = crypt.encrypt(elm[3].querySelector("#password2").innerHTML);
      
    }

    let keys = ["id", "name", "link", "username", "hash"];
    let values = [id, name, link, username, hash];

    for (let i = 0; i < keys.length; i++) {
      data[keys[i]] = values[i];
    }

    const response = makeRequests(data);
    console.log(response);

    this.removeToolbar(td);
  }

  inEditing(td) {
    return td.classList.contains("in-editing");
  }

  createButtonToolbar(td) {
    const toolbar = document.createElement("div");
    toolbar.className = "button-toolbar";
    toolbar.setAttribute("contenteditable", false);

    toolbar.innerHTML = `
    <div class="button-wrapper">
    <button class="btn-save">Save</button>
    </div>
    `;

    td.appendChild(toolbar);

    const btnSave = toolbar.querySelector(".btn-save");

    btnSave.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.finishEditing(td);
    });
  }

  removeToolbar(td) {
    const toolbar = td.querySelector(".button-toolbar");
    toolbar.remove();
  }

  findEditing() {
    return Array.prototype.find.call(this.tds, (td) => this.inEditing(td));
  }
}

if (document.querySelector("table")) {
  const editing = new TableCellEditing(document.querySelector("table"));
  const editingMode = document.querySelector("#edit-mode");
  editingMode.addEventListener("click", () => {
    editing.init();
  });
}
