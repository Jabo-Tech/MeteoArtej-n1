document.addEventListener("DOMContentLoaded", async () => {

    const registros = await cargarExcel();

    cargarPortada(registros);

    const portada = document.getElementById("portada");
    const aplicacion = document.getElementById("aplicacion");

    const pantallaInicio = document.getElementById("pantallaInicio");
    const pantallaDirecto = document.getElementById("pantallaDirecto");

    document.getElementById("btnInicio").onclick = () => {

    portada.style.display = "none";
    aplicacion.style.display = "block";

    pantallaDirecto.hidden = true;
    pantallaInicio.hidden = false;

    cargarInicio(registros);

};

    document.getElementById("btnDatosDirecto").onclick = () => {

    portada.style.display = "none";
    aplicacion.style.display = "block";

    pantallaInicio.hidden = true;
    pantallaDirecto.hidden = false;

    cargarDirecto();

};

    document.querySelectorAll(".logoDashboard").forEach(boton => {

    boton.onclick = () => {

        aplicacion.style.display = "none";
        portada.style.display = "flex";

        // Al volver, dejamos las tarjetas en su cara delantera
        document.querySelectorAll(".girada").forEach(tarjeta => {
            tarjeta.classList.remove("girada");
        });

    };

});

    const modalVariables = document.getElementById("modalVariables");

    document.getElementById("btnExplicacionVariables").onclick = () => {
        modalVariables.hidden = false;
    };

    document.getElementById("btnCerrarModal").onclick = () => {
        modalVariables.hidden = true;
    };

    modalVariables.addEventListener("click", (evento) => {

        if (evento.target === modalVariables) {
            modalVariables.hidden = true;
        }

    });

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            modalVariables.hidden = true;
        }

    });

});

