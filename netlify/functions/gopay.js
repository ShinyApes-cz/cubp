export const handler = async (event) => {
  try {
    const body = new URLSearchParams(event.body || "");
    const email = body.get("email") || "test@cubp.cz";

    const auth = Buffer.from(
      process.env.GOPAY_CLIENT_ID + ":" + process.env.GOPAY_CLIENT_SECRET
    ).toString("base64");

    // 1️⃣ Získání OAuth tokenu
    const tokenRes = await fetch("https://gw.sandbox.gopay.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + auth,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials&scope=payment-create"
    });

    const token = await tokenRes.json();

    if (!token.access_token) {
      return {
        statusCode: 500,
        body: "GoPay auth failed: " + JSON.stringify(token)
      };
    }

    // 2️⃣ Vytvoření platby
    const payRes = await fetch("https://gw.sandbox.gopay.com/api/payments/payment", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token.access_token,
        "Content-Type": "application/json"
      },
   body: JSON.stringify({
  target: {
    type: "ACCOUNT",
    goid: process.env.GOPAY_GOID
  },
  amount: 200000,
  currency: "CZK",
  order_number: Date.now().toString(),
  order_description: "CUBP registrace",
  payer: {
    contact: {
      email: email
    }
  },
  callback: {
    return_url: process.env.RETURN_URL
  }
})
    });

    const payment = await payRes.json();

    if (!payment.gw_url) {
      return {
        statusCode: 500,
        body: "Payment creation failed: " + JSON.stringify(payment)
      };
    }

    // 3️⃣ Přesměrování na GoPay
    return {
      statusCode: 302,
      headers: {
        Location: payment.gw_url
      }
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: "Server error: " + e.toString()
    };
  }
};
