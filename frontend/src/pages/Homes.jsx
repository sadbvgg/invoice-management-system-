import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/invoices")
      .then(res => res.json())
      .then(setInvoices);
  }, []);

  const del = id => {
    fetch(`http://localhost:5000/invoices/${id}`, { method: "DELETE" })
      .then(() => setInvoices(invoices.filter(i => i.id !== id)));
  };

  return (
    <div>
      <h2>Invoices</h2>
      <button onClick={() => nav("/add")}>Add Invoice</button>

      {invoices.map(i => (
        <div key={i.id}>
          {i.invoice_no} | {i.client} | ₹{i.amount} | {i.status}
          <button onClick={() => del(i.id)}>❌</button>
        </div>
      ))}
    </div>
  );
}
