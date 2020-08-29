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

  const compile = () => {
    console.log(texFile);
  };

  return (
    <div className="window-content">
      <div className="pane-group">
        <div className="pane">
          <Receipt items={items} setItems={setItems} />
          <ClientData onUpdate={setClientData} fields={clientData} />
          <PDFIncluder files={pdfFiles} onUpdate={setPdfFiles} />
          <LatexGenerator compile={compile} updateTexFile={setTexFile} />
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
