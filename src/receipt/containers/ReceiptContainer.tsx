import React from "react";
import { Tab, Box, Paper } from "@material-ui/core";

import ToolBar from "../ToolBar";
import SpreadSheet from "../SpreadSheet";
import ReceiptItemList from "../ReceiptItemList";
import Total from "../Total";
import { applyExpectedTotal, Receipt } from "../../utils/Receipt";

const SpreadTabs = (props: any) => {
  if (!props.names) return <div></div>;
  return (
    <Box border={1} borderColor="primary.main">
      {props.names.map((name: string, i: number) => (
        <Tab label={name} onClick={() => props.setSpreadData(i)} />
      ))}
    </Box>
  );
};

interface state {
  spreadData: any[];
}

interface props {
  xlsx: any;
  receipt: Receipt;
  onAddItem: (reference: string) => void;
  onUpdateItem: (
    reference: string,
    { bi, amount }: { bi?: number | undefined; amount?: number | undefined }
  ) => void;
  onDeleteItem: (reference: string) => void;
  onExpectedTotalChange: (total: number) => void;
  enableTotalExpected: () => void;
  enableGeneralExpenses: () => void;
  onXlsxChange: (path: string) => void;
}

class ReceiptContainer extends React.Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      spreadData: [],
    };
  }

  onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!this.props.xlsx) return;
    const ref: string = e.target.value;
    const results = this.props.xlsx
      .searchByReference(ref)
      .map((row: any[]) => [...row.slice(0, 4), row[row.length - 1]]);
    results.length
      ? this.setState({ spreadData: results })
      : this.setState({ spreadData: this.props.xlsx.pages[0] });
  };

  onChangeTab = (i: number) => {
    this.setState({ spreadData: this.props.xlsx.pages[i] });
  };

  render() {
    return (
      <div style={{ margin: "5px" }}>
        <ToolBar
          onXlsxChange={this.props.onXlsxChange}
          onSearch={this.onSearch}
        />
        <Paper elevation={2} style={{ marginTop: "20px" }}>
          <SpreadTabs
            setSpreadData={this.onChangeTab}
            names={this.props.xlsx.sheetNames}
          />
          <SpreadSheet
            sheet={this.state.spreadData}
            onAddItem={this.props.onAddItem}
          />
          <ReceiptItemList
            items={applyExpectedTotal(this.props.receipt)}
            onUpdateItem={this.props.onUpdateItem}
            onDeleteItem={this.props.onDeleteItem}
          />
          <Total
            receipt={this.props.receipt}
            onExpectedTotalChange={this.props.onExpectedTotalChange}
            enableTotalChange={this.props.enableTotalExpected}
            enableGeneralExpenses={this.props.enableGeneralExpenses}
          />
        </Paper>
      </div>
    );
  }
}

export default ReceiptContainer;
