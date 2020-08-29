const path = window.require("path");
// const fs = window.require("fs");
const { promises: fs } = window.require("fs");

const { exec } = window.require("child_process");
const { ipcRenderer } = window.require("electron");

const replaceData = (text, data) => {
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
        } & ${item.pvp.toFixed(2)} € & ${item.total.toFixed(2)} € \\\\`
    )
    .join("\n");
  return text
    .replace("!NAME!", data.clientData.name.value)
    .replace("!ADDRESS!", data.clientData.address.value)
    .replace("!CP!", data.clientData.cp.value)
    .replace("!CITY!", data.clientData.city.value)
    .replace("!NIF!", data.clientData.nif.value)
    .replace("!PHONENUMBER!", "1234w56789")
    .replace("!CLIENTNUMBER!", data.clientData.clientNumber.value)
    .replace("!BUDGETNUMBER!", data.clientData.budgetNumber.value)
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

  // replace include in master file
  let originalMasterTex = await fs.readFile(pathFile, "utf8");
  let newMasterFile = originalMasterTex.replace(
    "include{Presupuesto}",
    "include{Presupuesto2}"
  );
  await fs.writeFile(pathFile, newMasterFile);

  // replace template file
  const templateFile = path.format({ dir: directory, base: "Presupuesto.tex" });
  let text = await fs.readFile(templateFile, "utf8");
  text = replaceData(text, data);
  await fs.writeFile(
    path.format({ dir: directory, base: "Presupuesto2.tex" }),
    text
  );

  let command = `cd ${directory} && pdflatex -synctex=1 -interaction=nonstopmode --shell-escape ${filename}`;
  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      console.log(`error: ${error.message}`);
      console.log(`stderr: ${stderr}`);
      return;
    }
    fs.writeFile(pathFile, originalMasterTex);
    openPDF(
      path.format({
        dir: directory,
        base: filename.replace(".tex", ".pdf"),
      })
    );
  });
};
