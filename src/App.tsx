import React from "react";

import AppContainer from "./receipt/containers/AppContainer";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3),
  },
}));

const App = (props: {}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppContainer />
    </div>
  );
};

export default App;
