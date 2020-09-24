import { ReceiptCreatorState } from "../receipt/containers/AppContainer"
import { computeBenefitsOfItem, computeDetailedTotal } from "./Receipt";

const path = window.require("path");
const { promises: fs } = window.require("fs");
const util = window.require("util");
const exec = util.promisify(window.require("child_process").exec);
const { ipcRenderer } = window.require("electron");


const replacePDFs = (text: string, data: ReceiptCreatorState) => {
  const inputs = data.pdfFiles.map(
    (file) =>
      `\\includepdf[pages=-, landscape=true, angle=90]{${file.replaceAll(
        "\\",
        "/"
      )}}`
  ).join("");
  return text.replace("!INPUTFILES!", inputs);
};

const replaceClientData = (text: string, data: ReceiptCreatorState) => {
  return text
    .replace("!NAME!", data.clientData.name.value)
    .replace("!ADDRESS!", data.clientData.address.value)
    .replace("!CP!", data.clientData.cp.value.toString())
    .replace("!CITY!", data.clientData.city.value)
    .replace("!NIF!", data.clientData.nif.value)
    .replace("!PHONENUMBER!", data.clientData.mobile.value.toString())
    .replace("!AZIMUT!", data.clientData.azimut.value)
    .replace("!EMAIL!", data.clientData.email.value)
    .replace("!INSTALLATIONTYPE!", data.clientData.installationType.value)
    .replace("!INSTALLATIONADDRESS!", data.clientData.installationAddress.value)
    .replace("!CLIENTNUMBER!", data.clientData.clientNumber.value)
    .replace("!BUDGETNUMBER!", data.clientData.budgetNumber.value);
};

const replaceReceiptData = (text: string, data: ReceiptCreatorState) => {
  const detailedTotal = computeDetailedTotal(data.receipt);
  const receiptTable = data.receipt.items
    .map(
      (item) =>
        `${item.reference} & ${item.brand} & ${item.description} & ${item.amount
        } & ${item.pvp.toFixed(2)} € & ${item.total.toFixed(2)} € \\\\\\hline`
    )
    .join("\n");
  return text
    .replace("!SUBTOTAL!", `${detailedTotal.subtotal.toFixed(2)} €`)
    .replace("!IVA!", `${detailedTotal.vat.toFixed(2)} €`)
    .replace("!GENERALEXPENSES!", `${detailedTotal.generalExpenses.toFixed(2)} €`)
    .replace("!TOTAL!", `${detailedTotal.total.toFixed(2)} €`)
    .replace("& & & & & \\\\", receiptTable);
};

const replaceBusinessData = (text: string, data: ReceiptCreatorState) => {
  const detailedTotal = computeDetailedTotal(data.receipt);
  const receiptTable = data.receipt.items
    .map(
      (item) =>
        `${item.reference} & ${item.brand} & ${item.description} & ${item.amount
        } & ${item.provider_price.toFixed(2)} € & ${item.bi.toFixed(
          2
        )} \\% & ${item.pvp.toFixed(2)} € & ${item.total.toFixed(2)} € & ${(
          computeBenefitsOfItem(item)
        ).toFixed(2)} € \\\\`
    )
    .join("\n");
  return text
    .replace("!SUBTOTAL!", `${detailedTotal.subtotal.toFixed(2)} € & ${detailedTotal.benefits.toFixed(2)} €`)
    .replace("!IVA!", `${detailedTotal.vat.toFixed(2)} €`)
    .replace(
      "!GENERALEXPENSES!",
      `${detailedTotal.generalExpenses.toFixed(2)} € & ${detailedTotal.benefitsFromGeneralExpenses.toFixed(2)} €`
    )
    .replace("!TOTAL1!", `${detailedTotal.total.toFixed(2)} €`)
    .replace(
      "!TOTAL2!",
      `${(
        detailedTotal.benefits + detailedTotal.benefitsFromGeneralExpenses
      ).toFixed(2)} €`
    )
    .replace("& & & & & & & & \\\\", receiptTable);
};

const openPDF = (pdfPath: string) => {
  ipcRenderer.send("show-pdf", pdfPath);
};

export const generateBusinessReport = async (pathFile: string, data: ReceiptCreatorState) => {
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
  try {
    const { stdout, stderr } = await exec(command, { cwd: directory });
    console.log(`stderr: ${stderr}`);
    console.log(stdout);
  } finally {
    await fs.writeFile(reportPath, originalTemplateTex);
  }

  openPDF(
    path.format({
      dir: directory,
      base: "business-master.pdf",
    })
  );
};

export const generateReceiptAlone = async (pathFile: string, data: ReceiptCreatorState) => {
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
  try {
    const { stdout, stderr } = await exec(command, { cwd: directory });
    console.log(`stderr: ${stderr}`);
    console.log(stdout);
  } finally {
    await fs.writeFile(reportPath, originalTemplateTex);
  }

  openPDF(
    path.format({
      dir: directory,
      base: "receipt-alone.pdf",
    })
  );
};

export const generateClientReport = async (pathFile: string, data: ReceiptCreatorState) => {
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
  newMasterTex = replacePDFs(newMasterTex, data);
  let newTemplateTex = replaceClientData(originalTemplateTex, data);
  newTemplateTex = replaceReceiptData(newTemplateTex, data);
  let newReportTemplateTex = replaceClientData(reportTemplateTex, data);

  await fs.writeFile(pathFile, newMasterTex);
  await fs.writeFile(templatePath, newTemplateTex);
  await fs.writeFile(reportPath, newReportTemplateTex);

  let command = `pdflatex -synctex=1 -interaction=nonstopmode --shell-escape ${clientMaster}`;
  try {
    const { stdout, stderr } = await exec(command, { cwd: directory });
    console.log(`stderr: ${stderr}`);
    console.log(stdout);
  } finally {
    await fs.writeFile(pathFile, originalMasterTex);
    await fs.writeFile(templatePath, originalTemplateTex);
    await fs.writeFile(reportPath, reportTemplateTex);
  }

  openPDF(
    path.format({
      dir: directory,
      base: clientMaster.replace(".tex", ".pdf"),
    })
  );
};

export const generatePDF = async (pathFile: string, data: ReceiptCreatorState) => {
  try {
    await generateClientReport(pathFile, data);
    await generateBusinessReport(pathFile, data);
    await generateReceiptAlone(pathFile, data);
  } catch (e) {
    alert(e.message);
  }
};
