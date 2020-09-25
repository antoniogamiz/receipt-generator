import React from "react";

import LatexGenerator from "../LatexGenerator";
import XLSX from "../../utils/xlsx";
import { generatePDF } from "../../utils/latex";
import ReceiptContainer from "./ReceiptContainer";
import {
  Receipt,
  addItem,
  updateItem,
  deleteItem,
  DEFAULT_BI,
} from "../../utils/Receipt";
import ClientDataContainer, { ClientData, Entry } from "./ClientDataContainer";

export interface ReceiptCreatorState {
  receipt: Receipt;
  clientData: ClientData;
  pdfFiles: string[];
  texFile: string;
  xlsx: any;
}

class AppContainer extends React.Component<{}, ReceiptCreatorState> {
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
        name: { displayName: "Nombre", value: "" },
        address: {
          displayName: "Dirección",
          value: "",
        },
        city: {
          displayName: "Ciudad",
          value: "",
        },
        cp: { displayName: "CP", value: 0 },
        nif: { displayName: "NIF", value: "" },
        installationAddress: {
          displayName: "Dir. Instalación",
          value: "",
        },
        installationType: {
          displayName: "Tipo Instalación",
          value: "",
        },
        mobile: {
          displayName: "Móvil",
          value: 0,
        },
        email: { displayName: "Email", value: "" },
        azimut: {
          displayName: "Azimut",
          value: "",
        },
        clientNumber: {
          displayName: "Nº Cliente",
          value: "",
        },
        budgetNumber: {
          displayName: "Nº Presupuesto",
          value: "",
        },
      },
      pdfFiles: [],
      texFile: "",
    };
  }

  onXlsxChange = (path: string) => {
    const newXLSX = new XLSX(path);
    console.log("hey");
    newXLSX
      .load()
      .then(() => {
        console.log("dd");
        this.setState({ xlsx: newXLSX });
      })
      .catch((e) => alert(e));
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

  onClientDataChange = (field: keyof ClientData, value: string | number) => {
    const entry: Entry<string | number> = {
      ...this.state.clientData[field],
      value: value,
    };
    this.setState({
      clientData: { ...this.state.clientData, [field]: entry },
    });
  };

  onPdfFilesChange = (files: string[]) => this.setState({ pdfFiles: files });

  onTexFileChange = (file: string) => this.setState({ texFile: file });

  compile = () => generatePDF(this.state.texFile, this.state);

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
