// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = "https://rhsfeefsutzwprhpemve.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hLrOBXju6U4IZTrsFdjOrA_rUn4IieF";
// ==========================================
// ENCUESTA: GUARDAR RESPUESTAS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const surveyForm = document.querySelector("#surveyForm");
  const surveyMessage = document.querySelector("#surveyMessage");
  if (!surveyForm) {
    console.error("No se encontró el formulario con id='surveyForm'.");
    return;
  }
  surveyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const selected = surveyForm.querySelector(
      'input[name="respuesta"]:checked'
    );
    if (!selected) {
      if (surveyMessage) {
        surveyMessage.textContent =
          "Por favor, selecciona una respuesta.";
      }
      return;
    }
    const submitButton = surveyForm.querySelector(
      'button[type="submit"], input[type="submit"]'
    );
    if (submitButton) {
      submitButton.disabled = true;
    }
    if (surveyMessage) {
      surveyMessage.textContent = "Guardando tu respuesta...";
    }
    try {
      const response = await fetch(
        ${SUPABASE_URL}/rest/v1/encuestas,
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
        console.error(
          "Error de Supabase:",
          response.status,
          errorDetails
        );
        if (surveyMessage) {
          surveyMessage.textContent =
            "No se pudo guardar la respuesta. Revisa la configuración de Supabase.";
        }
        return;
      }
      if (surveyMessage) {
        surveyMessage.textContent =
          "¡Gracias! Tu respuesta se guardó correctamente.";
      }
      surveyForm.reset();
    } catch (error) {
      console.error("Error de conexión:", error);
      if (surveyMessage) {
        surveyMessage.textContent =
          "Error de conexión. Inténtalo de nuevo.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
});
