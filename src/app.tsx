import React from "react";
import ReactDom from "react-dom";

import ReceiptPage from "./receipt/ReceiptPage";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3),
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ReceiptPage />
    </div>
  );
};

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
