import React from "react";

import InputField from "./InputField";

class ClientData extends React.Component {
  render() {
    return (
      <div className="grid-container-client-data">
        <InputField
          title="Nombre"
          update={(e) => this.props.updateData(e, "name")}
        />
        <InputField
          title="Dirección"
          update={(e) => this.props.updateData(e, "address")}
        />
        <InputField title="CP" update={(e) => this.props.updateData(e, "cp")} />
        <InputField
          title="Ciudad"
          update={(e) => this.props.updateData(e, "city")}
        />
        <InputField
          title="CIF/NIF"
          update={(e) => this.props.updateData(e, "nif")}
        />
        <InputField
          title="Emplazamiento instalación"
          update={(e) => this.props.updateData(e, "installationAddress")}
        />
        <InputField
          title="Nº Cliente"
          update={(e) => this.props.updateData(e, "clientNumber")}
        />
        <InputField
          title="Nº presupuesto"
          update={(e) => this.props.updateData(e, "budgetNumber")}
        />
      </div>
    );
  }
}

export default ClientData;
