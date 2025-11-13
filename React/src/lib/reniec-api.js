const API_BASE_URL = "http://localhost:8000/api"; // Ajusta según tu URL de Django

export async function searchDniReniec(dni) {
  try {
    console.log("🔍 Consultando DNI en backend:", dni);

    const response = await fetch(`${API_BASE_URL}/consultar-dni/?numero=${dni}`, {
      method: "GET",
      // Eliminamos los headers ya que GET no lleva body
    });

    console.log("🌐 Estado HTTP:", response.status);

    if (!response.ok) {
      console.error("❌ Error en la respuesta:", response.status);
      return null;
    }

    const data = await response.json();
    console.log("📦 Respuesta del backend:", data);

    // Asumiendo que tu backend retorna el nombre en data.nombre o data.full_name
    const nombreCompleto = data.nombre || data.full_name || data.name;

    if (nombreCompleto) {
      console.log("✅ Nombre encontrado:", nombreCompleto);
      return nombreCompleto;
    }

    console.warn("⚠️ No se encontró nombre en la respuesta.");
    return null;
  } catch (error) {
    console.error("🚨 Error al consultar DNI:", error);
    return null;
  }
}