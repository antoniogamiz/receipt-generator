import React from "react";

import NavBar from "./NavBar";
import SpreadSheetVisualizer from "./SpreadSheetVisualizer";
import ReceiptItemListVisualizer from "./ReceiptItemListVisualizer";

class ReceiptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      xlsx: props.xlsx,
      items: [],
    };

    this.changeSpreadSheet = this.changeSpreadSheet.bind(this);
    this.addItemToReceipt = this.addItemToReceipt.bind(this);
    this.onUpdateItemAmount = this.onUpdateItemAmount.bind(this);
    this.onUpdateItemBI = this.onUpdateItemBI.bind(this);
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
    this.setState((p) => ({ items: [...p.items, newItem] }));
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

  render() {
    let sheetData = this.state.xlsx.pages
      ? this.state.xlsx.pages[this.state.pageIndex]
      : [];
    let names = this.state.xlsx.sheetNames || [];
    return (
      <div className="window-content">
        <div className="pane-group">
          <div className="pane pane-sm sidebar">
            <NavBar names={names} onclick={this.changeSpreadSheet} />
          </div>
          <div className="pane">
            <SpreadSheetVisualizer
              sheet={sheetData}
              addItem={this.addItemToReceipt}
            />
            <ReceiptItemListVisualizer
              items={this.state.items}
              amountUpdate={this.onUpdateItemAmount}
              biUpdate={this.onUpdateItemBI}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiptPage;
