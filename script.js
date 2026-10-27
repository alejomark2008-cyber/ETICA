const SUPABASE_URL = "https://rhsfeefsutzwprhpemve.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hLrOBXju6U4IZTrsFdjOrA_rUn4IieF";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#surveyForm");
  const message = document.querySelector("#surveyMessage");

  if (!form) {
    console.error("No se encontro el formulario #surveyForm.");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const selected = form.querySelector(
      'input[name="respuesta"]:checked'
    );

    if (!selected) {
      if (message) {
        message.textContent = "Selecciona una respuesta.";
      }
      return;
    }

    const button = form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (button) button.disabled = true;
    if (message) message.textContent = "Guardando respuesta...";

    try {
      const endpoint = SUPABASE_URL + "/rest/v1/encuestas";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_PUBLISHABLE_KEY,
          "Authorization": "Bearer " + SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          respuesta: selected.value
        })
      });

      if (!response.ok) {
        const details = await response.text();
        console.error("Supabase:", response.status, details);

        if (message) {
          message.textContent = "Error al guardar. Revisa Console.";
        }
        return;
      }

      if (message) {
        message.textContent = "Respuesta guardada correctamente.";
      }

      form.reset();

    } catch (error) {
      console.error("Error de conexion:", error);

      if (message) {
        message.textContent = "Error de conexion con Supabase.";
      }
    } finally {
      if (button) button.disabled = false;
    }
  });
});
