import React from "react";

const InputField = ({ title, onChange, id }) => {
  const handleChange = (event) => {
    const text = event.target.value;
    onChange(id, text);
  };
  return (
    <div className="form-group">
      <label>{title}</label>
      <input
        className="form-control"
        onChange={handleChange}
        placeholder={title}
      />
    </div>
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
      title={props.fields[field].label}
    />
  ));
  return <div className="grid-container-client-data">{fields}</div>;
};

export default ClientData;
