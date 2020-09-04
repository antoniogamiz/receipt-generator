import React, { useState } from "react";

import ClientData from "./ClientData";
import LatexGenerator from "./LatexGenerator";
import Receipt from "./Receipt";
import { makeStyles } from "@material-ui/core/styles";
import { generatePDF } from "../utils/latex";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

const ReceiptPage = (props) => {
  const [items, setItems] = useState({
    unmodifiedItems: [],
    items: [],
    expectedTotal: 0,
    expectedTotalEnabled: false,
  });

  const [clientData, setClientData] = useState({
    name: { label: "Nombre", value: "" },
    address: { label: "Dirección", value: "" },
    cp: { label: "CP", value: "" },
    city: { label: "Ciudad", value: "" },
    nif: { label: "NIF", value: "" },
    installationAddress: { label: "Emplazamiento Instalacion", value: "" },
    installationType: { label: "Tipo de instalacion", value: "" },
    mobile: { label: "Movil", value: "" },
    azimut: { label: "Azimut", value: "" },
    clientNumber: { label: "Nº Cliente", value: "" },
    budgetNumber: { label: "Nº Presupuesto", value: "" },
  });
  const [pdfFiles, setPdfFiles] = useState([]);
  const [texFile, setTexFile] = useState("main.tex");

  const compile = () => {
    generatePDF(texFile, {
      items: items.items,
      clientData: clientData,
      pdfFiles: pdfFiles,
    });
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Receipt items={items} setItems={setItems} />
      <ClientData onUpdate={setClientData} fields={clientData} />
      <LatexGenerator
        compile={compile}
        updatePDFFiles={setPdfFiles}
        updateTexFile={setTexFile}
      />
    </div>
  );
};

export default ReceiptPage;
