import React, { useState } from "react";

import ClientData from "../ClientData";
import LatexGenerator from "../LatexGenerator";
import XLSX from "../../utils/xlsx";
import { generatePDF } from "../../utils/latex";
import ReceiptContainer from "./ReceiptContainer";
import { Receipt, addItem, updateItem, deleteItem } from "../../utils/Receipt";

type clientData = {
  name: string;
  address: string;
  cp: number;
  city: string;
  nif: string;
  installationAddress: string;
  installationType: string;
  mobile: number;
  email: string;
  azimut: string;
  clientNumber: string;
  budgetNumber: string;
};

interface state {
  receipt: Receipt;
  clientData: clientData;
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
      clientData: {
        name: "",
        address: "",
        cp: 0,
        city: "",
        nif: "",
        installationAddress: "",
        installationType: "",
        mobile: 0,
        email: "",
        azimut: "",
        clientNumber: "",
        budgetNumber: "",
      },
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

  onClientDataChange = (fields: clientData) => {
    this.setState({
      clientData: { ...fields },
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
        <ClientData
          onClientDataChange={this.onClientDataChange}
          fields={this.state.clientData}
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
