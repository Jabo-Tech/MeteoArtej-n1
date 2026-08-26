document.addEventListener("DOMContentLoaded", async () => {

    const registros = await cargarExcel();

    cargarPortada(registros);

    const portada = document.getElementById("portada");
    const aplicacion = document.getElementById("aplicacion");

    const pantallaInicio = document.getElementById("pantallaInicio");
    const pantallaDirecto = document.getElementById("pantallaDirecto");
    const pantallaConsultas = document.getElementById("pantallaConsultas");
    const pantallaGraficas = document.getElementById("pantallaGraficas");

    function mostrarPantalla(pantalla) {

        portada.style.display = "none";
        aplicacion.style.display = "block";

        pantallaInicio.hidden = pantalla !== pantallaInicio;
        pantallaDirecto.hidden = pantalla !== pantallaDirecto;
        pantallaConsultas.hidden = pantalla !== pantallaConsultas;
        pantallaGraficas.hidden = pantalla !== pantallaGraficas;

        window.scrollTo(0, 0);

    }

    document.getElementById("btnInicio").onclick = () => {

    mostrarPantalla(pantallaInicio);

    cargarInicio(registros);

};

    document.getElementById("btnDatosDirecto").onclick = () => {

    mostrarPantalla(pantallaDirecto);

    cargarDirecto();

};

    document.getElementById("btnConsultas").onclick = () => {

    mostrarPantalla(pantallaConsultas);

    cargarConsultas(registros);

};

    document.getElementById("btnGraficas").onclick = () => {

    mostrarPantalla(pantallaGraficas);

    cargarGraficas(registros);

};

    document.querySelectorAll(".logoDashboard").forEach(boton => {

    boton.onclick = () => {

        aplicacion.style.display = "none";
        portada.style.display = "flex";

        // Al volver, dejamos las tarjetas en su cara delantera
        document.querySelectorAll(".girada").forEach(tarjeta => {
            tarjeta.classList.remove("girada");
        });

        window.scrollTo(0, 0);

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

