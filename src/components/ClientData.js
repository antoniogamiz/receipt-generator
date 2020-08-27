import React from "react";

import InputField from "./InputField";

class ClientData extends React.Component {
  render() {
    return (
      <div class="grid-container-client-data">
        <InputField title="Nombre" />
        <InputField title="Dirección" />
        <InputField title="CP" />
        <InputField title="Ciudad" />
        <InputField title="CIF/NIF" />
        <InputField title="Emplazamiento instalación" />
        <InputField title="Nº Cliente" />
        <InputField title="Nº presupuesto" />
      </div>
    );
  }
}

export default ClientData;
