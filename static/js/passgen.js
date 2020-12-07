function generatePass(length) {
  let numbers = "";

  for (let i = 0; i < length; i++) {
    // Generate a number from 33 to 126 (0 - 93) + 33
    let nr = Math.floor(Math.random() * 93) + 33;
    if (nr !== parseFloat(numbers[i - 1])) {
      numbers += String.fromCharCode(nr);
    } else {
      if (nr < 34) {
        numbers += String.fromCharCode(nr + 1);
      } else {
        numbers += String.fromCharCode(nr - 1);
      }
    }
  }
  return numbers;
}
