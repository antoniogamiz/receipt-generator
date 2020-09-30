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

const FileSaver = window.require("file-saver");
const fs = window.require("fs").promises;

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
    newXLSX
      .load()
      .then(() => {
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

  saveJsonFile = () => {
    const object = {
      clientData: { ...this.state.clientData },
      items: this.state.receipt.items.map((item) => ({
        reference: item.reference,
        bi: item.bi,
        amount: item.amount,
      })),
      expectedTotal: this.state.receipt.expectedTotal,
      expectedTotalEnabled: this.state.receipt.expectedTotalEnabled,
      generalExpenses: this.state.receipt.generalExpenses,
      generalExpensesEnabled: this.state.receipt.generalExpensesEnabled,
    };
    const blob = new Blob([JSON.stringify(object, null, 2)], {
      type: "text/plain",
    });

    FileSaver.saveAs(blob, "receipt-data.json");
  };

  setStateFromJSON = (obj: any) => {
    let items: any[] = [];
    for (let i = 0; i < obj.items.length; i++) {
      const newItem = this.state.xlsx.searchByReference(
        obj.items[i].reference
      )[1];
      console.log(newItem);
      items = addItem(items, newItem);
      console.log(items);
      items = updateItem(items, obj.items[i].reference, {
        bi: obj.items[i].bi,
        amount: obj.items[i].amount,
      });
      console.log(items);
    }
    this.setState({
      clientData: {
        ...obj.clientData,
      },
      receipt: {
        items: items,
        expectedTotal: obj.expectedTotal,
        expectedTotalEnabled: obj.expectedTotalEnabled,
        generalExpenses: obj.generalExpenses,
        generalExpensesEnabled: obj.generalExpensesEnabled,
      },
    });
  };

  loadJsonFile = (path: string) => {
    fs.readFile(path, "utf8").then((str: string) => {
      if (this.state.xlsx.path) this.setStateFromJSON(JSON.parse(str));
      else alert("Catálogo no seleccionado");
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
          saveJsonFile={this.saveJsonFile}
          loadJsonFile={this.loadJsonFile}
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
