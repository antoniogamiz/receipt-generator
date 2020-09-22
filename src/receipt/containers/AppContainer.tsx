import React from "react";

import LatexGenerator from "../LatexGenerator";
import XLSX from "../../utils/xlsx";
import { generatePDF } from "../../utils/latex";
import ReceiptContainer from "./ReceiptContainer";
import { Receipt, addItem, updateItem, deleteItem } from "../../utils/Receipt";
import ClientDataContainer, { ClientData, Entry } from "./ClientDataContainer";

interface state {
  receipt: Receipt;
  clientData: ClientData;
  pdfFiles: string[];
  texFile: string;
  xlsx: any;
}

class AppContainer extends React.Component<{}, state> {
  constructor(props: {}) {
    super(props);
    this.state = {
      xlsx: {},
      receipt: {
        items: [],
        expectedTotal: 0,
        expectedTotalEnabled: false,
        generalExpenses: 13,
        generalExpensesEnabled: true,
      },
      clientData: [
        { name: "name", displayName: "Nombre", value: "" },
        {
          name: "address",
          displayName: "Dirección",
          value: "",
        },
        { name: "cp", displayName: "CP", value: "" },
        { name: "nif", displayName: "NIF", value: "" },
        {
          name: "installationAddress",
          displayName: "Dir. Instalación",
          value: "",
        },
        {
          name: "installationType",
          displayName: "Tipo Instalación",
          value: "",
        },
        {
          name: "mobile",
          displayName: "Móvil",
          value: "",
        },
        { name: "nif", displayName: "Email", value: "" },
        {
          name: "azimut",
          displayName: "Azimut",
          value: "",
        },
        {
          name: "clientNumber",
          displayName: "Nº Cliente",
          value: "",
        },
        {
          name: "budgetNumber",
          displayName: "Nº Presupuesto",
          value: "",
        },
      ],
      pdfFiles: [],
      texFile: "main.tex",
    };
  }

  onXlsxChange = (path: string) => {
    const newXLSX = new XLSX(path);
    newXLSX.load().then(() => this.setState({ xlsx: newXLSX }));
  };

  onAddItem = (reference: string) => {
    const item = this.state.xlsx.searchByReference(reference)[1];
    const newReceipt = {
      ...this.state.receipt,
      items: addItem(this.state.receipt.items, item),
    };
    this.setState({ receipt: newReceipt });
  };

  onUpdateItem = (
    reference: string,
    { bi, amount }: { bi?: number; amount?: number }
  ) => {
    const newReceipt = {
      ...this.state.receipt,
      items: updateItem(this.state.receipt.items, reference, { bi, amount }),
    };
    this.setState({ receipt: newReceipt });
  };

  onDeleteItem = (reference: string) => {
    const newReceipt = {
      ...this.state.receipt,
      items: deleteItem(this.state.receipt.items, reference),
    };
    this.setState({ receipt: newReceipt });
  };

  onExpectedTotalChange = (total: number) => {
    this.setState({
      receipt: { ...this.state.receipt, expectedTotal: total },
    });
  };

  enableTotalExpected = () => {
    const flag = !this.state.receipt.expectedTotalEnabled;
    this.setState({
      receipt: { ...this.state.receipt, expectedTotalEnabled: flag },
    });
  };

  enableGeneralExpenses = () => {
    const flag = !this.state.receipt.generalExpensesEnabled;
    this.setState({
      receipt: { ...this.state.receipt, generalExpensesEnabled: flag },
    });
  };

  onClientDataChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    const field: string = e.target.name;
    const entry: Entry | undefined = this.state.clientData.find(
      (i) => i.name === field
    );
    this.setState({
      clientData: { ...this.state.clientData, [field]: value },
    });
  };

  compile = () => {
    generatePDF(this.state.texFile, {
      receipt: this.state.receipt,
      clientData: this.state.clientData,
      pdfFiles: this.state.pdfFiles,
    });
  };

  render() {
    return (
      <div style={{ margin: "5px" }}>
        <ReceiptContainer
          xlsx={this.state.xlsx}
          onXlsxChange={this.onXlsxChange}
          receipt={this.state.receipt}
          onAddItem={this.onAddItem}
          onDeleteItem={this.onDeleteItem}
          onUpdateItem={this.onUpdateItem}
          onExpectedTotalChange={this.onExpectedTotalChange}
          enableTotalExpected={this.enableTotalExpected}
          enableGeneralExpenses={this.enableGeneralExpenses}
        />
        <ClientDataContainer
          onClientDataChange={this.onClientDataChange}
          entries={this.state.clientData}
        />
        {/* <LatexGenerator
          compile={compile}
          updatePDFFiles={setPdfFiles}
          updateTexFile={setTexFile}
        /> */}
      </div>
    );
  }
}

export default AppContainer;
