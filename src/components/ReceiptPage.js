import React, { useState } from "react";

import ClientData from "../receipt/ClientData";
import PDFIncluder from "./PDFIncluder";
import LatexGenerator from "./LatexGenerator";
import Receipt from "../receipt/Receipt";

const ReceiptPage = (props) => {
  const [items, setItems] = useState([]);
  const [clientData, setClientData] = useState({
    name: { label: "Nombre", value: "" },
    address: { label: "Dirección", value: "" },
    cp: { label: "CP", value: "" },
    city: { label: "Ciudad", value: "" },
    nif: { label: "nif", value: "" },
    installationAddress: { label: "Emplazamiento Instalación", value: "" },
    clientNumber: { label: "Nº Cliente", value: "" },
    budgetNumber: { label: "Nº Presupuesto", value: "" },
  });
  const [pdfFiles, setPdfFiles] = useState([]);
  const [texFile, setTexFile] = useState("main.tex");

  // updateTexFile(e) {
  //   this.setState({ mainTexFile: e.target.files[0].path });
  // }

  // updatePDFFiles(e) {
  //   let paths = Array.from(e.target.files).map((f) => f.path);
  //   this.setState({ pdfFiles: paths });
  // }

  // let nameFiles = this.state.pdfFiles.map((f) => f.replace(/^.*[\\\/]/, ""));
  return (
    <div className="window-content">
      <div className="pane-group">
        <div className="pane">
          <Receipt items={items} setItems={setItems} />
          <ClientData onUpdate={setClientData} fields={clientData} />
          <PDFIncluder files={pdfFiles} onUpdate={setPdfFiles} />
          {/* <LatexGenerator updateTexFile={setTexFile} /> */}
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
