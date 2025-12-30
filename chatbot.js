document.addEventListener("DOMContentLoaded", function () {

  // Create chatbot UI FIRST
  const box = document.createElement("div");
  box.innerHTML = `
    <div id="chatbox">
      <div id="messages"></div>
      <input id="input" placeholder="Ask me anything..." />
    </div>
  `;
  document.body.appendChild(box);

  // NOW the element exists
  const input = document.getElementById("input");

  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const msg = e.target.value;
      e.target.value = "";

      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });

      const data = await res.json();

      document.getElementById("messages").innerHTML += `
        <div><b>You:</b> ${msg}</div>
        <div><b>Bot:</b> ${data.answer}</div>
      `;
    }
  });

});
