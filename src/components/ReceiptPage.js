import React from "react";
import XLSX from "../utils/xlsx";

import NavBar from "./NavBar";
import SpreadSheetVisualizer from "./SpreadSheetVisualizer";
import ReceiptItemListVisualizer from "./ReceiptItemListVisualizer";
import Total from "./Total";
import ClientData from "./ClientData";
import ToolBar from "./ToolBar";
import PDFIncluder from "./PDFIncluder";
import LatexGenerator from "./LatexGenerator";
class ReceiptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: [],
      xlsx: new XLSX(),
      items: [],
      pdfFiles: [],
      clientData: {
        name: "",
        address: "",
        cp: "0",
        city: "",
        nif: "",
        installationAddress: "",
        clientNumber: "",
        budgetNumber: "",
      },
      mainTexFile: "",
    };

    this.changeSpreadSheet = this.changeSpreadSheet.bind(this);
    this.addItemToReceipt = this.addItemToReceipt.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.updatePDFFiles = this.updatePDFFiles.bind(this);
    this.updateClientData = this.updateClientData.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
    this.updateTexFile = this.updateTexFile.bind(this);
  }

  updateTexFile(e) {
    this.setState({ mainTexFile: e.target.files[0].path });
  }

  componentDidMount() {
    this.state.xlsx.load().then(() => this.setState({}));
  }

  updateSearchResults(e) {
    let ref = e.target.value;
    this.setState({
      page: this.state.xlsx.searchByReference(ref),
    });
  }

  updateClientData(e, field) {
    let old = this.state.clientData;
    let newClientData = {
      ...old,
      [field]: e.target.value,
    };
    this.setState({ clientData: newClientData });
  }

  updateFile(e) {
    let path = e.target.files[0].path;
    let xlsx = new XLSX(path);
    xlsx.load().then(() => {
      this.setState({ xlsx: xlsx });
    });
  }

  updatePDFFiles(e) {
    let paths = Array.from(e.target.files).map((f) => f.path);
    this.setState({ pdfFiles: paths });
  }

  changeSpreadSheet(index) {
    let newPage = this.state.xlsx.pages ? this.state.xlsx.pages[index] : [];
    this.setState({ page: newPage });
  }

  addItemToReceipt(ref) {
    if (this.state.items.find((e) => e.ref === ref)) return;

    let item = this.state.xlsx.searchByReference(ref)[1];
    let newItem = {
      ref: item[0],
      brand: item[1],
      model: item[2],
      description: item[3],
      amount: 1,
      provider_price: parseFloat(item[item.length - 1]),
      bi: 0,
      pvp: 0,
      total: 0,
    };
    this.setState({ items: [...this.state.items, newItem] }, () =>
      this.updateItem(this.state.items.length - 1, { amount: 1, bi: 0 })
    );
  }

  updateItem = (i, { amount, bi }) => {
    let items = [...this.state.items];
    amount = amount === undefined ? items[i].amount : parseInt(amount) || 1.0;
    bi = bi === undefined ? items[i].bi : parseFloat(bi) || 0.0;

    let pvp = (items[i].provider_price * (1 + bi / 100.0)).toFixed(2);
    let total = (pvp * amount).toFixed(2);

    items[i] = {
      ...items[i],
      amount: amount,
      bi: bi,
      pvp: pvp,
      total: total,
    };

    this.setState({ items: items });
  };

  deleteItem = (i) => {
    let items = this.state.items.filter((item, j) => parseInt(i) !== j);
    this.setState({ items: items || [] });
  };

  render() {
    let sheetData = this.state.page || [];
    let names = this.state.xlsx.sheetNames || [];
    let nameFiles = this.state.pdfFiles.map((f) => f.replace(/^.*[\\\/]/, ""));
    return (
      <div className="window-content">
        <div className="pane-group">
          <div className="pane pane-sm sidebar">
            <NavBar names={names} onclick={this.changeSpreadSheet} />
          </div>
          <div className="pane">
            <ToolBar
              updateFile={this.updateFile}
              updateSearch={this.updateSearchResults}
            />
            <SpreadSheetVisualizer
              sheet={sheetData}
              addItem={this.addItemToReceipt}
            />
            <ReceiptItemListVisualizer
              updateItem={this.updateItem}
              items={this.state.items}
              deleteItem={this.deleteItem}
            />
            <Total items={this.state.items} />
            <ClientData updateData={this.updateClientData} />
            <PDFIncluder files={nameFiles} updateFile={this.updatePDFFiles} />
            <LatexGenerator updateTexFile={this.updateTexFile} />
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiptPage;
