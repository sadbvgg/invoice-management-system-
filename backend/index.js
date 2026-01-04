import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- AUTH ---------- */
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?,?,?)",
    [name, email, hashed],
    err => {
      if (err) return res.status(400).json({ error: "User exists" });
      res.json({ message: "User created" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login success" });
  });
});

/* ---------- INVOICES ---------- */
app.get("/invoices", (_, res) => {
  db.all("SELECT * FROM invoices", [], (err, rows) => {
    res.json(rows);
  });
});

app.post("/invoices", (req, res) => {
  const { invoice_no, client, date, amount, status } = req.body;

  db.run(
    `INSERT INTO invoices (invoice_no, client, date, amount, status)
     VALUES (?,?,?,?,?)`,
    [invoice_no, client, date, amount, status],
    () => res.json({ message: "Invoice added" })
  );
});

app.put("/invoices/:id", (req, res) => {
  const { client, date, amount, status } = req.body;

  db.run(
    `UPDATE invoices SET client=?, date=?, amount=?, status=? WHERE id=?`,
    [client, date, amount, status, req.params.id],
    () => res.json({ message: "Updated" })
  );
});

app.delete("/invoices/:id", (req, res) => {
  db.run("DELETE FROM invoices WHERE id=?", [req.params.id], () =>
    res.json({ message: "Deleted" })
  );
});

app.listen(5000, () => console.log("Backend running on 5000"));
