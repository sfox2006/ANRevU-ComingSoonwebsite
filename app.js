const SUPABASE_URL = "https://syjwhamhkaxbyiprmyfo.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_spCWs_piKtB_EjKfyGl7Pw_q7QJQZ1w";
const WAITLIST_TABLE = "anrevu_waitlist";

const form = document.querySelector("#waitlistForm");
const submitButton = document.querySelector("#submitButton");
const message = document.querySelector("#formMessage");

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `form-message ${type}`.trim();
}

function isConfigured() {
  return Boolean(SUPABASE_URL.trim() && SUPABASE_ANON_KEY.trim());
}

function normaliseEmail(value) {
  return value.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function joinWaitlist(payload) {
  const endpoint = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${WAITLIST_TABLE}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let detail = "";

    try {
      const error = await response.json();
      detail = error.message || error.details || "";
    } catch {
      detail = response.statusText;
    }

    throw new Error(detail || "Supabase rejected the signup.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");

  const formData = new FormData(form);
  const email = normaliseEmail(String(formData.get("email") || ""));
  const name = String(formData.get("name") || "").trim();
  const isAnuStudent = formData.get("isAnuStudent") === "on";

  if (!email) {
    setMessage("Please enter your email address.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    setMessage("Please enter a valid email address.", "error");
    return;
  }

  if (!isConfigured()) {
    setMessage(
      "Supabase is not configured yet. Paste your Supabase URL and publishable anon key into app.js, then try again.",
      "error"
    );
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Joining...";

  try {
    await joinWaitlist({
      name,
      email,
      is_anu_student: isAnuStudent,
      source: "coming-soon"
    });

    form.reset();
    setMessage("You're on the list. We will email you when ANRevU launches.", "success");
  } catch (error) {
    const alreadyExists = /duplicate|unique|already/i.test(error.message);
    setMessage(
      alreadyExists
        ? "That email is already on the waitlist. You're all set."
        : `Signup failed: ${error.message}`,
      alreadyExists ? "success" : "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Join the waitlist";
  }
});
