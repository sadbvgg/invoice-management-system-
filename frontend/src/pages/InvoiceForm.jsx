import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InvoiceForm() {
  const [data, setData] = useState({});
  const nav = useNavigate();

  const submit = async () => {
    await fetch("http://localhost:5000/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    nav("/home");
  };

  return (
    <div>
      <h2>Add Invoice</h2>
      <input placeholder="Invoice No" onChange={e => setData({ ...data, invoice_no: e.target.value })} />
      <input placeholder="Client" onChange={e => setData({ ...data, client: e.target.value })} />
      <input type="date" onChange={e => setData({ ...data, date: e.target.value })} />
      <input placeholder="Amount" onChange={e => setData({ ...data, amount: e.target.value })} />
      <select onChange={e => setData({ ...data, status: e.target.value })}>
        <option>Paid</option>
        <option>Unpaid</option>
        <option>Pending</option>
      </select>
      <button onClick={submit}>Save</button>
    </div>
  );
}
