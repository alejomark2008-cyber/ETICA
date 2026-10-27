const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Actividad de reflexión: muestra una respuesta distinta según la opción elegida.
const choices = document.querySelectorAll(".choice");
const scenarioFeedback = document.getElementById("scenarioFeedback");
choices.forEach(choice => {
  choice.addEventListener("click", () => {
    choices.forEach(item => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });
    choice.classList.add("selected");
    choice.setAttribute("aria-pressed", "true");
    scenarioFeedback.textContent = choice.dataset.feedback;
  });
});

// CONEXIÓN CON SUPABASE
// Reemplaza estos dos valores por los de TU proyecto. Usa solo la Publishable key,
// nunca una clave Secret o service_role en el navegador.
const SUPABASE_URL = "https://rhsfeefsutzwprhpemve.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hLrOBXju6U4IZTrsFdjOrA_rUn4IieF";

// Guarda la respuesta anónima de la encuesta en la tabla public.encuestas.
const surveyForm = document.getElementById("surveyForm");
surveyForm.addEventListener("submit", async event => {
  event.preventDefault();
  const selected = document.querySelector('input[name="respect"]:checked');
  const message = document.getElementById("surveyMessage");
  const submitButton = surveyForm.querySelector('button[type="submit"]');

  if (!selected) {
    message.textContent = "Selecciona una respuesta para continuar.";
    return;
  }

  if (SUPABASE_URL.startsWith("PEGA_AQUI") || SUPABASE_PUBLISHABLE_KEY.startsWith("PEGA_AQUI")) {
    message.textContent = "Falta configurar la URL y la Publishable key de Supabase en script.js.";
    return;
  }

  submitButton.disabled = true;
  message.textContent = "Enviando tu respuesta…";

  try {
    const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/encuestas`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ respuesta: selected.value })
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Supabase respondió con un error:", response.status, details);
      throw new Error("No se pudo guardar la respuesta. Revisa la tabla, las políticas y las credenciales.");
    }

    message.textContent = "¡Gracias! Tu respuesta se guardó correctamente.";
    surveyForm.reset();
  } catch (error) {
    console.error(error);
    message.textContent = "No pudimos guardar tu respuesta. Comprueba la conexión y la configuración de Supabase e inténtalo de nuevo.";
  } finally {
    submitButton.disabled = false;
  }
});

// Contador y confirmación local para propuestas.
const proposalText = document.getElementById("proposalText");
proposalText.addEventListener("input", () => {
  document.getElementById("charCount").textContent = `${proposalText.value.length}/400`;
});
document.getElementById("proposalForm").addEventListener("submit", event => {
  event.preventDefault();
  const message = document.getElementById("proposalMessage");
  if (!proposalText.value.trim()) {
    message.textContent = "Escribe una propuesta antes de enviarla.";
    return;
  }
  message.textContent = "¡Gracias por tu idea! En esta versión de muestra no se almacena ni se envía a ninguna parte.";
  proposalText.value = "";
  document.getElementById("charCount").textContent = "0/400";
});

// Compromiso interactivo.
document.getElementById("pledgeButton").addEventListener("click", event => {
  const button = event.currentTarget;
  const message = document.getElementById("pledgeMessage");
  const pledged = button.dataset.pledged === "true";
  button.dataset.pledged = String(!pledged);
  button.innerHTML = pledged ? 'Me comprometo <span>♡</span>' : '¡Me comprometo! <span>✓</span>';
  message.textContent = pledged ? "" : "¡Gracias! Recuerda que cada acción respetuosa cuenta.";
});
