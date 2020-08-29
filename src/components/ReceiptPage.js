import React from "react";
import XLSX from "../utils/xlsx";

import NavBar from "./NavBar";
import ClientData from "./ClientData";
import PDFIncluder from "./PDFIncluder";
import LatexGenerator from "./LatexGenerator";
import Receipt from "../receipt/Receipt";

class ReceiptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfFiles: [],
      clientData: {
        name: "",
        address: "",
        cp: "0",
        city: "",
        nif: "",
        installationAddress: "",
        clientNumber: "",
        budgetNumber: "",
      },
      mainTexFile: "",
    };

    this.updatePDFFiles = this.updatePDFFiles.bind(this);
    this.updateClientData = this.updateClientData.bind(this);
    this.updateTexFile = this.updateTexFile.bind(this);
  }

  updateTexFile(e) {
    this.setState({ mainTexFile: e.target.files[0].path });
  }

  updateClientData(e, field) {
    let old = this.state.clientData;
    let newClientData = {
      ...old,
      [field]: e.target.value,
    };
    this.setState({ clientData: newClientData });
  }

  updatePDFFiles(e) {
    let paths = Array.from(e.target.files).map((f) => f.path);
    this.setState({ pdfFiles: paths });
  }

  render() {
    let nameFiles = this.state.pdfFiles.map((f) => f.replace(/^.*[\\\/]/, ""));
    return (
      <div className="window-content">
        <div className="pane-group">
          <div className="pane">
            <Receipt />
            <ClientData updateData={this.updateClientData} />
            <PDFIncluder files={nameFiles} updateFile={this.updatePDFFiles} />
            <LatexGenerator updateTexFile={this.updateTexFile} />
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiptPage;
