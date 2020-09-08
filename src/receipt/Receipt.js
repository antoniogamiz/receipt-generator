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
    let newItems = [...items.items];
    amount = amount === undefined ? newItems[i].amount : parseInt(amount) || 0;
    bi = bi === undefined ? newItems[i].bi : parseFloat(bi) || 0.0;

    let pvp = newItems[i].provider_price * (1 + bi / 100.0);
    let total = pvp * amount;

    newItems[i] = {
      ...newItems[i],
      amount: amount,
      bi: bi,
      pvp: pvp,
      total: total,
    };

    setItems({
      ...items,
      unmodifiedItems: newItems,
      items: applyExpectedTotal({ ...items, unmodifiedItems: newItems }),
    });
  };

  const addItemToReceipt = (ref) => {
    if (items.items.find((e) => e.ref === ref)) return;

    let item = xlsx.searchByReference(ref)[1];
    let provider_price = parseFloat(item[item.length - 1]);
    let newItem = {
      ref: item[0],
      brand: item[1],
      model: item[2],
      description: item[3],
      amount: 1,
      provider_price: provider_price,
      bi: 6,
      pvp: provider_price * 1.06,
      total: provider_price,
    };
    const newItems = [...items.items, newItem];

    setItems({
      ...items,
      unmodifiedItems: newItems,
      items: applyExpectedTotal({ ...items, unmodifiedItems: newItems }),
    });
  };

  const deleteItem = (i) => {
    const newItems = items.items.filter((item, j) => parseInt(i) !== j) || [];
    setItems({
      ...items,
      unmodifiedItems: newItems,
      items: applyExpectedTotal({ ...items, unmodifiedItems: newItems }),
    });
  };

  const computeTotal = (items) =>
    items.reduce((x, e) => x + parseFloat(e.total), 0);

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

  const updateExpectedTotal = (e) => {
    const expectedTotal = parseFloat(e.target.value || 0);
    setItems({
      ...items,
      expectedTotal: expectedTotal,
      items: applyExpectedTotal({ ...items, expectedTotal: expectedTotal }),
    });
  };

  const applyExpectedTotal = (items) => {
    if (!items.expectedTotalEnabled) return items.unmodifiedItems;

    let total = computeTotal(items.unmodifiedItems);
    const lambda = (items.expectedTotal || total) / total;

    const newItems = items.unmodifiedItems.map((item) => {
      const newBI = (lambda * (1 + item.bi / 100) - 1) * 100;
      const pvp = item.provider_price * (1 + newBI / 100.0);
      const total = pvp * item.amount;
      return { ...item, bi: newBI, pvp: pvp, total: total };
    });

    return newItems;
  };

  const calculateTotalBenefits = (items) => {
    console.log(items);
    const benefits = items.reduce(
      (accumulator, item) =>
        (item.amount * item.provider_price * item.bi) / 100 + accumulator,
      0
    );
    return benefits;
  };

  const onCheckChange = () => {
    setItems({
      ...items,
      items: applyExpectedTotal({
        ...items,
        expectedTotalEnabled: !items.expectedTotalEnabled,
      }),
      expectedTotalEnabled: !items.expectedTotalEnabled,
    });
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
          items={items.items}
          deleteItem={deleteItem}
        />
        <Total
          subtotal={computeTotal(items.items)}
          expectedTotal={items.expectedTotal}
          onChange={updateExpectedTotal}
          checked={items.expectedTotalEnabled}
          onCheckChange={onCheckChange}
          benefits={calculateTotalBenefits(items.items)}
        />
      </Paper>
    </div>
  );
};

export default Receipt;
