(function () {
  console.log("✅ chatbot.js EXECUTED");

  // -------------------------------
  // Initialize chatbot UI
  // -------------------------------
  function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}
  function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
  function initChatbot() {
    console.log("✅ Initializing chatbot UI");

    // Avoid duplicate injection
    if (document.getElementById("chatbox")) {
      return;
    }

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
        z-index: 999999;
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
          id="chatbot-input"
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
    const input = document.getElementById("chatbot-input");

    let awaitingEmail = false;

    // -------------------------------
    // Tealium helper
    // -------------------------------
    function track(eventData) {
      if (window.utag) {
        utag.link(eventData);
      }
    }

    // -------------------------------
    // Initial message
    // -------------------------------
    messages.innerHTML += `
  <div><b>Bot:</b> ${linkify(botReply).replace(/\n/g, "<br>")}</div>
`;

    track({ event_name: "chatbot_loaded" });

    // -------------------------------
    // Mock chatbot logic (Option A)
    // -------------------------------
    async function getBotResponse(message) {
      const msg = message.toLowerCase();

      if (msg.includes("product") || msg.includes("documentation")) {
        return `You can find detailed product information here:
https://example.com/product-information-guide.pdf`;
      }

      if (msg.includes("shipping")) {
        return "Orders are shipped after checkout. Shipping details are shown during the checkout process.";
      }

      if (msg.includes("sales") || msg.includes("contact")) {
        awaitingEmail = true;
        return "Sure 🙂 Please share your email address and our sales team will contact you.";
      }

      if (msg.includes("category")) {
        return "We offer Men's Apparel, Women's Apparel, Accessories, Footwear, and Lifestyle products.";
      }

      return "I can help with product details, shipping info, or connecting you with sales.";
    }

    // -------------------------------
    // Input handler
    // -------------------------------
    input.addEventListener("keydown", async function (e) {
      if (e.key !== "Enter") return;

      const userMessage = input.value.trim();
      if (!userMessage) return;

      input.value = "";
      messages.innerHTML += `<div><b>You:</b> ${userMessage}</div>`;

      // Email capture flow
      if (awaitingEmail) {
  if (!isValidEmail(userMessage)) {
    messages.innerHTML += `
      <div><b>Bot:</b> That doesn’t look like a valid email. Could you please enter a valid email address?</div>
    `;
    messages.scrollTop = messages.scrollHeight;
    return;
  }

  awaitingEmail = false;

  messages.innerHTML += `
    <div><b>Bot:</b> Thanks! Our sales team will reach out to you shortly.</div>
  `;

  track({
    event_name: "chatbot_sales_lead_submitted",
    user_email: userMessage
  });

  messages.scrollTop = messages.scrollHeight;
  return;
}


      track({
        event_name: "chatbot_question_asked",
        chatbot_question: userMessage
      });

      const botReply = await getBotResponse(userMessage);

      messages.innerHTML += `
        <div><b>Bot:</b> ${botReply.replace(/\n/g, "<br>")}</div>
      `;

      messages.scrollTop = messages.scrollHeight;
    });
  }

  // -------------------------------
  // 🔥 Tealium-safe execution
  // -------------------------------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();


