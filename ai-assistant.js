(function () {
  function initChatWidget() {
    if (window.__ChatWidgetLoaded__) return;
    window.__ChatWidgetLoaded__ = true;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "http://cdn.sadra-ai.ir/ai-assistant.css";
    document.head.appendChild(link);

    const widget = document.createElement("div");
    widget.id = "chat-widget-23f7a9";
    widget.innerHTML = `
        <button id="chat-toggle-23f7a9" aria-label="باز و بسته کردن چت">
            <svg xmlns="http://www.w3.org/2000/svg" class="chat-icon1-23f7a9" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="chat-icon-23f7a9" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
            <span class="chat-text-23f7a9">دستیار هوش مصنوعی</span>
        </button>

        <div id="chat-box-23f7a9" style="display:none; flex-direction: column;">
            <div id="chat-header-23f7a9">
                <span id="chat-header-logo-23f7a9">دستیار هوش مصنوعی</span>
               
                <button id="chat-header-close-23f7a9" aria-label="بستن چت">✕</button>
            </div>
            <div id="chat-messages-23f7a9" style="flex-grow:1; overflow-y:auto; max-height:344px; padding:10px;"></div>
            <div id="chat-input-23f7a9">
             <button id="chat-send-23f7a9" aria-label="ارسال پیام">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
                    </svg>
                </button>
                <div id="chat-text-box-23f7a9">
                    <textarea id="chat-text-23f7a9" placeholder="پیام خود را بنویسید..." rows="1"></textarea>
                </div>
             <button id="chat-clear-history-23f7a9" aria-label="پاک کردن تاریخچه">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
  </svg>
             </button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // عناصر DOM
    const toggle = document.getElementById("chat-toggle-23f7a9");
    const box = document.getElementById("chat-box-23f7a9");
    const messages = document.getElementById("chat-messages-23f7a9");
    const input = document.getElementById("chat-text-23f7a9");
    const send = document.getElementById("chat-send-23f7a9");
    const closeBtn = document.getElementById("chat-header-close-23f7a9");
    const clearBtn = document.getElementById("chat-clear-history-23f7a9");
    const textarea = document.getElementById("chat-text-23f7a9");
    const textareaBox = document.getElementById("chat-text-box-23f7a9");
    const placeholderMessage = document.createElement("div");
    placeholderMessage.id = "chat-placeholder-23f7a9";
    placeholderMessage.className = "chat-message-23f7a9 chat-placeholder-23f7a9";
    placeholderMessage.innerHTML = "من دستیار فروش بلیت قطار، هواپیما و اتوبوس هستم.<br>برای شروع، قصد دارید به کجا سفر کنید؟";
    messages.appendChild(placeholderMessage);

    clearBtn.addEventListener("click", () => {
        localStorage.removeItem("chat_history");
        localStorage.removeItem("chat_session_id");
        sessionId = "";
        messages.innerHTML = "";
        showPlaceholderIfEmpty();
    });

    textarea.addEventListener("focus", () =>
      textareaBox.classList.add("focused")
    );
    textarea.addEventListener("blur", () =>
      textareaBox.classList.remove("focused")
    );

    textarea.addEventListener("input", () => {
      textarea.style.height = "auto"; // ابتدا ریست ارتفاع
      textarea.style.height =
        Math.min(textarea.scrollHeight, 3 * 24 + 16) + "px";
    });
    // مدیریت session_id از localStorage
    let sessionId = localStorage.getItem("chat_session_id") || "";

    // باز و بسته کردن چت
    toggle.onclick = () => {
      const isOpen = box.style.display === "flex";
      box.style.display = isOpen ? "none" : "flex";
    };

    closeBtn.onclick = () => (box.style.display = "none");
    
    // نمایش متن اولیه در صورت نبودن پیام
    function showPlaceholderIfEmpty() {
      if (!messages.hasChildNodes()) {
        const placeholder = document.createElement("div");
        placeholder.id = "chat-placeholder-23f7a9";
        placeholder.className = "chat-message-23f7a9 chat-placeholder-23f7a9";
        placeholder.innerHTML = "من دستیار فروش بلیت قطار، هواپیما و اتوبوس هستم.<br>برای شروع، قصد دارید به کجا سفر کنید؟";
        messages.appendChild(placeholder);
      }
    }

    // بارگذاری تاریخچه از localStorage
    function loadChatHistory() {
      const saved = localStorage.getItem("chat_history");
      if (saved) {
        const history = JSON.parse(saved);
        history.forEach((item) => appendMessage(item.msg, item.from));
      }
      showPlaceholderIfEmpty();
    }
    loadChatHistory();

    // ذخیره پیام در تاریخچه
    function saveMessage(msg, from) {
      let history = JSON.parse(localStorage.getItem("chat_history") || "[]");
      history.push({ msg, from });
      localStorage.setItem("chat_history", JSON.stringify(history));
    }

    // افزودن پیام در چت
    function appendMessage(msg, from = "شما") {
      const placeholder = document.getElementById("chat-placeholder-23f7a9");
      if (placeholder) placeholder.remove();
      const div = document.createElement("div");
    //   const time = new Date().toLocaleTimeString([], {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //   });
      div.className =
        "chat-message-23f7a9 " + (from === "AI" ? "chat-admin-23f7a9" : "chat-user-23f7a9");
      div.innerHTML = `${msg}`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      saveMessage(msg, from);
    }

    // نمایش لودینگ نقطه‌ای
    function showLoading() {
      const div = document.createElement("div");
      div.className = "chat-message-23f7a9 chat-admin-23f7a9 loading-message-23f7a9";
      div.innerHTML = `
                <div class="chat-loading-23f7a9">
                    <span></span><span></span><span></span>
                </div>
            `;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    async function sendMessageToServer(message) {
      const loading = showLoading(); // 🔹 نمایش لودینگ قبل از ارسال
      try {
        const payload = {
          message,
          session_id: sessionId || "",
          user_name: "",
        };

        const res = await fetch("https://bot.6or.ir/site-chat/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("خطا در ارتباط با سرور");

        const data = await res.json();

        // حذف لودینگ
        loading.remove();

        // ذخیره session_id
        if (data.session_id && !sessionId) {
          sessionId = data.session_id;
          localStorage.setItem("chat_session_id", sessionId);
        }

        // نمایش پاسخ
        appendMessage(data.response || "پاسخی از سرور دریافت نشد ❌", "AI");
      } catch (err) {
        console.error(err);
        loading.remove();
        appendMessage(
          "⚠️ خطایی در ارتباط با سرور رخ داد. لطفاً دوباره تلاش کنید.",
          "AI"
        );
      }
    }

    // ارسال پیام کاربر
    send.onclick = async () => {
      const msg = input.value.trim();
      if (!msg) return;

      appendMessage(msg, "شما");
      input.value = "";
      textarea.style.height = "auto";
      await sendMessageToServer(msg);
    };

    // ارسال با Enter
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send.click();
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatWidget);
  } else {
    initChatWidget();
  }
})();
