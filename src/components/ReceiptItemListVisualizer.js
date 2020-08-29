import React from "react";

class ReceiptItemListVisualizer extends React.Component {
  header = [
    "Item",
    "Marca",
    "Modelo",
    "Descripción",
    "Cantidad",
    "PP",
    "BI",
    "PVP",
    "Total",
  ];

  render() {
    let header = this.header;
    let rows = this.props.items || [];
    return (
        <div id="excel_receipt_container">
          <table className="table-striped">
            <thead>
              <tr>
                {header.map((e, i) => (
                  <th key={i}>{e}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((item, i) => (
                <tr onDoubleClick={() => this.props.onDelete(item.ref)} key={i}>
                  <td> {i} </td>
                  <td> {item.brand} </td>
                  <td> {item.model} </td>
                  <td> {item.description} </td>
                  <td>
                    <input
                      onChange={(e) => this.props.amountUpdate(e, item.ref)}
                      value={item.amount}
                    />
                  </td>
                  <td> {item.provider_price} €</td>
                  <td>
                    <input
                      onChange={(e) => this.props.biUpdate(e, item.ref)}
                      value={item.bi}
                    />
                  </td>
                  <td> {item.pvp} € </td>
                  <td> {item.total} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
  }
}

export default ReceiptItemListVisualizer;
