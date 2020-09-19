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

const NameInput = ({ onChange, ...props }) => {
  const field = "name";
  return (
    <TextField
      label={"Name"}
      key={field}
      value={field}
      onChange={(e) => onChange(e, field)}
      style={{ margin: "2px", width: "80%" }}
    />
  );
};

const ClientData = (props) => {
  const classes = useStyles();

  const handleFieldChange = (e, fieldId) => {
    const value = e.target.value;
    let tmp = { ...props.fields[fieldId], value: value };
    props.onClientDataChange({ ...props.fields, [fieldId]: tmp });
  };

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
