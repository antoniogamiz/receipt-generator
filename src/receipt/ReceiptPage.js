import React, { useState } from "react";

import ClientData from "./ClientData";
import PDFIncluder from "./PDFIncluder";
import LatexGenerator from "./LatexGenerator";
import Receipt from "./Receipt";

import { generatePDF } from "../utils/latex";

const ReceiptPage = (props) => {
  const [items, setItems] = useState([]);
  const [clientData, setClientData] = useState({
    name: { label: "Nombre", value: "" },
    address: { label: "Dirección", value: "" },
    cp: { label: "CP", value: "" },
    city: { label: "Ciudad", value: "" },
    nif: { label: "NIF", value: "" },
    installationAddress: { label: "Emplazamiento Instalación", value: "" },
    installationType: { label: "Tipo de instalación", value: "" },
    mobile: { label: "Móvil", value: "" },
    azimut: { label: "Azimut", value: "" },
    clientNumber: { label: "Nº Cliente", value: "" },
    budgetNumber: { label: "Nº Presupuesto", value: "" },
  });
  const [pdfFiles, setPdfFiles] = useState([]);
  const [texFile, setTexFile] = useState("main.tex");

  const compile = () => {
    generatePDF(texFile, {
      items: items,
      clientData: clientData,
      pdfFiles: pdfFiles,
    });
  };

  return (
    <div className="window-content">
      <div className="pane-group">
        <div className="pane">
          <Receipt items={items} setItems={setItems} />
          <ClientData onUpdate={setClientData} fields={clientData} />
          <LatexGenerator
            compile={compile}
            updatePDFFiles={setPdfFiles}
            updateTexFile={setTexFile}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
