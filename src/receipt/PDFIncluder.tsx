import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
const path = window.require("path");

const useStyles = makeStyles((theme) => ({
  p: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

const PDFIncluder = ({ onChange }) => {
  const classes = useStyles();
  const [files, setFiles] = useState(["No PDF files selected"]);

  const handleChange = (e) => {
    let paths = Array.from(e.target.files).map((f) => f.path);
    onChange(paths);
    setFiles(paths);
  };
  return (
    <div>
      <Button variant="contained" component="label">
        Upload File
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleChange}
          multiple="multiple"
          accept=".pdf"
        />
      </Button>
      <Paper className={classes.p}>
        {files.map((f) => path.basename(f)).join(", ")}
      </Paper>
    </div>
  );
};

export default PDFIncluder;
