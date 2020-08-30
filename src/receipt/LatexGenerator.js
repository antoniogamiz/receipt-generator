import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import Grid from "@material-ui/core/Grid";

import PDFIncluder from "./PDFIncluder";
import TexMasterSelector from "./TexMasterSelector";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const LatexGenerator = ({ updatePDFFiles, updateTexFile, compile }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        align="center"
        justify="center"
      >
        <Grid item xs={4}>
          <PDFIncluder onChange={updatePDFFiles} />
        </Grid>
        <Grid item xs={4}>
          <TexMasterSelector
            className={classes.child}
            onChange={updateTexFile}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            onClick={compile}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default LatexGenerator;
