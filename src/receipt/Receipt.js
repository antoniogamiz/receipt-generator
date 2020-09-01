/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import XLSX from "../utils/xlsx";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import ToolBar from "./ToolBar";
import SpreadSheet from "./SpreadSheet";
import ReceiptItemList from "./ReceiptItemList";
import Total from "./Total";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

const SpreadTabs = (props) => {
  if (!props.names.length) return "";
  return (
    <Box border={1} borderColor="primary.main">
      {props.names.map((name, i) => (
        <Tab label={name} onClick={() => props.setSpreadData(i)} />
      ))}
    </Box>
  );
};

const Receipt = ({ items, setItems }) => {
  const [xlsx, setXLSX] = useState();
  const [spreadData, setSpreadData] = useState([]);

  const handleXLSXChange = (path) => {
    const newXLSX = new XLSX(path);
    newXLSX.load().then(() => setXLSX(newXLSX));
  };

  const updateItem = (i, { amount, bi }) => {
    let newItems = [...items];
    amount =
      amount === undefined ? newItems[i].amount : parseInt(amount) || 1.0;
    bi = bi === undefined ? newItems[i].bi : parseFloat(bi) || 0.0;

    let pvp = newItems[i].provider_price * (1 + bi / 100.0);
    let total = pvp * amount;
    console.log(pvp);
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
      pvp: provider_price,
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
    if (!xlsx) return;
    const ref = e.target.value;
    const results = xlsx
      .searchByReference(ref)
      .map((row) => [...row.slice(0, 4), row[row.length - 1]]);
    if (results.length) setSpreadData(results);
    else setSpreadData(xlsx.pages[0]);
  };

  useEffect(() => {
    if (xlsx !== undefined && !spreadData.length) {
      setSpreadData(xlsx.pages[0]);
    }
  }, []);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ToolBar
        updateFile={handleXLSXChange}
        updateSearch={updateSearchResults}
      />
      <Paper elevation={2} style={{ marginTop: "20px" }}>
        {xlsx !== undefined ? (
          <>
            <SpreadTabs setSpreadData={changeTab} names={xlsx.sheetNames} />
            <SpreadSheet sheet={spreadData} addItem={addItemToReceipt} />
          </>
        ) : (
          ""
        )}
        <ReceiptItemList
          updateItem={updateItem}
          items={items}
          deleteItem={deleteItem}
        />
        <Total subtotal={computeTotal()} />
      </Paper>
    </div>
  );
};

export default Receipt;
