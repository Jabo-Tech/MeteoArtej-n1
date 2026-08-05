// Consulta la API de Ecowitt (api.ecowitt.net) y guarda el último dato
// en data/directo.json. Pensado para ejecutarse desde GitHub Actions
// (ver .github/workflows/datos-directo.yml), nunca desde el navegador,
// para no exponer las claves.

const fs = require("fs");
const path = require("path");

// La MAC no es secreta (identifica el dispositivo, no da acceso a nada
// por sí sola), así que va aquí directamente. Si cambias de estación,
// actualiza este valor.
const MAC = process.env.ECOWITT_MAC || "EC:64:C9:F1:EA:0D";

const APPLICATION_KEY = process.env.ECOWITT_APPLICATION_KEY;
const API_KEY = process.env.ECOWITT_API_KEY;

const RUTA_SALIDA = path.join(__dirname, "..", "data", "directo.json");

const NOMBRES_DIRECCION = {
    N: "Norte", NE: "Noreste", E: "Este", SE: "Sureste",
    S: "Sur", SO: "Suroeste", O: "Oeste", NO: "Noroeste"
};

function gradosADireccion(grados) {

    if (grados === null || grados === undefined || isNaN(grados)) return null;

    const puntos = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
    const indice = Math.round(grados / 45) % 8;

    return puntos[indice];

}

// Extrae un valor numérico de un nodo tipo { value: "23.4", unit: "℃" }
// devolviendo null si no existe, en vez de lanzar un error.
function num(nodo) {

    if (!nodo || nodo.value === undefined || nodo.value === null) return null;

    const valor = Number(nodo.value);

    return isNaN(valor) ? null : valor;

}

async function main() {

    if (!APPLICATION_KEY || !API_KEY) {
        console.error("Faltan ECOWITT_APPLICATION_KEY o ECOWITT_API_KEY como variables de entorno.");
        process.exit(1);
    }

    const url = `https://api.ecowitt.net/api/v3/device/real_time` +
        `?application_key=${encodeURIComponent(APPLICATION_KEY)}` +
        `&api_key=${encodeURIComponent(API_KEY)}` +
        `&mac=${encodeURIComponent(MAC)}` +
        `&call_back=all`;

    const respuesta = await fetch(url);
    const json = await respuesta.json();

    // Log completo por si hay que depurar el primer arranque
    // (se ve en el log de la Action, no en la web).
    console.log("Respuesta de Ecowitt:", JSON.stringify(json));

    if (json.code !== 0) {
        console.error(`Ecowitt devolvió un error: ${json.code} - ${json.msg}`);
        process.exit(1);
    }

    const datos = json.data || {};

    const outdoor = datos.outdoor || {};
    const wind = datos.wind || {};
    const pressure = datos.pressure || {};
    const rainfall = datos.rainfall || {};
    const solar = datos.solar_and_uvi || {};

    const direccionGrados = num(wind.wind_direction);
    const direccionAbrev = gradosADireccion(direccionGrados);

    const salida = {
        actualizado: new Date().toISOString(),
        temperatura: num(outdoor.temperature),
        sensacion: num(outdoor.feels_like),
        humedad: num(outdoor.humidity),
        viento: num(wind.wind_speed),
        racha: num(wind.wind_gust),
        direccionGrados: direccionGrados,
        direccion: direccionAbrev,
        direccionNombre: direccionAbrev ? NOMBRES_DIRECCION[direccionAbrev] : null,
        presion: num(pressure.relative),
        lluviaHoy: num(rainfall.daily),
        intensidadLluvia: num(rainfall.rain_rate),
        radiacion: num(solar.solar),
        uvi: num(solar.uvi)
    };

    fs.mkdirSync(path.dirname(RUTA_SALIDA), { recursive: true });
    fs.writeFileSync(RUTA_SALIDA, JSON.stringify(salida, null, 2) + "\n");

    console.log("data/directo.json actualizado:", salida);

}

main().catch((error) => {
    console.error("Error al actualizar los datos en directo:", error);
    process.exit(1);
});
