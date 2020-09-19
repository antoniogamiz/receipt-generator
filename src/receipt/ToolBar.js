import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

const ToolBar = (props) => {
  const updateFile = (e) => {
    const path = e.target.files[0].path;
    props.onXlsxChange(path);
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={5}>
        <Grid container spacing={3}>
          <Grid item xs={6} align="center">
            <TextField label="Search by reference" onChange={props.onSearch} />
          </Grid>
          <Grid item xs={6} align="center">
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<InsertDriveFileIcon />}
            >
              XSLX file
              <input
                type="file"
                style={{ display: "none" }}
                onChange={updateFile}
                accept=".xlsx"
              />
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default ToolBar;
