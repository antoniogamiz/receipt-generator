import React, { useState, useEffect } from "react";

import XLSX from "../utils/xlsx";

import ToolBar from "./ToolBar";
import SpreadSheet from "./SpreadSheet";
import ReceiptItemList from "./ReceiptItemList";
import Total from "./Total";

const Tabs = (props) => {
  return (
    <div class="tab-group">
      {props.names.map((name, i) => (
        <div
          key={i}
          onClick={() => props.setSpreadData(i)}
          className="tab-item"
        >
          {name}
        </div>
      ))}
    </div>
  );
};

const Receipt = ({ items, setItems }) => {
  const [xlsxFilePath, setXLSXFile] = useState("./data/test.xlsx");
  const [xlsx, setXLSX] = useState(new XLSX(xlsxFilePath));
  const [spreadData, setSpreadData] = useState([]);

  useEffect(() => {
    xlsx.load().then(() => {
      setXLSX(xlsx);
    });
  });

  const updateItem = (i, { amount, bi }) => {
    let newItems = [...items];
    amount =
      amount === undefined ? newItems[i].amount : parseInt(amount) || 1.0;
    bi = bi === undefined ? newItems[i].bi : parseFloat(bi) || 0.0;

    let pvp = (newItems[i].provider_price * (1 + bi / 100.0)).toFixed(2);
    let total = (pvp * amount).toFixed(2);

    newItems[i] = {
      ...newItems[i],
      amount: amount,
      bi: bi,
      pvp: pvp,
      total: total,
    };

    setItems(newItems);
  };

  const addItemToReceipt = (ref) => {
    if (items.find((e) => e.ref === ref)) return;

    let item = xlsx.searchByReference(ref)[1];
    let provider_price = parseFloat(item[item.length - 1]);
    let newItem = {
      ref: item[0],
      brand: item[1],
      model: item[2],
      description: item[3],
      amount: 1,
      provider_price: provider_price,
      bi: 0,
      pvp: 0,
      total: provider_price,
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (i) => {
    setItems(items.filter((item, j) => parseInt(i) !== j) || []);
  };

  const computeTotal = () => items.reduce((x, e) => x + parseFloat(e.total), 0);

  const changeTab = (i) => {
    setSpreadData(xlsx.pages[i]);
  };

  const updateSearchResults = (e) => {
    let ref = e.target.value;
    setSpreadData(xlsx.searchByReference(ref));
  };

  return (
    <div className="receipt_container">
      <ToolBar updateFile={setXLSXFile} updateSearch={updateSearchResults} />
      <Tabs setSpreadData={changeTab} names={xlsx.sheetNames} />
      <SpreadSheet sheet={spreadData} addItem={addItemToReceipt} />
      <ReceiptItemList
        updateItem={updateItem}
        items={items}
        deleteItem={deleteItem}
      />
      <Total subtotal={computeTotal()} />
    </div>
  );
};

export default Receipt;
