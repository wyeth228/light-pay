export default function amountFormat(amount) {
  amount = amount.toString().split("").filter((char) => char !== " ").join("");
  
  if (amount.length === 8) {
    return `${amount[0]+amount[1]} ${amount[2]+amount[3]+amount[4]} ${amount[5]+amount[6]+amount[7]}`;
  } else if (amount.length === 7) {
    return `${amount[0]} ${amount[1]+amount[2]+amount[3]} ${amount[4]+amount[5]+amount[6]}`;
  } else if (amount.length === 6) {
    return `${amount[0]+amount[1]+amount[2]} ${amount[3]+amount[4]+amount[5]}`;
  } else if (amount.length === 5) {
    return `${amount[0]+amount[1]} ${amount[2]+amount[3]+amount[4]}`;
  } else if (amount.length === 4) {
    return `${amount[0]} ${amount[1]+amount[2]+amount[3]}`;
  } else if (amount.length === 3) {
    return `${amount[0]+amount[1]+amount[2]}`;
  } else {
    return amount;
  }
}