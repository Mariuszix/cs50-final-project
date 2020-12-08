// Select formular
const formElem = document.querySelector("#formElem");

// Select table
const table = document.querySelector("#list-entries");

// Select the button that generates a random password
const genButton = document.querySelector("#generator");

// Select the password field
const passField = document.querySelector("#password");

// If there are password fields around, please event listener on them to be able to reveal passwords
//After checking the password.

function tableText() {
  let passwordX = crypt.decrypt(this.querySelector(".is-hidden").innerHTML);

  changeText = () => {
    this.innerHTML = `<p>${passwordX}<p>`;
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

let cells = document.querySelectorAll(".password-td");

for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", tableText);
}

function functioForHtml() {
  tableText();
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

//Listen to the generate button and generate password when clicked.
if (genButton) {
  genButton.addEventListener("click", function () {
    let password = generatePass(18);
    passField.value = password;
  });
}

//For the new html created @ TO REFACTOR
function htmlActivate(elm) {
  let passwordX = crypt.decrypt(elm.querySelector(".is-hidden").innerHTML);

  changeText = () => {
    elm.innerHTML = `<p>${passwordX}<p>`;
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
// Encrypt user's password and store it in a variable to be user later on.

// // TEST - ENCRYPT
// let cipher = crypt.encrypt("FOO BAR");
// // console.log(cipher);

// // TEST - DECRYPT
// let decipher = crypt.decrypt(cipher);
// // console.log(decipher);
