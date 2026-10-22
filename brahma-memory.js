
/* KiDO BRAHMA — Private Login & Chat Memory */
(() => {
  "use strict";

  const BASE = "https://pjnywxkgmeuaiihsglsu.supabase.co";
  const KEY = "sb_publishable_8bjpIlrqJKpl9i00MBtR8Q_VDRVVX0q";

  let session = null;
  let conversationId = null;
  let refreshing = null;

  const style = document.createElement("style");
  style.textContent = `
    #brahma-account {
      margin:8px 0;padding:10px;border:1px solid #ff842955;
      border-radius:14px;background:#150b05;color:#ffd19a;
      font:12px system-ui,sans-serif
    }
    #brahma-account input {
      width:100%;margin:4px 0;padding:10px;
      background:#080503;color:white;border:1px solid #ff842955;
      border-radius:9px
    }
    #brahma-account button {
      padding:8px 10px;margin:4px 4px 4px 0;
      border:1px solid #ff842955;border-radius:9px;
      background:#291407;color:#ffd19a
    }
    #brahma-account .note {
      font-size:11px;white-space:pre-wrap;overflow-wrap:anywhere
    }
    #brahma-account .history {
      max-height:140px;overflow:auto
    }
    #brahma-account .history button {
      display:block;width:100%;text-align:left
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement("section");
  panel.id = "brahma-account";
  panel.innerHTML = `
    <strong>🔐 BRAHMA Private Memory</strong>
    <div class="note" id="bm-status" role="status"></div>
    <div id="bm-login">
      <input id="bm-email" type="email"
        autocomplete="email" placeholder="Email">
      <input id="bm-password" type="password"
        autocomplete="current-password"
        placeholder="Password">
      <button type="button" id="bm-signin">Login</button>
      <button type="button" id="bm-signup">Sign Up</button>
      <div class="note" id="bm-action" role="alert" aria-live="polite" style="padding:8px 0;color:#ffcc8b"></div>
    </div>
    <div id="bm-user" hidden>
      <button id="bm-new">New Chat</button>
      <button id="bm-history">My History</button>
      <button id="bm-logout">Logout</button>
      <div class="history" id="bm-list"></div>
    </div>
  `;

  const chat = document.getElementById("chat");
  if (!chat) return;

  const terminal = chat.querySelector(".terminal");
  if (terminal) terminal.after(panel);
  else chat.prepend(panel);

  const $ = id => document.getElementById(id);
  const note = message => {
    $("bm-status").textContent = message;
  };

  function render() {
    const loggedIn = !!session?.access_token;
    $("bm-login").hidden = loggedIn;
    $("bm-user").hidden = !loggedIn;
    note(loggedIn
      ? "🔒 Signed in: " + (session.user?.email || "User")
      : "Login to save private chats.");
  }

  function persist() {
    if (session) {
      sessionStorage.setItem(
        "kido-brahma-auth",
        JSON.stringify(session)
      );
    } else {
      sessionStorage.removeItem("kido-brahma-auth");
    }
    render();
  }

  async function request(path, options = {}, auth = false) {
    if (auth) await refreshToken();

    const headers = {
      apikey: KEY,
      "Content-Type": "application/json",
      ...options.headers
    };

    if (auth) {
      if (!session?.access_token) {
        throw Error("Please log in again.");
      }
      headers.Authorization = "Bearer " + session.access_token;
    }

    const response = await fetch(BASE + path, {
      ...options,
      headers
    });

    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw Error("Unexpected server response");
    }

    if (!response.ok) {
      throw Error(
        data?.msg ||
        data?.error_description ||
        data?.message ||
        data?.error ||
        "Request failed"
      );
    }

    return data;
  }

  async function refreshToken() {
    if (!session) return;

    const expiresAt = session.expires_at || 0;
    if (Date.now() < expiresAt * 1000 - 60000) return;

    if (refreshing) return refreshing;

    refreshing = (async () => {
      try {
        const data = await request(
          "/auth/v1/token?grant_type=refresh_token",
          {
            method: "POST",
            body: JSON.stringify({
              refresh_token: session.refresh_token
            })
          }
        );

        session = {
          ...data,
          expires_at: Math.floor(Date.now() / 1000)
            + data.expires_in
        };
        persist();
      } catch {
        session = null;
        conversationId = null;
        persist();
      }
    })();

    try {
      await refreshing;
    } finally {
      refreshing = null;
    }
  }

  async function authenticate(signup) {
    $("bm-action").textContent = signup ? "Sign Up दबाया गया — जाँच जारी…" : "Login दबाया गया — जाँच जारी…";
    const email = $("bm-email").value.trim();
    const password = $("bm-password").value;

    if (!email || !password) {
      note("Email और Password भरें।");
      $("bm-action").textContent = "पहले Email और Password भरें।";
      return;
    }

    $("bm-signin").disabled = true;
    $("bm-signup").disabled = true;

    try {
      const path = signup
        ? "/auth/v1/signup"
        : "/auth/v1/token?grant_type=password";

      const data = await request(path, {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (!data.access_token) {
        note("Email confirmation के बाद Login करें।");
        $("bm-action").textContent = "Sign Up अनुरोध पूरा हुआ। Email Inbox जाँचें।";
        return;
      }

      session = {
        ...data,
        expires_at: Math.floor(Date.now() / 1000)
          + data.expires_in
      };

      conversationId = null;
      $("bm-password").value = "";
      persist();
      $("bm-action").textContent = "Login सफल हुआ।";
    } catch (error) {
      $("bm-action").textContent = "⚠️ " + error.message;
      note("⚠️ " + error.message);
    } finally {
      $("bm-signin").disabled = false;
      $("bm-signup").disabled = false;
    }
  }

  $("bm-signin").onclick = () => authenticate(false);
  $("bm-signup").onclick = () => authenticate(true);

  $("bm-logout").onclick = async () => {
    const token = session?.access_token;

    session = null;
    conversationId = null;
    $("bm-list").replaceChildren();
    persist();

    if (token) {
      try {
        await request("/auth/v1/logout", {
          method: "POST",
          headers: { Authorization: "Bearer " + token }
        });
      } catch {
        // Local session has already been cleared.
      }
    }
  };

  async function getRows(table, query) {
    return request(
      "/rest/v1/" + table + "?" + query,
      { method: "GET" },
      true
    );
  }

  function clearMessages() {
    chat.querySelectorAll(".msg.user,.msg.ai")
      .forEach(element => element.remove());
  }

  $("bm-new").onclick = () => {
    conversationId = null;
    clearMessages();
    $("bm-list").replaceChildren();
    note("नई निजी बातचीत शुरू करें।");
  };

  $("bm-history").onclick = async () => {
    const list = $("bm-list");
    list.replaceChildren();

    try {
      const conversations = await getRows(
        "brahma_conversations",
        "select=id,title&order=updated_at.desc&limit=30"
      );

      if (!conversations.length) {
        note("अभी कोई Saved Chat नहीं है।");
        return;
      }

      for (const item of conversations) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = item.title;

        button.onclick = async () => {
          try {
            const messages = await getRows(
              "brahma_messages",
              "select=role,content" +
              "&conversation_id=eq." +
              encodeURIComponent(item.id) +
              "&order=created_at.asc&limit=100"
            );

            clearMessages();
            conversationId = item.id;

            for (const message of messages) {
              const bubble = document.createElement("div");
              bubble.className = "msg " +
                (message.role === "user" ? "user" : "ai");
              bubble.textContent = message.content;
              chat.appendChild(bubble);
            }

            note("🔒 निजी बातचीत लोड हो गई।");
          } catch (error) {
            note("⚠️ " + error.message);
          }
        };

        list.appendChild(button);
      }
    } catch (error) {
      note("⚠️ " + error.message);
    }
  };

  window.BrahmaMemory = {
    async savePair(question, answer) {
      if (!session?.access_token) return;

      try {
        if (!conversationId) {
          const created = await request(
            "/rest/v1/brahma_conversations",
            {
              method: "POST",
              headers: {
                Prefer: "return=representation"
              },
              body: JSON.stringify({
                user_id: session.user.id,
                title: question.slice(0, 100)
              })
            },
            true
          );

          conversationId = created[0].id;
        }

        await request(
          "/rest/v1/brahma_messages",
          {
            method: "POST",
            body: JSON.stringify([
              {
                conversation_id: conversationId,
                user_id: session.user.id,
                role: "user",
                content: question.slice(0, 12000)
              },
              {
                conversation_id: conversationId,
                user_id: session.user.id,
                role: "assistant",
                content: answer.slice(0, 12000)
              }
            ])
          },
          true
        );

        note("🔒 Chat निजी Memory में सेव हुई।");
      } catch (error) {
        note("⚠️ Chat सेव नहीं हुई: " + error.message);
      }
    }
  };

  try {
    const stored = JSON.parse(
      sessionStorage.getItem("kido-brahma-auth") || "null"
    );

    if (stored?.access_token && stored?.refresh_token) {
      session = stored;
    }
  } catch {
    session = null;
  }

  render();
})();
                           
