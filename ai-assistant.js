(function () {
  if (window.__AIWidgetLoaded__) return;
  window.__AIWidgetLoaded__ = true;

  function initChatWidget() {
    const widgetContainer = document.createElement("div");
    const shadow = widgetContainer.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap');

        :host {
          all: initial;
          font-family: 'Vazirmatn', sans-serif;
          direction: rtl;
        }

        * {
          box-sizing: border-box;
          font-family: 'Vazirmatn', sans-serif;
        }

        #chat-widget {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 2147483647;
        }

        /* --- دکمه باز کردن چت --- */
        #chat-toggle {
          background: #0073e6;
          color: white;
          border: none;
          border-radius: 32px;
          width: 50px;
          height: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          overflow: hidden;
          transition: width 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
          padding: 0 16px;
          position: relative;
        }

        #chat-toggle svg {
          width: 28px;
          height: 28px;
          transition: transform 0.3s ease;
        }

        #chat-toggle .chat-text {
          font-size: 0.9rem;
          opacity: 0;
          margin-right: 8px;
          white-space: nowrap;
          transform: translateX(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        #chat-toggle:hover {
          width: 180px;
          background-color: #005bb5;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }

        #chat-toggle:hover .chat-text {
          opacity: 1;
          transform: translateX(0);
        }

        #chat-toggle:hover svg {
          transform: scale(0.8);
        }

        /* --- پنجره چت --- */
        #chat-box {
          display: none;
          flex-direction: column;
          width: 320px;
          height: 448px;
          position: fixed;
          bottom: 88px;
          right: 16px;
          background: #f5f5f5;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        #chat-box.active {
          display: flex;
        }

        #chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #0073e6;
          color: white;
          font-weight: 600;
        }

        #chat-header button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        #chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          direction: rtl;
        }

        #chat-messages::-webkit-scrollbar {
          width: 4px;
        }
        #chat-messages::-webkit-scrollbar-thumb {
          background-color: #aaa;
          border-radius: 2px;
        }

        .chat-message {
          max-width: 80%;
          margin: 5px;
          padding: 10px;
          border-radius: 12px;
          font-size: 0.9rem;
          clear: both;
        }

        .chat-user {
          background-color: #d4edda;
          float: left;
          border-bottom-left-radius: 0;
        }

        .chat-admin {
          background-color: #d1e7ff;
          float: right;
          border-bottom-right-radius: 0;
        }

        .chat-meta {
          display: block;
          font-size: 0.75rem;
          color: #666;
          margin-top: 5px;
        }

        #chat-input {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: #fff;
          border-top: 1px solid #ddd;
        }

        #chat-text-box {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 20px;
          padding: 4px 12px;
          display: flex;
          align-items: center;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        #chat-text-box.focused {
          border-color: #0073e6;
          box-shadow: 0 0 4px rgba(0,115,230,0.3);
        }

        #chat-text {
          width: 100%;
          border: none;
          outline: none;
          resize: none;
          font-size: 0.9rem;
          line-height: 1.4;
          padding: 4px 0;
          max-height: calc(1.4em * 3 + 8px);
          overflow-y: auto;
        }

        #chat-text::-webkit-scrollbar {
          width: 4px;
        }
        #chat-text::-webkit-scrollbar-thumb {
          background-color: #aaa;
          border-radius: 2px;
        }

        #chat-send, #chat-clear {
          padding: 0;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }

        #chat-send {
          background: #0073e6;
        }
        #chat-send:hover {
          background: #005bb5;
          transform: scale(1.05);
        }
        #chat-send svg {
          fill: #fff;
          width: 18px;
          height: 18px;
        }

        #chat-clear {
          background: #f0f0f0;
        }
        #chat-clear:hover {
          background: #e0e0e0;
          transform: scale(1.05);
        }
        #chat-clear svg {
          width: 18px;
          height: 18px;
          fill: #555;
        }

        .chat-placeholder {
          color: #999;
          font-style: italic;
          text-align: center;
          margin-top: 20px;
        }

        .chat-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 24px;
        }
        .chat-loading span {
          width: 6px;
          height: 6px;
          background: #4f8aff;
          border-radius: 50%;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .chat-loading span:nth-child(1) { animation-delay: -0.24s; }
        .chat-loading span:nth-child(2) { animation-delay: -0.12s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      </style>

      <div id="chat-widget">
        <button id="chat-toggle" aria-label="باز کردن چت">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12..."/></svg>
          <span class="chat-text">دستیار هوش مصنوعی</span>
        </button>

        <div id="chat-box">
          <div id="chat-header">
            <span>دستیار هوش مصنوعی</span>
            <button id="chat-close">✕</button>
          </div>
          <div id="chat-messages"></div>
          <div id="chat-input">
            <button id="chat-clear" title="پاک کردن گفتگو">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 4H8l-7 16h18a2 2 0 0 0 2-2V4z"/>
              </svg>
            </button>
            <div id="chat-text-box"><textarea id="chat-text" rows="1" placeholder="پیام خود را بنویسید..."></textarea></div>
            <button id="chat-send" title="ارسال پیام">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widgetContainer);

    // عناصر DOM
    const toggle = document.getElementById("chat-toggle");
    const box = document.getElementById("chat-box");
    const messages = document.getElementById("chat-messages");
    const input = document.getElementById("chat-text");
    const send = document.getElementById("chat-send");
    const closeBtn = document.getElementById("chat-header-close");
    const clearBtn = document.getElementById("chat-clear-history");
    const textarea = document.getElementById("chat-text");
    const textareaBox = document.getElementById("chat-text-box");
    const placeholderMessage = document.createElement("div");
    placeholderMessage.id = "chat-placeholder";
    placeholderMessage.className = "chat-message chat-placeholder";
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
        placeholder.id = "chat-placeholder";
        placeholder.className = "chat-message chat-placeholder";
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
      const placeholder = document.getElementById("chat-placeholder");
      if (placeholder) placeholder.remove();
      const div = document.createElement("div");
    //   const time = new Date().toLocaleTimeString([], {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //   });
      div.className =
        "chat-message " + (from === "AI" ? "chat-admin" : "chat-user");
      div.innerHTML = `${msg}`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      saveMessage(msg, from);
    }

    // نمایش لودینگ نقطه‌ای
    function showLoading() {
      const div = document.createElement("div");
      div.className = "chat-message chat-admin loading-message";
      div.innerHTML = `
                <div class="chat-loading">
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

        const res = await fetch("https://bot.sadra-ai.ir/site-chat/send", {
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
