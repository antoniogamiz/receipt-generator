import React from "react";

import LatexGenerator from "../LatexGenerator";
import XLSX from "../../utils/xlsx";
import { generatePDF } from "../../utils/latex";
import ReceiptContainer from "./ReceiptContainer";
import { Receipt, addItem, updateItem, deleteItem, DEFAULT_BI } from "../../utils/Receipt";
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
        generalExpenses: DEFAULT_BI,
        generalExpensesEnabled: true,
      },
      clientData: {
        name: { displayName: "Nombre" },
        address: {
          displayName: "Dirección",
        },
        cp: { displayName: "CP" },
        nif: { displayName: "NIF" },
        installationAddress: {
          displayName: "Dir. Instalación",
        },
        installationType: {
          displayName: "Tipo Instalación",
        },
        mobile: {
          displayName: "Móvil",
        },
        email: { displayName: "Email" },
        azimut: {
          displayName: "Azimut",
        },
        clientNumber: {
          displayName: "Nº Cliente",
        },
        budgetNumber: {
          displayName: "Nº Presupuesto",
        },
      },
      pdfFiles: [],
      texFile: "",
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
    field: keyof ClientData,
    value: string | number
  ) => {
    const entry: Entry<string | number> = { ...this.state.clientData[field], value: value };
    this.setState({
      clientData: { ...this.state.clientData, [field]: entry },
    });
  };

  onPdfFilesChange = (files: string[]) => this.setState({ pdfFiles: files })

  onTexFileChange = (file: string) => this.setState({ texFile: file })

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
          onChange={this.onClientDataChange}
          entries={this.state.clientData}
        />
        <LatexGenerator
          compile={this.compile}
          pdfFiles={this.state.pdfFiles}
          onPdfFilesChange={this.onPdfFilesChange}
          texFile={this.state.texFile}
          onTexFileChange={this.onTexFileChange}
        />
      </div>
    );
  }
}

export default AppContainer;
