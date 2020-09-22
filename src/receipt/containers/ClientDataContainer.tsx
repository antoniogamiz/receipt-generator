import React from "react";

import TextField from "@material-ui/core/TextField";
import { Grid, GridSize } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

export type Entry = {
  name: string;
  value: string | number;
  displayName: string;
};

export type ClientData = Entry[];

const InputWrapper = (props: {
  name: string;
  value: string | number;
  displayName: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}) => {
  return (
    <TextField
      label={props.displayName}
      key={props.name}
      value={props.value}
      onChange={props.onChange}
      style={{ margin: "2px", width: "80%" }}
    />
  );
};

type ClientDataProps = {
  onClientDataChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  entries: ClientData;
};

class ClientDataContainer extends React.Component<ClientDataProps> {
  render() {
    const fields = this.props.entries.map((entry: Entry) => {
      const colWidth: GridSize = 6;
      return (
        <Grid item xs={colWidth} alignItems="center">
          <InputWrapper
            name={entry.name}
            displayName={entry.displayName}
            value={entry.value}
            onChange={this.props.onClientDataChange}
          />
        </Grid>
      );
    });

    return (
      <div style={{ margin: "5px" }}>
        <Paper elevation={5}>
          <Grid container spacing={1}>
            {fields}
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default ClientDataContainer;
