import { ReceiptCreatorState } from "../receipt/containers/AppContainer";
import { computeBenefitsOfItem, computeDetailedTotal } from "./Receipt";

const path = window.require("path");
const { promises: fs } = window.require("fs");
const util = window.require("util");
const exec = util.promisify(window.require("child_process").exec);
const { ipcRenderer } = window.require("electron");

const setCharAt = (str: string, index: number, chr: string): string => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

const format = (x: number): string => {
  let englishFormat = x
    .toFixed(2)
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const indexOfDecimalPart = englishFormat.indexOf(".");
  let number = englishFormat.replace(/,/g, ".");
  if (indexOfDecimalPart !== -1) {
    number = setCharAt(number, indexOfDecimalPart, ",");
  }
  return `${number} €`;
};

const replacePDFs = (text: string, data: ReceiptCreatorState) => {
  const inputs = data.pdfFiles
    .map(
      (file) =>
        `\\includepdf[pages=-, landscape=true, angle=90]{${file.replaceAll(
          "\\",
          "/"
        )}}`
    )
    .join("");
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
        `${item.reference} & ${item.brand} & ${item.description} & ${
          item.amount
        } & ${format(item.pvp)} & ${format(item.total)} \\\\\\hline`
    )
    .join("\n");
  return text
    .replace("!SUBTOTAL!", format(detailedTotal.subtotal))
    .replace("!IVA!", format(detailedTotal.vat))
    .replace("!GENERALEXPENSES!", format(detailedTotal.generalExpenses))
    .replace("!TOTAL!", format(detailedTotal.total))
    .replace("& & & & & \\\\", receiptTable);
};

const replaceBusinessData = (text: string, data: ReceiptCreatorState) => {
  const detailedTotal = computeDetailedTotal(data.receipt);
  const receiptTable = data.receipt.items
    .map(
      (item) =>
        `${item.reference} & ${item.brand} & ${item.description} & ${
          item.amount
        } & ${format(item.provider_price)} & ${item.bi.toFixed(
          2
        )} \\% & ${format(item.pvp)} & ${format(item.total)} & ${format(
          computeBenefitsOfItem(item)
        )} \\\\`
    )
    .join("\n");
  return text
    .replace(
      "!SUBTOTAL!",
      `${format(detailedTotal.subtotal)} & ${format(detailedTotal.benefits)}`
    )
    .replace("!IVA!", format(detailedTotal.vat))
    .replace(
      "!GENERALEXPENSES!",
      `${format(detailedTotal.generalExpenses)} & ${format(
        detailedTotal.benefitsFromGeneralExpenses
      )}`
    )
    .replace("!TOTAL1!", format(detailedTotal.total))
    .replace(
      "!TOTAL2!",
      format(detailedTotal.benefits + detailedTotal.benefitsFromGeneralExpenses)
    )
    .replace("& & & & & & & & \\\\", receiptTable);
};

const openPDF = (pdfPath: string) => {
  ipcRenderer.send("show-pdf", pdfPath);
};

export const generateBusinessReport = async (
  pathFile: string,
  data: ReceiptCreatorState
) => {
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

export const generateReceiptAlone = async (
  pathFile: string,
  data: ReceiptCreatorState
) => {
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

export const generateClientReport = async (
  pathFile: string,
  data: ReceiptCreatorState
) => {
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

export const generatePDF = async (
  pathFile: string,
  data: ReceiptCreatorState
) => {
  try {
    await generateClientReport(pathFile, data);
    await generateBusinessReport(pathFile, data);
    await generateReceiptAlone(pathFile, data);
  } catch (e) {
    alert(e.message);
  }
};
