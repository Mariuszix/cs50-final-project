// Generate encryption key from password

      const password = new buffer.SlowBuffer("anyPassword".normalize('NFKC'));
      const salt = new buffer.SlowBuffer("SalyAndPepper".normalize('NFKC'));
 
      const N = 1024, r = 8, p = 1;
      const dkLen = 32;
 
      function updateInterface(progress) {
          document.getElementById("progress").textContent = Math.trunc(100 * progress);
      }
 
      // Async
      const keyPromise = scrypt.scrypt(password, salt, N, r, p, dkLen, updateInterface);
 
      keyPromise.then(function(key) {
          console.log("Derived Key (async): ", key);
      });
 


// Generate AES Encryption
AES_Init();

const key = new Array(16);
for (let i = 0; i < 32; i++) key[i] = i;

const text = "MArius123";

const block = [];


// Text to block of ASCII codes

for (letter of text){
  block.push(letter.charCodeAt(0))
}
console.log(block)




AES_ExpandKey(key);
AES_Encrypt(block, key);

console.log(key);
console.log(block);
AES_Decrypt(block, key);
console.log(key);
console.log(block);

// From ASCII code back to string
const textDecrypt = function() {
  const block1 = [];
  for (l of block) {
    if (l > 0) {
      block1.push(String.fromCharCode(l))
    }
  }
  return block1;
}

textDecrypted = textDecrypt();

console.log(textDecrypted.toString().replace(/,/g, ''));

AES_Done();
