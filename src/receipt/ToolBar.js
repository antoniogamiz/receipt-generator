import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "5px",
  },
}));

const ToolBar = (props) => {
  const updateFile = (e) => {
    const path = e.target.files[0].path;
    props.updateFile(path);
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <input
            className="form-control"
            placeholder="Reference"
            id="search-reference"
            onChange={props.updateSearch}
          />{" "}
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            component="label"
            color="primary"
            size="small"
            startIcon={<InsertDriveFileIcon />}
            style={{ height: "20px", padding: "12px" }}
          >
            XSLX file
            <input
              type="file"
              style={{ display: "none" }}
              onChange={updateFile}
              accept=".xlsx"
            />
          </Button>{" "}
        </Grid>
      </Grid>
    </div>
  );
};

export default ToolBar;
