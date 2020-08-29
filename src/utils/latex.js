const path = window.require("path");
const { exec } = window.require("child_process");
const { ipcRenderer } = window.require("electron");

const replaceData = ({ text, data }) => {
  return text;
};

const openPDF = (pdfPath) => {
  ipcRenderer.send("show-pdf", pdfPath);
};

export const generatePDF = (pathFile, data) => {
  const directory = path.dirname(pathFile);
  const filename = path.basename(pathFile);

  let command = `cd ${directory} && pdflatex -synctex=1 -interaction=nonstopmode --shell-escape ${filename}`;
  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      console.log(`error: ${error.message}`);
      console.log(`stderr: ${stderr}`);
      return;
    }
    openPDF(
      path.format({
        dir: directory,
        base: filename.replace(".tex", ".pdf"),
      })
    );
  });
  console.log(directory);
  console.log(filename);
};
