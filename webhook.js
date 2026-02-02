const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2

const app = express();
app.use(express.json()); // para ler JSON do POST

const FIREBASE_SECRET = "7LqXTAUY2UlM8fHgABybRexjFktE1xvfSQMVJIal";
const FIREBASE_URL = "https://newbank-de5f3-default-rtdb.firebaseio.com/orders";

app.post('/create_payment', async (req, res) => {
  const data = req.body;
  console.log("Recebido webhook:", data); // para debug

  if (!data.payment || !data.payment.externalReference) {
    return res.status(400).send("No externalReference");
  }

  const orderId = data.payment.externalReference;

  try {
    const response = await fetch(`${FIREBASE_URL}/${orderId}.json?auth=${FIREBASE_SECRET}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment: "paid" })
    });

    const result = await response.text();
    console.log("Firebase atualizado:", result);

    res.send("OK");
  } catch (err) {
    console.error("Erro ao atualizar Firebase:", err);
    res.status(500).send("Erro no Firebase");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Webhook rodando na porta ${PORT}`);
});
