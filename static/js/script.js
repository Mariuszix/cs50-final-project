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

//Select the edit and delete button
let edits = document.querySelectorAll(".edit-button");

let deleteButtons = document.querySelectorAll(".delete-button");

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
  return true;
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

//Change td to inputs ready for editing
function trToInput(elm) {
  let theInput = document.createElement("input");
  theInput.classList.add("artificial-input");
  theInput.value = elm.innerText;
  elm.parentNode.insertBefore(theInput, elm);
  elm.classList.add("is-hidden");
}

//Change inputs back to td
function inputToTd(elm, data) {
  let inputField = elm.parentNode.querySelector(".artificial-input");
  elm.innerHTML = data;
  inputField.remove();
  elm.classList.remove("is-hidden");
}

//In this section the editing and deleting of the entries will be handle.
function activateEditDelete() {
  edits = document.querySelectorAll(".edit-button");
  deleteButtons = document.querySelectorAll(".delete-button");
  //For edit
  edits.forEach((edit) => {
    edit.addEventListener("click", function () {
      let row = this.parentElement.parentElement;
      //Ask fot the password and reveal password
      let passButt = row.querySelector(".reveal-button");
      if (passButt) {
        alert("You must reveal the password before editing the entry");
      } else {
        //Select all the data fields to be changed into inputs.
        let name = row.querySelector(".name-search");
        let link = row.querySelector(".link-search");
        let username = row.querySelector(".username-td");
        let password = row.querySelector(".password-td");
        let editButton = row.querySelector(".edit-button");
        let delButton = row.querySelector(".delete-button");
        let saveButton = row.querySelector(".save-button");
        let canButton = row.querySelector(".cancel-button");

        //Name
        trToInput(name);
        //Link
        trToInput(link);
        //username
        trToInput(username);
        //password
        trToInput(password);

        //Hide edit and delete buttons and show save and cancel
        editButton.classList.add("is-hidden");
        delButton.classList.add("is-hidden");
        saveButton.classList.remove("is-hidden");
        canButton.classList.remove("is-hidden");

        //Save the old data in the inputs before adding a event listener
        const oldData = {};

        oldData["name"] = name.innerText.trim();
        oldData["link"] = link.innerText.trim();
        oldData["username"] = username.innerText.trim();
        oldData["password"] = password.innerText.trim();
        //Spaces not allowed in the begining or end of password

        //In case the cancel is pressed
        canButton.addEventListener("click", () => {
          //Make all the inputs back "td" with the old values
          //Name
          inputToTd(name, oldData["name"]);
          //Link
          inputToTd(link, oldData["link"]);
          //username
          inputToTd(username, oldData["username"]);
          //password
          inputToTd(password, oldData["password"]);

          //Hide edit and delete buttons and show save and cancel
          editButton.classList.remove("is-hidden");
          delButton.classList.remove("is-hidden");
          saveButton.classList.add("is-hidden");
          canButton.classList.add("is-hidden");
        });

        //When the save button is pressed
        saveButton.addEventListener("click", async () => {
          const dataEdited = {};
          row = this.parentElement.parentElement;

          //Get the data from the inputs and back it in an object
          let id = row
            .querySelector(".name-search")
            .getAttribute("data-entry-id");

          name = row.querySelector(".artificial-input").value;
          inputToTd(row.querySelector(".name-search"), name);

          link = row.querySelector(".artificial-input").value;
          inputToTd(row.querySelector(".link-search"), link);

          username = row.querySelector(".artificial-input").value;
          inputToTd(row.querySelector(".username-td"), username);

          password = crypt.encrypt(
            row.querySelector(".artificial-input").value
          );
          inputToTd(
            row.querySelector(".password-td"),
            row.querySelector(".artificial-input").value
          );

          dataEdited["id"] = id;
          dataEdited["name"] = name;
          dataEdited["link"] = link;
          dataEdited["username"] = username;
          dataEdited["hash"] = password;

          let response = await fetch("/edit", {
            method: "POST",
            body: JSON.stringify(dataEdited),
          });

          if (response.status == 200) {
            console.log("succesfull");
            location.reload();
          } else {
            alert("Error");
          }
        });
      }
    });
  });

  //For delete
  deleteButtons.forEach((but) => {
    but.addEventListener("click", async function () {
      //First prompt the user for confirmation of deletion and password

      // @TODO

      //Get the entry id that needs to be used to delete the entry in DB
      let row = this.parentElement.parentElement;
      let name = row.querySelector("td");
      let entryId = name.getAttribute("data-entry-id");

      //Send the Id to the back
      let response = await fetch("/delete", {
        method: "POST",
        body: JSON.stringify(entryId),
      });
      if (response.status == 200) {
        console.log("Succesfully deleted");
        // Reload the page
        location.reload();
      } else {
        console.log("Error deleting, code not 200");
      }
    });
  });
}

if (deleteButtons) {
  activateEditDelete();
}
