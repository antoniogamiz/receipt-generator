import React from "react";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: "2px",
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
  const handleFieldChange = (fieldId, value) => {
    let tmp = { ...props.fields[fieldId], value: value };
    props.onUpdate({ ...props.fields, [fieldId]: tmp });
  };

  const fields = Object.keys(props.fields).map((field) => (
    <InputField
      key={field}
      id={field}
      onChange={handleFieldChange}
      value={props.fields[field].value}
      label={props.fields[field].label}
    />
  ));
  return <div className="grid-container-client-data">{fields}</div>;
};

export default ClientData;
