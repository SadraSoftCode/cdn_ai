(function () {
  const defaultConfig = {
    bottom: 16, // فاصله از پایین اگر مثبت، فاصله از بالا اگر منفی
    right: 16,   // فاصله از راست اگر مثبت، فاصله از چپ اگر منفی
    placeholder: "سلام! 👋 <br/> من دستیار هوشمند هستم. چطور می‌تونم کمکتون کنم؟"
  };
  const userConfig = window.AIChatWidgetConfig || {};
  const config = { ...defaultConfig, ...userConfig };

  function initChatWidget() {
    if (window.__ChatWidgetLoaded__) return;
    window.__ChatWidgetLoaded__ = true;

    // ایجاد host element
    const host = document.createElement("div");
    host.id = "chat-widget-container";
    document.body.appendChild(host);

    // ایجاد Shadow DOM
    const shadow = host.attachShadow({ mode: "open" });

    // اضافه کردن استایل‌ها
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap');
      
      :host {
        all: initial;
      }
      
      #chat-widget, 
      #chat-widget * {
        font-family: 'Vazirmatn', sans-serif !important;
        direction: rtl;
        text-align: right;
        box-sizing: border-box;
      }

      #chat-widget {
        z-index: 2147483647;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }

      /* Chat Toggle Button */
      #chat-toggle {
        background: #00f8fb;
        color: #ffff;
        border: none;
        border-radius: 32px;
        width: 50px;
        height: 50px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(2, 177, 246, 0.3);
        overflow: hidden;
        transition: width 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        padding: 0 16px;
        position: relative;
      }

      /* آیکون */
      #chat-toggle .chat-icon {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        transition: transform 0.3s ease;
      }
      #chat-toggle .chat-icon1 {
        width: 32px;
        height: 32px;
        position: absolute;
      }

      /* متن: همیشه فضا دارد ولی مخفی است */
      #chat-toggle .chat-text {
        color: #ffff;
        font-size: small;
        opacity: 0;
        margin-left: 8px;
        white-space: nowrap;
        transform: translateX(-10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        flex-shrink: 0;
      }

      /* هاور: نمایش متن و کوچک شدن آیکون */
      #chat-toggle:hover {
        width: 200px;
        background: #02b1f6;
        box-shadow: 0 6px 18px rgba(2, 177, 246, 0.4);
      }

      #chat-toggle:hover .chat-text {
        opacity: 1;
        transform: translateX(0);
      }

      #chat-toggle:hover .chat-icon {
        transform: scale(0.8);
      }
      #chat-toggle:hover .chat-icon1 {
        display: none;
      }

      /* Chat Box */
      #chat-box {
        display: none;
        flex-direction: column;
        width: 320px;
        height: 448px;
        position: fixed;
        bottom: 88px;
        right: 16px;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(1, 38, 64, 0.15);
      }

      #chat-box.active {
        display: flex;
      }

      /* Chat Header */
      #chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #ffff;
        color: #00f8fb;
        font-weight: 600;
        border-bottom: 1px solid rgba(0, 248, 251, 0.2);
      }
      #chat-header-logo {
        color: #505050ff;
      }
      #chat-header-close {
        padding: 0;
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: #00f8fb;
      }

      #chat-messages {
        flex: 1;
        outline: none;
        resize: none;
        overflow-y: auto;
        padding: 12px;
        direction: rtl;
        background: white;
      }

      /* scrollbar نازک */
      #chat-messages::-webkit-scrollbar {
        width: 4px;
      }
      #chat-messages::-webkit-scrollbar-thumb {
        background-color: #aaa;
        border-radius: 2px;
      }

      /* Chat Messages */
      .chat-message {
        max-width: 80%;
        margin: 5px;
        padding: 10px;
        border-radius: 12px;
        font-size: 0.9rem;
        position: relative;
        clear: both;
        word-wrap: break-word;
      }

      .chat-user {
        background-color: #eefcff;
        color: #012640;
        float: left;
        border-bottom-left-radius: 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      }

      .chat-admin {
        background-color: #d4f7ff;
        color: #012640;
        float: right;
        border-bottom-right-radius: 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      }

      .chat-meta {
        display: block;
        font-size: 0.75rem;
        color: #666;
        margin-top: 5px;
      }

      /* Chat Input */
      #chat-input {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #f5fcff;
        border-top: 1px solid #02b1f6;
        border-radius: 12px;
      }

      #chat-text-box {
        flex: 1;
        border: 1px solid #02b1f6;
        background: #ffffff;
        border-radius: 20px;
        padding: 4px 12px;
        display: flex;
        align-items: center;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      #chat-text-box.focused {
        border-color: #00f8fb;
        box-shadow: 0 0 6px rgba(0, 248, 251, 0.3);
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
        background: transparent;
        font-family: inherit;
      }

      /* scrollbar نازک */
      #chat-text::-webkit-scrollbar {
        width: 4px;
      }
      #chat-text::-webkit-scrollbar-thumb {
        background-color: #aaa;
        border-radius: 2px;
      }

      #chat-send, #chat-clear-history {
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
        flex-shrink: 0;
      }

     #chat-send {
      background: #00f8fb;
}

#chat-send:hover {
  background: #02b1f6;
  transform: scale(1.05);
}

#chat-clear-history {
  background: #e0f7ff;
}

#chat-clear-history:hover {
  background: #c0f0ff;
}

      #chat-clear-history svg {
        width: 18px;
        height: 18px;
        fill: #555;
      }

      /* لودینگ سه نقطه */
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
         background: #02b1f6;
        border-radius: 50%;
        animation: bounce 1.2s infinite ease-in-out;
      }

      .chat-loading span:nth-child(1) {
        animation-delay: -0.24s;
      }
      .chat-loading span:nth-child(2) {
        animation-delay: -0.12s;
      }
      .chat-loading span:nth-child(3) {
        animation-delay: 0;
      }

      @keyframes bounce {
        0%,
        80%,
        100% {
          transform: scale(0);
          opacity: 0.4;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .loading-message {
        display: flex;
        justify-content: flex-start;
      }
      
      .chat-placeholder {
        color: rgba(1, 38, 64, 0.5);
        font-style: italic;
        text-align: center;
        margin: 20px 0;
        background: transparent !important;
        border: none !important;
        float: none !important;
        max-width: 100% !important;
      }
    `;

    // ایجاد ساختار ویجت
    const widget = document.createElement("div");
    widget.id = "chat-widget";
    widget.style.position = "fixed";

    // اعمال منطق موقعیت
    if (config.bottom >= 0) {
      widget.style.bottom = config.bottom + "px";
    } else {
      widget.style.top = Math.abs(config.bottom) + "px";
    }

    if (config.right >= 0) {
      widget.style.right = config.right + "px";
    } else {
      widget.style.left = Math.abs(config.right) + "px";
    }
    widget.innerHTML = `
      <button id="chat-toggle" aria-label="باز و بسته کردن چت">
        <svg xmlns="http://www.w3.org/2000/svg" class="chat-icon1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" class="chat-icon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
        </svg>
        <span class="chat-text">دستیار هوش مصنوعی</span>
      </button>

      <div id="chat-box" style="display:none; flex-direction: column;">
        <div id="chat-header">
          <span id="chat-header-logo">دستیار هوش مصنوعی</span>
          <button id="chat-header-close" aria-label="بستن چت">✕</button>
        </div>
        <div id="chat-messages" style="flex-grow:1; overflow-y:auto; max-height:344px; padding:10px;"></div>
        <div id="chat-input">
          <button id="chat-send" aria-label="ارسال پیام">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
            </svg>
          </button>
          <div id="chat-text-box">
            <textarea id="chat-text" placeholder="پیام خود را بنویسید..." rows="1"></textarea>
          </div>
          <button id="chat-clear-history" aria-label="پاک کردن تاریخچه">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(widget);

    // مقداردهی المنت‌ها از shadow DOM
    const toggle = shadow.getElementById("chat-toggle");
    const box = shadow.getElementById("chat-box");
    const messages = shadow.getElementById("chat-messages");
    const input = shadow.getElementById("chat-text");
    const send = shadow.getElementById("chat-send");
    const closeBtn = shadow.getElementById("chat-header-close");
    const clearBtn = shadow.getElementById("chat-clear-history");
    const textarea = shadow.getElementById("chat-text");
    const textareaBox = shadow.getElementById("chat-text-box");

    // اضافه کردن پیام placeholder
    const placeholderMessage = document.createElement("div");
    placeholderMessage.id = "chat-placeholder";
    placeholderMessage.className = "chat-message chat-placeholder";
     placeholderMessage.innerHTML = config.placeholder;
    messages.appendChild(placeholderMessage);

    // مدیریت session_id از localStorage
    let sessionId = localStorage.getItem("chat_session_id") || "";

    // مدیریت باز و بسته کردن چت
    toggle.onclick = () => {
      const isOpen = box.style.display === "flex";
      box.style.display = isOpen ? "none" : "flex";
    };

    closeBtn.onclick = () => (box.style.display = "none");

    // پاک کردن تاریخچه
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("chat_history");
      localStorage.removeItem("chat_session_id");
      sessionId = "";
      messages.innerHTML = "";
      showPlaceholderIfEmpty();
    });

    // مدیریت focus روی textarea
    textarea.addEventListener("focus", () =>
      textareaBox.classList.add("focused")
    );
    textarea.addEventListener("blur", () =>
      textareaBox.classList.remove("focused")
    );

    // مدیریت ارتفاع textarea
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height =
        Math.min(textarea.scrollHeight, 3 * 24 + 16) + "px";
    });

    // نمایش متن اولیه در صورت نبودن پیام
    function showPlaceholderIfEmpty() {
      if (!messages.hasChildNodes()) {
        const placeholder = document.createElement("div");
        placeholder.id = "chat-placeholder";
        placeholder.className = "chat-message chat-placeholder";
        placeholder.innerHTML = config.placeholder;
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
      const placeholder = shadow.getElementById("chat-placeholder");
      if (placeholder) placeholder.remove();

      const div = document.createElement("div");
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
      const loading = showLoading();
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

  // لود شدن ویجت
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatWidget);
  } else {
    initChatWidget();
  }
})();
