import React from "react";
import { Button, Paper, Grid, makeStyles } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import PDFIncluder from "./PDFIncluder";
import TexMasterSelector from "./TexMasterSelector";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

type LatexGeneratorProps = {
  compile: () => void;
  pdfFiles: string[];
  onPdfFilesChange: (files: string[]) => void;
  texFile: string;
  onTexFileChange: (file: string) => void;
}

const LatexGenerator = (props: LatexGeneratorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={5} className={classes.paper}>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
        >
          <Grid item xs={4}>
            <PDFIncluder files={props.pdfFiles} onChange={props.onPdfFilesChange} />
          </Grid>
          <Grid item xs={4}>
            <TexMasterSelector
              file={props.texFile}
              onChange={props.onTexFileChange}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              onClick={props.compile}
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default LatexGenerator;
