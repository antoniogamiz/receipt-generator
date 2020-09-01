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

const InputField = ({ label, onChange, id }) => {
  const classes = useStyles();

  const handleChange = (event) => {
    const text = event.target.value;
    onChange(id, text);
  };

  return (
    <TextField
      className={classes.input}
      label={label}
      id="standard-password-input"
      onChange={handleChange}
    />
  );
};

const ClientData = (props) => {
  const classes = useStyles();

  const handleFieldChange = (fieldId, value) => {
    let tmp = { ...props.fields[fieldId], value: value };
    props.onUpdate({ ...props.fields, [fieldId]: tmp });
  };

  const fields = Object.keys(props.fields).map((field) => (
    <Grid item xs={6} align="center">
      <InputField
        key={field}
        id={field}
        onChange={handleFieldChange}
        value={props.fields[field].value}
        label={props.fields[field].label}
        className={classes.input}
      />
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
