import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import PublishIcon from "@material-ui/icons/Publish";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

const ToolBar = (props) => {
  const updateFile = (e) => {
    if (!e.target.files) return;
    const path = e.target.files[0].path;
    props.onXlsxChange(path);
  };

  const loadJsonFile = (e) => {
    if (!e.target.files) return;
    const path = e.target.files[0].path;
    props.loadJsonFile(path);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper elevation={5}>
        <Grid container spacing={3}>
          <Grid item xs={3} align="center">
            <TextField label="Search by reference" onChange={props.onSearch} />
          </Grid>
          <Grid item xs={3} align="center">
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<AccountBalanceIcon />}
            >
              Catálogo
              <input
                type="file"
                style={{ display: "none" }}
                onChange={updateFile}
                accept=".xlsx"
              />
            </Button>
          </Grid>
          <Grid item xs={3} align="center">
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<PublishIcon />}
            >
              Cargar
              <input
                type="file"
                style={{ display: "none" }}
                onChange={loadJsonFile}
                accept=".json"
              />
            </Button>
          </Grid>
          <Grid item xs={3} align="center">
            <Button
              variant="contained"
              component="label"
              color="primary"
              onClick={props.saveJsonFile}
              startIcon={<GetAppIcon />}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default ToolBar;
