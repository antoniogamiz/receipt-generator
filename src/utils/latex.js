const path = window.require("path");
const { promises: fs } = window.require("fs");
const { exec } = window.require("child_process");
const { ipcRenderer } = window.require("electron");

const replaceClientData = (text, data) => {
  return text
    .replace("!NAME!", data.clientData.name.value)
    .replace("!ADDRESS!", data.clientData.address.value)
    .replace("!CP!", data.clientData.cp.value)
    .replace("!CITY!", data.clientData.city.value)
    .replace("!NIF!", data.clientData.nif.value)
    .replace("!PHONENUMBER!", data.clientData.mobile.value)
    .replace("!AZIMUT!", data.clientData.azimut.value)
    .replace("!INSTALLATIONTYPE!", data.clientData.installationType.value)
    .replace("!INSTALLATIONADDRESS!", data.clientData.installationAddress.value)
    .replace("!CLIENTNUMBER!", data.clientData.clientNumber.value)
    .replace("!BUDGETNUMBER!", data.clientData.budgetNumber.value);
};

const replaceReceiptData = (text, data) => {
  const subtotal = data.items
    .reduce((x, e) => x + parseFloat(e.total), 0)
    .toFixed(2);
  const iva = (subtotal * 0.21).toFixed(2);
  const generalExpenses = (subtotal * 0.13).toFixed(2);
  const total = (subtotal * (1.0 + 0.21 + 0.13)).toFixed(2);

  const receiptTable = data.items
    .map(
      (item, i) =>
        `${i} & ${item.brand} & ${item.description} & ${
          item.amount
        } & ${item.pvp.toFixed(2)} & ${item.total.toFixed(2)} \\\\`
    )
    .join("\n");
  return text
    .replace("!SUBTOTAL!", subtotal)
    .replace("!IVA!", iva)
    .replace("!GENERALEXPENSES!", generalExpenses)
    .replace("!TOTAL!", total)
    .replace("& & & & & \\\\", receiptTable);
};

const openPDF = (pdfPath) => {
  ipcRenderer.send("show-pdf", pdfPath);
};

export const generatePDF = async (pathFile, data) => {
  const directory = path.dirname(pathFile);
  const filename = path.basename(pathFile);
  const templatePath = path.format({ dir: directory, base: "Presupuesto.tex" });

  let originalMasterTex = await fs.readFile(pathFile, "utf8");
  let originalTemplateTex = await fs.readFile(templatePath, "utf8");

  let newMasterTex = replaceClientData(originalMasterTex, data);
  let newTemplateTex = replaceClientData(originalTemplateTex, data);
  newTemplateTex = replaceReceiptData(newTemplateTex, data);

  await fs.writeFile(pathFile, newMasterTex);
  await fs.writeFile(templatePath, newTemplateTex);

  let command = `pdflatex -synctex=1 -interaction=nonstopmode --shell-escape ${filename}`;
  exec(
    command,
    {
      cwd: directory,
    },
    (error, stdout, stderr) => {
      fs.writeFile(pathFile, originalMasterTex);
      fs.writeFile(templatePath, originalTemplateTex);

      if (error || stderr) {
        console.log(`error: ${error.message}`);
        console.log(`stderr: ${stderr}`);
        console.log(stdout);
        return;
      }

      openPDF(
        path.format({
          dir: directory,
          base: filename.replace(".tex", ".pdf"),
        })
      );
    }
  );
};
