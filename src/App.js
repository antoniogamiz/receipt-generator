import React from "react";

import ReceiptPage from "./receipt/ReceiptPage";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3),
  },
}));

const App = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ReceiptPage />
    </div>
  );
};

export default App;
