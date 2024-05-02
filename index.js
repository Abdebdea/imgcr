#!/usr/bin/env node

const short = require("./useful/short");
const encrypt = require("./useful/cryptage");

const input = short.input;
const flags = short.flags;
const { clear } = flags;

(async () => {
  init({ clear });

  input.includes(`help`) && cli.showHelp(0);
  // check if encrypt is present in flags object
  if (flags.encrypt) {
    await encrypt(flags);
  } else if (flags.decrypt) {
    await decrypt(flags);
  }

  // footer to show when the program is finished

  const chalk = (await import(`chalk`)).default;

  //print of program is finish
  console.log(chalk.bgMagenta(`By Abdelouakel`));
})();
