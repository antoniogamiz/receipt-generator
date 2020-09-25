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

const TexMasterSelector = ({ file, onChange }) => {
  const classes = useStyles();

  const handleChange = (e) => {
    const path = e.target.files[0].path;
    onChange(path);
  };

  return (
    <div>
      <Button variant="contained" component="label">
        Select .tex file
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleChange}
          accept=".tex"
        />
      </Button>
      <Paper className={classes.p}>{path.basename(file)}</Paper>
    </div>
  );
};

export default TexMasterSelector;
