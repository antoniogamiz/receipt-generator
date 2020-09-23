import React from "react";
import { Button, Paper, makeStyles } from "@material-ui/core";
const path = window.require("path");

const useStyles = makeStyles((theme) => ({
  p: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const PDFIncluder = ({ files, onChange }) => {
  const classes = useStyles();

  const handleChange = (e) => {
    let paths = Array.from(e.target.files).map((f) => f.path);
    onChange(paths);
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
