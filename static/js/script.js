// Select formular
const formElem = document.querySelector("#formElem");

// Select table
const table = document.querySelector("#list-entries");

// Select the button that generates a random password
const genButton = document.querySelector("#generator");

// Select the passwrod field
const passField = document.querySelector("#password");

function revealPass() {
  const copyText = document.querySelector("#username");
  copyText.querySelector();
  copyText.setSelectionRange(0, 999999); //For mobile
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
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
      table.innerHTML += updateTable(name, link, username);
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

//Create a new <tr> in the table.
function updateTable(name, link, username) {
  return `
      <tr>
        <td>${name}</td>
        <td>${link}</td>
        <td>${username}</td>
        <td>********</td>
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
