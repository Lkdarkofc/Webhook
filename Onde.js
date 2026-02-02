// webhook.js
const express = require("express");
const fetch = require("node-fetch"); // ou npm i node-fetch@2
const app = express();

app.use(express.json()); // MUITO IMPORTANTE: lê JSON do Asaas

app.post("/webhook", async (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(400).send("NO DATA");
    }

    const event = data.event;

    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
        const orderId = data.payment?.externalReference;

        if (!orderId) {
            return res.status(400).send("NO ORDERID");
        }

        const secret = "7LqXTAUY2UlM8fHgABybRexjFktE1xvfSQMVJIal";
        const url = `https://newbank-de5f3-default-rtdb.firebaseio.com/orders/${orderId}.json?auth=${secret}`;

        const payload = {
            payment: "paid"
        };

        try {
            const response = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            await response.text(); // força aguardar

            console.log(`Pedido ${orderId} atualizado para paid`);

            return res.status(200).send("OK");
        } catch (err) {
            console.error("Erro ao atualizar Firebase:", err);
            return res.status(500).send("ERROR");
        }
    } else {
        return res.status(200).send("EVENT IGNORED");
    }
});

// Render usa a porta do ambiente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook rodando na porta ${PORT}`);
});
