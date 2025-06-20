#!/usr/bin/env node

const COLOURS = {
  key: "\x1B[31m",
  number: "\x1B[32m",
  bool: "\x1B[33m",
  string: "\x1B[34m",
  null: "\x1B[35m",
  colon: "\x1B[37m",
  comma: "\x1B[37m",
  brace: [
    "\x1B[31m",
    "\x1B[32m",
    "\x1B[33m",
    "\x1B[34m",
    "\x1B[35m",
    "\x1B[36m",
  ],
};

let tabCount = 0;
const TAB_WIDTH = "  ";

async function main() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;

  let json = JSON.parse(data);

  let pp = "";
  if (Array.isArray(json)) {
    pp += await array(json);
  } else if (typeof json === "object") {
    pp += await object(json);
  }

  process.stdout.write(pp + "\n");
}

async function object(obj) {
  let str = "{\n";

  tabCount++;

  for (const [key, val] of Object.entries(obj)) {
    str += TAB_WIDTH.repeat(tabCount);
    str += COLOURS.key + key;
    str += COLOURS.colon + ": ";
    str += await value(val);
    str += COLOURS.comma + ",\n";
  }

  tabCount--;

  str += TAB_WIDTH.repeat(tabCount);
  str += "}";

  return str;
}

async function array(arr) {
  let str = "[\n";

  tabCount++;

  for await (const val of arr) {
    str += TAB_WIDTH.repeat(tabCount);
    str += await value(val);
    str += COLOURS.comma + ",\n";
  }

  tabCount--;

  str += TAB_WIDTH.repeat(tabCount);
  str += "]";

  return str;
}

async function value(val) {
  switch (typeof val) {
    case "number":
      return COLOURS.number + val.toString();
    case "string":
      return COLOURS.string + "'" + val + "'";
    case "boolean":
      return COLOURS.bool + val;
    default:
      if (Array.isArray(val)) {
        return await array(val);
      } else if (val === null) {
        return COLOURS.null + val;
      } else {
        return await object(val);
      }
  }
}

main();
