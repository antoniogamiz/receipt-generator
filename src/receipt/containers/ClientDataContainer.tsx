import React from "react";

import { Grid, Paper, TextField } from "@material-ui/core";

export type Entry<T> = {
  displayName: string;
  value: T;
  // validate?:
};

const keys = ["name", "address", "cp", "nif", "installationAddress", "installationType", "mobile", "email", "azimut", "clientNumber", "budgetNumber"] as const;
export type ClientDataKeys = typeof keys[number];

export type ClientData = {
  name: Entry<string>
  address: Entry<string>
  city: Entry<string>
  cp: Entry<number>
  nif: Entry<string>
  installationAddress: Entry<string>
  installationType: Entry<string>
  mobile: Entry<number>
  email: Entry<string>
  azimut: Entry<string>
  clientNumber: Entry<string>
  budgetNumber: Entry<string>
}

type ClientDataProps = {
  onChange: (field: keyof ClientData, value: string | number) => void;
  entries: ClientData;
};

class ClientDataContainer extends React.Component<ClientDataProps> {
  render() {
    const inputs = keys.map((key, i) => {
      return (
        <Grid key={i} item xs={6}>
          <TextField
            label={this.props.entries[key].displayName}
            value={this.props.entries[key].value || ""}
            onChange={(e) => this.props.onChange(key, e.currentTarget.value)}
            style={{ margin: "2px", width: "80%" }} />
        </Grid>
      )
    });

    return (
      <div>
        <Paper elevation={5}>
          <Grid container spacing={1} alignItems="center">
            {inputs}
          </Grid>
        </Paper>
      </div>
    );
  }
}
export default ClientDataContainer;
