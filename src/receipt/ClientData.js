import React from "react";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
  input: {
    margin: "2px",
    width: "80%",
  },
}));

const NameInput = ({
  name,
  value,
  displayName,
  onChange,
  error,
  helperText,
}) => {
  return (
    <TextField
      label={"Name"}
      key={name}
      error={error}
      helperText={helperText}
      value={value}
      onChange={(e) => onChange(e, name)}
      style={{ margin: "2px", width: "80%" }}
    />
  );
};

const ClientData = (props) => {
  const classes = useStyles();

  const fields = Object.keys(props.fields).map((field) => (
    <Grid item xs={6} align="center">
      <NameInput className={classes.input} onChange={handleFieldChange} />
    </Grid>
  ));
  return (
    <div className={classes.root}>
      <Paper elevation={5}>
        <Grid container spacing={1}>
          {fields}
        </Grid>
      </Paper>
    </div>
  );
};

export default ClientData;
