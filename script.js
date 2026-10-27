"use strict";

// ============================================
// ENTRE NOSOTROS — CONFIGURACIÓN DE SUPABASE
// ============================================

const SUPABASE_URL = "https://rhsfeefsutzwprhpemve.supabase.co";

// IMPORTANTE: pega aquí tu Publishable key de Supabase.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hLrOBXju6U4IZTrsFdjOrA_rUn4IieF";

// ============================================
// MENÚ DE NAVEGACIÓN
// ============================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
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
}

// ============================================
// ACTIVIDAD: PONTE EN MI LUGAR
// ============================================

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

    if (scenarioFeedback) {
      scenarioFeedback.textContent = choice.dataset.feedback || "";
    }
  });
});

// ============================================
// ENCUESTA CONECTADA A SUPABASE
// ============================================

const surveyForm = document.getElementById("surveyForm");
const surveyMessage = document.getElementById("surveyMessage");

if (surveyForm && surveyMessage) {
  surveyForm.addEventListener("submit", async event => {
    event.preventDefault();

    const selected = surveyForm.querySelector(
      'input[name="respect"]:checked'
    );

    const submitButton = surveyForm.querySelector(
      'button[type="submit"]'
    );

    if (!selected) {
      surveyMessage.textContent =
        "Selecciona una respuesta para continuar.";
      return;
    }

    if (
      !SUPABASE_URL ||
      SUPABASE_URL.includes("PEGA_AQUI") ||
      !SUPABASE_PUBLISHABLE_KEY ||
      SUPABASE_PUBLISHABLE_KEY.includes("PEGA_AQUI")
    ) {
      surveyMessage.textContent =
        "Falta configurar la conexión con Supabase.";
      console.error(
        "Configura SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en script.js."
      );
      return;
    }

    submitButton.disabled = true;
    surveyMessage.textContent = "Guardando tu respuesta…";

    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/encuestas`,
        {
          method: "POST",

          headers: {
            "apikey": SUPABASE_PUBLISHABLE_KEY,
            "Authorization": Bearer ${SUPABASE_PUBLISHABLE_KEY},
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },

          body: JSON.stringify({
            respuesta: selected.value
          })
        }
      );

      if (!response.ok) {
        const errorDetails = await response.text();

        console.error("Error de Supabase:", {
          status: response.status,
          details: errorDetails
        });

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Supabase rechazó la petición. Revisa la clave y los permisos."
          );
        }

        if (response.status === 404) {
          throw new Error(
            "No se encontró la tabla o la ruta de la API. Revisa public.encuestas."
          );
        }

        throw new Error(
          No se pudo guardar la respuesta (HTTP ${response.status}).
        );
      }

      surveyMessage.textContent =
        "¡Gracias! Tu respuesta se guardó correctamente.";

      surveyForm.reset();

    } catch (error) {
      console.error("No se pudo guardar la encuesta:", error);

      surveyMessage.textContent =
        error.message ||
        "No pudimos guardar tu respuesta. Inténtalo de nuevo.";

    } finally {
      submitButton.disabled = false;
    }
  });
}

// ============================================
// FORMULARIO DE PROPUESTAS
// Sigue siendo una demostración local.
// ============================================

const proposalText = document.getElementById("proposalText");
const charCount = document.getElementById("charCount");
const proposalForm = document.getElementById("proposalForm");
const proposalMessage = document.getElementById("proposalMessage");

if (proposalText && charCount) {
  proposalText.addEventListener("input", () => {
    charCount.textContent = ${proposalText.value.length}/400;
  });
}

if (proposalForm && proposalText && proposalMessage) {
  proposalForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!proposalText.value.trim()) {
      proposalMessage.textContent =
        "Escribe una propuesta antes de enviarla.";
      return;
    }

    proposalMessage.textContent =
      "¡Gracias por tu idea! Esta versión todavía no guarda las propuestas.";

    proposalText.value = "";

    if (charCount) {
      charCount.textContent = "0/400";
    }
  });
}

// ============================================
// COMPROMISO CON LA CONVIVENCIA
// ============================================

const pledgeButton = document.getElementById("pledgeButton");
const pledgeMessage = document.getElementById("pledgeMessage");

if (pledgeButton && pledgeMessage) {
  pledgeButton.addEventListener("click", event => {
    const button = event.currentTarget;
    const pledged = button.dataset.pledged === "true";

    button.dataset.pledged = String(!pledged);

    button.innerHTML = pledged
      ? 'Me comprometo <span>♡</span>'
      : '¡Me comprometo! <span>✓</span>';

    pledgeMessage.textContent = pledged
      ? ""
      : "¡Gracias! Recuerda que cada acción respetuosa cuenta.";
  });
}
