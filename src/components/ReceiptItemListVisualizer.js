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
    let subtotal = rows.reduce((x, e) => x + parseFloat(e.total), 0);
    return (
      <>
        <div id="excel_worksheet_container">
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
        <div id="total_table">
          <table className="table-striped">
            <thead>
              <tr>
                <th>Subtotal</th>
                <th>IVA (21%)</th>
                <th>Gastos Generales</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> {subtotal.toFixed(2)} €</td>
                <td> {(subtotal * 0.21).toFixed(2)} €</td>
                <td> {(subtotal * 0.13).toFixed(2)} € </td>
                <td> {(subtotal * (1.0 + 0.21 + 0.13)).toFixed(2)} € </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default ReceiptItemListVisualizer;
