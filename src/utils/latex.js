const path = window.require("path");
const { promises: fs } = window.require("fs");
const util = window.require("util");
const exec = util.promisify(window.require("child_process").exec);
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
    .replace("!EMAIL!", data.clientData.email.value)
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
        } & ${item.pvp.toFixed(2)} € & ${item.total.toFixed(2)} € \\\\\\hline`
    )
    .join("\n");
  return text
    .replace("!SUBTOTAL!", `${subtotal} €`)
    .replace("!IVA!", `${iva} €`)
    .replace("!GENERALEXPENSES!", `${generalExpenses} €`)
    .replace("!TOTAL!", `${total} €`)
    .replace("& & & & & \\\\", receiptTable);
};

const replaceBusinessData = (text, data) => {
  const subtotal = data.items
    .reduce((x, e) => x + parseFloat(e.total), 0)
    .toFixed(2);
  const iva = subtotal * 0.21;
  const generalExpenses = subtotal * 0.13;
  const total = subtotal * (1.0 + 0.21 + 0.13);

  const receiptTable = data.items
    .map(
      (item) =>
        `${item.ref} & ${item.brand} & ${item.description} & ${
          item.amount
        } & ${item.provider_price.toFixed(2)} € & ${item.bi.toFixed(
          2
        )} \\% & ${item.pvp.toFixed(2)} € & ${item.total.toFixed(2)} € & ${(
          (item.amount * item.provider_price * item.bi) /
          100
        ).toFixed(2)} € \\\\`
    )
    .join("\n");
  const totalBenefits = data.items.reduce(
    (accumulator, item) =>
      (item.amount * item.provider_price * item.bi) / 100 + accumulator,
    0
  );
  return text
    .replace("!SUBTOTAL!", `${subtotal} € & ${totalBenefits.toFixed(2)} €`)
    .replace("!IVA!", `${iva.toFixed(2)} €`)
    .replace(
      "!GENERALEXPENSES!",
      `${generalExpenses.toFixed(2)} € & ${(totalBenefits * 0.13).toFixed(2)} €`
    )
    .replace("!TOTAL1!", `${total.toFixed(2)} €`)
    .replace(
      "!TOTAL2!",
      `${(totalBenefits + totalBenefits * 0.13).toFixed(2)} €`
    )
    .replace("& & & & & & & & \\\\", receiptTable);
};

const openPDF = (pdfPath) => {
  ipcRenderer.send("show-pdf", pdfPath);
};

export const generateBusinessReport = async (pathFile, data) => {
  const directory = path.dirname(pathFile);

  const reportPath = path.format({
    dir: directory,
    base: "business-budget.tex",
  });

  let originalTemplateTex = await fs.readFile(reportPath, "utf8");
  const newTemplateTex = replaceBusinessData(
    replaceClientData(originalTemplateTex, data),
    data
  );

  await fs.writeFile(reportPath, newTemplateTex);

  let command = `pdflatex -synctex=1 -interaction=nonstopmode --shell-escape business-master.tex`;
  const { stdout, stderr } = await exec(command, { cwd: directory });
  console.log(`stderr: ${stderr}`);
  console.log(stdout);

  await fs.writeFile(reportPath, originalTemplateTex);

  openPDF(
    path.format({
      dir: directory,
      base: "business-master.pdf",
    })
  );
};

export const generateReceiptAlone = async (pathFile, data) => {
  const directory = path.dirname(pathFile);

  const reportPath = path.format({
    dir: directory,
    base: "receipt-alone.tex",
  });

  let originalTemplateTex = await fs.readFile(reportPath, "utf8");
  const newTemplateTex = replaceReceiptData(
    replaceClientData(originalTemplateTex, data),
    data
  );

  await fs.writeFile(reportPath, newTemplateTex);

  let command = `pdflatex -synctex=1 -interaction=nonstopmode --shell-escape receipt-alone.tex`;
  const { stdout, stderr } = await exec(command, { cwd: directory });
  console.log(`stderr: ${stderr}`);
  console.log(stdout);

  await fs.writeFile(reportPath, originalTemplateTex);

  openPDF(
    path.format({
      dir: directory,
      base: "receipt-alone.pdf",
    })
  );
};

export const generateClientReport = async (pathFile, data) => {
  const directory = path.dirname(pathFile);
  const clientMaster = path.basename(pathFile);
  const templatePath = path.format({
    dir: directory,
    base: "client-budget.tex",
  });
  const reportPath = path.format({
    dir: directory,
    base: "MemoriaDescriptiva.tex",
  });

  let originalMasterTex = await fs.readFile(pathFile, "utf8");
  let originalTemplateTex = await fs.readFile(templatePath, "utf8");
  let reportTemplateTex = await fs.readFile(reportPath, "utf8");

  let newMasterTex = replaceClientData(originalMasterTex, data);
  let newTemplateTex = replaceClientData(originalTemplateTex, data);
  newTemplateTex = replaceReceiptData(newTemplateTex, data);
  let newReportTemplateTex = replaceClientData(reportTemplateTex, data);

  await fs.writeFile(pathFile, newMasterTex);
  await fs.writeFile(templatePath, newTemplateTex);
  await fs.writeFile(reportPath, newReportTemplateTex);

  let command = `pdflatex -synctex=1 -interaction=nonstopmode --shell-escape ${clientMaster}`;
  const { stdout, stderr } = await exec(command, { cwd: directory });

  await fs.writeFile(pathFile, originalMasterTex);
  await fs.writeFile(templatePath, originalTemplateTex);
  await fs.writeFile(reportPath, reportTemplateTex);

  console.log(`stderr: ${stderr}`);
  console.log(stdout);

  openPDF(
    path.format({
      dir: directory,
      base: clientMaster.replace(".tex", ".pdf"),
    })
  );
};

export const generatePDF = async (pathFile, data) => {
  try {
    await generateClientReport(pathFile, data);
    await generateBusinessReport(pathFile, data);
    await generateReceiptAlone(pathFile, data);
  } catch (e) {
    alert(e.message);
  }
};
