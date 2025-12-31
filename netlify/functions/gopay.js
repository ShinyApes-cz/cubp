
import fetch from 'node-fetch';

export const handler = async (event) => {
  const params = new URLSearchParams(event.body);
  const amount = 200000;

  const auth = Buffer.from(process.env.GOPAY_CLIENT_ID + ":" + process.env.GOPAY_CLIENT_SECRET).toString("base64");

  const tokenRes = await fetch("https://gw.sandbox.gopay.com/api/oauth2/token", {
    method:"POST",
    headers:{ "Authorization":"Basic "+auth, "Content-Type":"application/x-www-form-urlencoded"},
    body:"grant_type=client_credentials&scope=payment-create"
  });
  const token = await tokenRes.json();

  const payRes = await fetch("https://gw.sandbox.gopay.com/api/payments/payment",{
    method:"POST",
    headers:{ "Authorization":"Bearer "+token.access_token, "Content-Type":"application/json"},
    body: JSON.stringify({
      amount,
      currency:"CZK",
      order_number: Date.now().toString(),
      order_description:"CUBP registrace",
      payer:{ contact:{ email: params.get("email") } },
      callback:{ return_url: process.env.RETURN_URL }
    })
  });
  const payment = await payRes.json();

  return { statusCode:302, headers:{ Location: payment.gw_url } };
};
