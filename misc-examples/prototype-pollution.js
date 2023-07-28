function shallowClone(obj) {
  const clone = {};
  for (let key of Object.keys(obj)) {
    clone[key] = obj[key];
  }
  return clone;
}

const request = '{"user":"tlhunter","__proto__":{"isAdmin":true}}';
const obj = JSON.parse(obj);

if ("isAdmin" in obj) {
  throw new Error("cannot specify isAdmin");
}

const user = shallowClone(obj);
console.log(user.isAdmin); // true
