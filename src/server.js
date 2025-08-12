require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const MONO_API_TOKEN = process.env.MONO_API_TOKEN;
const CARD_NUMBER = process.env.CARD_NUMBER; // на випадок, якщо потрібно показувати

app.post('/api/create-mono-payment', async (req, res) => {
  const { amount, comment } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  try {
    // Формуємо payload для Mono API
    const payload = {
      amount: amount * 100, // Mono API приймає копійки
      currency: "UAH",
      description: comment,
      orderId: "order-" + Date.now(),
      // можна додати callbackUrl, redirectUrl тощо
    };

    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': MONO_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'Mono API error', detail: errText });
    }

    const json = await response.json();

    // Mono API повертає paymentUrl у відповіді
    res.json({ paymentUrl: json.invoiceUrl });
  } catch (error) {
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
