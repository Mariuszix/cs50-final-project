// Select formular
const formElem = document.querySelector("#formElem");

// Select table
const table = document.querySelector("#list-entries");

// Select the button that generates a random password
const genButton = document.querySelector("#generator");

// Select the password field
const passField = document.querySelector("#password");

//Select the search bar
const search = document.querySelector("#search-bar");

//Search in the page
let searchResults;
search.addEventListener("keyup", () => {
  //Clear the Results
  if (searchResults) {
    searchResults.innerHTML = "";
  }

  const toDisplay = [];
  let timeoutId;
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(function () {
    let names = document.querySelectorAll(".name-search");

    //loop over the Name row
    for (let i = 0; i < names.length; i++) {
      // If you find the search string in the name
      if (
        names[i].innerHTML.toLowerCase().includes(search.value.toLowerCase())
      ) {
        //Add the row where the name was found.
        toDisplay.push([table.rows[i + 1].innerHTML]);
      }
    }

    //Add results on the page
    searchResults = document.querySelector("#search-results");
    if (toDisplay.length > 0) {
      for (let i = 0; i < toDisplay.length; i++) {
        searchResults.innerHTML += `<td>${toDisplay[i]}</td>`;
        if (!search.value) {
          searchResults.innerHTML = "";
        }
      }
    } else {
      searchResults.innerHTML = "No results Found";
    }
  }, 700);
});

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
    let result = await response.json();

    //If everything was fine in Flask clear the inputs
    if (response.ok === true) {
      document.querySelector("#name").value = "";
      document.querySelector("#link").value = "";
      document.querySelector("#username").value = "";
      document.querySelector("#password").value = "";

      //Add the new entry in the view.
      table.innerHTML += updateTable(name, link, username, password);
    }
  };
}

//Listen to the "generate" button and generate random password when clicked.
if (genButton) {
  genButton.addEventListener("click", function () {
    let password = generatePass(18);
    passField.value = password;
  });
}

//Function to run when the password button is clicked
function htmlActivate(elm) {
  let passwordX = crypt.decrypt(elm.querySelector(".is-hidden").innerHTML);

  changeText = () => {
    elm.outerHTML = `<p class="revealed">${passwordX}</p>`;
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
        <td>${name}</td>
        <td>${link}</td>
        <td>${username}</button></td>
        <td class="password-td"><button onclick="htmlActivate(this)">Reveal Password <p class="is-hidden">${password}</p></button> </td>
      </tr>
    `;
}
