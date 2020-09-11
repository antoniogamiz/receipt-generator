import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
const path = window.require("path");

const useStyles = makeStyles((theme) => ({
  p: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const TexMasterSelector = ({ onChange }) => {
  const classes = useStyles();
  const [file, setFile] = useState("No tex file selected");

  const handleChange = (e) => {
    let path = e.target.files[0].path;
    onChange(path);
    setFile(path);
  };

  return (
    <div>
      <Button variant="contained" component="label">
        Select .tex file
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleChange}
          multiple="multiple"
          accept=".tex"
        />
      </Button>
      <Paper className={classes.p}>{path.basename(file)}</Paper>
    </div>
  );
};

export default TexMasterSelector;
