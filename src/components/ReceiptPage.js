import React from "react";
import XLSX from "../utils/xlsx";

import NavBar from "./NavBar";
import SpreadSheetVisualizer from "./SpreadSheetVisualizer";
import ReceiptItemListVisualizer from "./ReceiptItemListVisualizer";
import ClientData from "./ClientData";
import ToolBar from "./ToolBar";
import PDFIncluder from "./PDFIncluder";

class ReceiptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
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
    };

    this.changeSpreadSheet = this.changeSpreadSheet.bind(this);
    this.addItemToReceipt = this.addItemToReceipt.bind(this);
    this.onUpdateItemAmount = this.onUpdateItemAmount.bind(this);
    this.onUpdateItemBI = this.onUpdateItemBI.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.updateFile = this.updateFile.bind(this);
    this.updatePDFFiles = this.updatePDFFiles.bind(this);
    this.updateClientData = this.updateClientData.bind(this);
  }

  componentDidMount() {
    this.state.xlsx.load().then(() => this.setState({}));
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
    this.setState({ pageIndex: index });
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
      this.updateItem(ref, { amount: 1, bi: 0 })
    );
  }

  updateItem(ref, { amount, bi }) {
    let i = this.state.items.findIndex((item) => item.ref === ref);
    let newItemList = [...this.state.items];
    let newAmount = amount || newItemList[i].amount;
    let newBI = bi || newItemList[i].bi;
    let pvp = (newItemList[i].provider_price * (1 + newBI / 100.0)).toFixed(2);
    let total = (pvp * newAmount).toFixed(2);

    newItemList[i] = {
      ...newItemList[i],
      amount: newAmount,
      bi: newBI,
      pvp: pvp,
      total: total,
    };

    this.setState({ items: newItemList });
  }

  onUpdateItemAmount(event, ref) {
    event.persist();
    let newAmount = parseFloat(event.target.value);
    this.updateItem(ref, { amount: newAmount });
  }

  onUpdateItemBI(event, ref) {
    event.persist();
    let newBI = parseFloat(event.target.value);
    this.updateItem(ref, { bi: newBI });
  }

  deleteItem(ref) {
    let newItemList = this.state.items.find((item) => ref !== item.ref);
    this.setState({ items: newItemList || [] });
  }

  render() {
    let sheetData = this.state.xlsx.pages
      ? this.state.xlsx.pages[this.state.pageIndex]
      : [];
    let names = this.state.xlsx.sheetNames || [];
    let nameFiles = this.state.pdfFiles.map((f) => f.replace(/^.*[\\\/]/, ""));
    return (
      <div className="window-content">
        <div className="pane-group">
          <div className="pane pane-sm sidebar">
            <NavBar names={names} onclick={this.changeSpreadSheet} />
          </div>
          <div className="pane">
            <ToolBar updateFile={this.updateFile} />
            <SpreadSheetVisualizer
              sheet={sheetData}
              addItem={this.addItemToReceipt}
            />
            <ReceiptItemListVisualizer
              items={this.state.items}
              amountUpdate={this.onUpdateItemAmount}
              biUpdate={this.onUpdateItemBI}
              onDelete={this.deleteItem}
            />
            <ClientData updateData={this.updateClientData} />
            <PDFIncluder files={nameFiles} updateFile={this.updatePDFFiles} />
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiptPage;
