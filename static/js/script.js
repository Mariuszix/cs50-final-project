// Select formular
const formElem = document.querySelector("#formElem");

// Select table
const table = document.querySelector("#list-entries");

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
//Encryption key
const secret = "716238912387121sdads683";

let crypt = {
  secret,
  encrypt: function (clear) {
    // encrypt() : encrypt the given clear text

    let cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
    cipher = cipher.toString();
    return cipher;
  },

  decrypt: function (cipher) {
    // decrypt() : decrypt the given cipher text

    let decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
    decipher = decipher.toString(CryptoJS.enc.Utf8);
    return decipher;
  },
};

// TEST - ENCRYPT
let cipher = crypt.encrypt("FOO BAR");
console.log(cipher);

// TEST - DECRYPT
let decipher = crypt.decrypt(cipher);
console.log(decipher);
