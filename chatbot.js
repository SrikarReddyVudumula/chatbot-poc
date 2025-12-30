(function () {
  console.log("✅ chatbot.js EXECUTED");

  document.addEventListener("DOMContentLoaded", function () {

    // ---------- UI ----------
    const container = document.createElement("div");
    container.innerHTML = `
      <div id="chatbox" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 320px;
        height: 420px;
        background: #ffffff;
        border: 1px solid #ccc;
        border-radius: 8px;
        z-index: 99999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
        font-family: Arial, sans-serif;
      ">
        <div style="
          padding: 10px;
          background: #0a66c2;
          color: #fff;
          font-weight: bold;
          border-radius: 8px 8px 0 0;
        ">
          Virtual Assistant
        </div>
        <div id="messages" style="
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          font-size: 14px;
        "></div>
        <input
          id="input"
          placeholder="Ask me anything…"
          style="
            border: none;
            border-top: 1px solid #ddd;
            padding: 10px;
            font-size: 14px;
            outline: none;
          "
        />
      </div>
    `;
    document.body.appendChild(container);

    const messages = document.getElementById("messages");
    const input = document.getElementById("input");

    let awaitingEmail = false;

    // ---------- Tealium helper ----------
    function track(eventData) {
      if (window.utag) {
        utag.link(eventData);
      }
    }

    // ---------- Mock chatbot logic ----------
    async function getBotResponse(message) {
      const msg = message.toLowerCase();

      if (msg.includes("product") || msg.includes("documentation")) {
        return `You can find detailed product information in this PDF:
https://example.com/product-information-guide.pdf`;
      }

      if (msg.includes("shipping")) {
        return "Orders are shipped after checkout. Shipping details are available during the checkout process.";
      }

      if (msg.includes("sales") || msg.includes("contact")) {
        awaitingEmail = true;
        return "Sure 🙂 Please share your email address and our sales team will contact you.";
      }

      if (msg.includes("category")) {
        return "We offer categories such as Men's Apparel, Women's Apparel, Accessories, Footwear, and Lifestyle products.";
      }

      return "I can help you with product information, shipping details, or connecting you with sales.";
    }

    // ---------- Event handling ----------
    input.addEventListener("keydown", async function (e) {
      if (e.key !== "Enter") return;

      const userMessage = input.value.trim();
      if (!userMessage) return;
      input.value = "";

      messages.innerHTML += `<div><b>You:</b> ${userMessage}</div>`;

      // Email capture flow
      if (awaitingEmail) {
        awaitingEmail = false;

        messages.innerHTML += `<div><b>Bot:</b> Thanks! Our sales team will reach out to you shortly.</div>`;

        track({
          event_name: "chatbot_sales_lead_submitted",
          user_email: userMessage
        });

        return;
      }

      track({
        event_name: "chatbot_question_asked",
        chatbot_question: userMessage
      });

      const botReply = await getBotResponse(userMessage);

      messages.innerHTML += `<div><b>Bot:</b> ${botReply.replace(/\n/g, "<br>")}</div>`;
      messages.scrollTop = messages.scrollHeight;
    });

    // ---------- Initial message ----------
    messages.innerHTML += `<div><b>Bot:</b> Hi 👋 I can help you with products, shipping, or connecting you to sales.</div>`;

    track({ event_name: "chatbot_loaded" });
  });
})();
