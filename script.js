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

// Encuesta de demostración: no transmite ni almacena datos.
document.getElementById("surveyForm").addEventListener("submit", event => {
  event.preventDefault();
  const selected = document.querySelector('input[name="respect"]:checked');
  const message = document.getElementById("surveyMessage");
  if (!selected) {
    message.textContent = "Selecciona una respuesta para continuar.";
    return;
  }
  message.textContent = "¡Gracias por compartir tu opinión! Tu respuesta se mostró solo en esta demostración y no se guardó.";
  event.target.reset();
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
