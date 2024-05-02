const alert = require("cli-alerts");
const fs = require("fs");
const jimp = require("jimp");
const path = require("path");
const readline = require("readline");

//chof helper function

const encrypt = async function (flags) {
  //check if the user use input encrypt and decrypt flags in the same time
  if (flags.decrypt) {
    alert({
      type: `warning`,
      name: `invalid combination of flags`,
      msg: `cannot use both -e and -d falgs in same time`,
    });
    process.exit(1);
  }

  //take the encrypt file value
  const fileDire = flags.encrypt;

  //check the validity of the filePath
  if (!fileDire) {
    alert({
      type: `warning`,
      name: `Invalid file path`,
      msg: `Please provide a valid file path`,
    });
    process.exit(1);
  }
  //get the current working Dire
  const cwd = process.cwd();

  //join the fileDire and cwd
  const fullPath = path.join(cwd, fileDire);

  //check the validity of the fullPath
  if (!fs.existsSync(fullPath)) {
    alert({
      type: `warning`,
      name: `Invalid file path`,
      msg: `Please provide a valid file path`,
    });
  }

  //read the image
  try {
    const ora = (await import("ora")).default; //here await wait until ora module is imported then it will default param
    //get the name of the file
    const fileName = path.basename(fullPath);

    //remove the extension of the file
    const fileNameWithoutExtension = fileName.split(".")[0];

    const spinner = ora(`Reading image...`).start();
    const image = await jimp.read(fullPath); //read the image by the fct reaf provided by jimp
    //get the image extension using jimp
    const extension = image.getExtension();
    //ask the confirmation question if image is jpg or jpeg
    if (extension === `jpeg` || extension === `jpg`) {
      spinner.stop();
      const procced = await askQuestion(
        `The image you are trying to encrypt is a jpeg/jpg. Some information may be lost while encryption/decryption. Do you want to proceed? (y/n) \n`
      );
      if (procced !== `y`) {
        process.exit(0);
      }
      spinner.start();
    }
    spinner.succeed(`Image read successfully`);
    //handle outputKeyFileName flag
    let outputKeyFileName = `${fileNameWithoutExtension}_key.txt`;
    //the section nc
    const spinner3 = ora(`Checking for output key file name`).start();

    if (flags.outputKeyFileName) {
      outputKeyFile = path.basename(flags.outputKeyFileName);
    }

    if (fs.existsSync(outputKeyFile)) {
      spinner3.fail(`Output key file already exists`);
      alert({
        type: `error`,
        name: `Invalid output key file name`,
        msg: `The output key file name already exists: ${outputKeyFile}
            \nPlease provide a different output key file name with --outputKeyFileName/-p flag`,
      });
      process.exit(1);
    }

    spinner3.succeed(`Output key file name is valid`);
    //

    //start encryption
    spinner4 = ora(`Encrypting image: Reading Image Data`).start();

    //get rgba value of the image
    const rgba = image.bitmap.data; //property contains information about the image data, including the raw pixel data.

    //get the length og thr rgba array
    const length = rgba.length;

    spinner4.succeed(`Image data read successfully`);
    const spinner5 = ora(`Encrypting image: Generating key`).start();
    //generate random key for encryption for each pixel between 0-255
    const key = [];
    for (let i = 0; i < length; i++) {
      key.push(Math.floor(Math.random() * 256));
    }
    spinner5.succeed(`Key generated successfully`);
    const spinner6 = ora(`Encrypting image: Encrypting image`).start();

    //loop through the rgba array
    await new Promise((resolve) => {
      for (let i = 0; i < length; i++) {
        const k = key[i];
        rgba[i] = rgba[i] ^ k;
      }
      // save the image with _encrypted appended to the file name, mimeType and the new extension
      image.bitmap.data = rgba;
      resolve();
    });
    spinner6.succeed(`Image encrypted successfully`);
    const spinner7 = ora(`Encrypting image: Saving image`).start();
    image.write(outputImageFile);
    spinner7.succeed(`Image saved successfully`);

    //save key to key.txt
    const spinner8 = ora(`Encrypting image: Saving key`).start();

    spinner8.succeed(`Key saved successfully`);

    alert({
      type: `success`,
      name: `Image encrypted successfully`,
      msg: `Image encrypted successfully:\n
         Encrypted Image: ${outputImageFile}\n
         Key: ${outputKeyFile}`,
    });

    // print first 50 characters of key to console
  } catch (error) {
    alert({
      type: `error`,
      name: `Error`,
      msg: `${error || "Unknown error"}`,
    });
    process.exit(1);
  }
};
