
    const chatBox = document.getElementById("chat");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");

    sendBtn.addEventListener("click", sendMessage);

    async function sendMessage() {
      const userMessage = userInput.value.trim();
      if (!userMessage) return;

      userInput.value = "";
      addMessage("You", userMessage, "user");

      try {
        addMessage("Captain Codebeard", "⏳ Thinking, matey...", "bot", true);

        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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", // Replace with your token
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `You are a friendly pirate AI named Captain Codebeard who helps people and says 'Arr!' a lot.\nUser: ${userMessage}\nAI:`,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7
            }
          })
        });

        const data = await response.json();
        const output = data[0]?.generated_text?.split("AI:")[1]?.trim() || "☠️ Arr! I be tongue-tied, matey!";
        const pendingEl = document.querySelector(".bot.pending");
        if (pendingEl) {
          pendingEl.innerHTML = `<strong>Captain Codebeard:</strong> ${output}`;
          pendingEl.classList.remove("pending");
        }

      } catch (error) {
        console.error(error);
        const pendingEl = document.querySelector(".bot.pending");
        if (pendingEl) {
          pendingEl.innerHTML = `<strong>Captain Codebeard:</strong> ☠️ Arr! Something went wrong with me brain, matey!`;
          pendingEl.classList.remove("pending");
        }
      }
    }

    function addMessage(sender, text, role = "bot", pending = false) {
      const div = document.createElement("div");
      div.className = `msg ${role} ${pending ? "pending" : ""}`;
      div.innerHTML = `<strong>${sender}:</strong> ${text}`;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    }