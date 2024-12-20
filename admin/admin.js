document.getElementById("statistics-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get values from the form
    const floor1Online = document.getElementById("floor1-online").value;
    const floor1Offline = document.getElementById("floor1-offline").value;
    const floor2Online = document.getElementById("floor2-online").value;
    const floor2Offline = document.getElementById("floor2-offline").value;
    const floor3Online = document.getElementById("floor3-online").value;
    const floor3Offline = document.getElementById("floor3-offline").value;
    const floor4Online = document.getElementById("floor4-online").value;
    const floor4Offline = document.getElementById("floor4-offline").value;

    // Update the table with new values
    document.getElementById("floor1-online-stat").textContent = floor1Online;
    document.getElementById("floor1-offline-stat").textContent = floor1Offline;
    document.getElementById("floor1-total").textContent = parseInt(floor1Online) + parseInt(floor1Offline);

    document.getElementById("floor2-online-stat").textContent = floor2Online;
    document.getElementById("floor2-offline-stat").textContent = floor2Offline;
    document.getElementById("floor2-total").textContent = parseInt(floor2Online) + parseInt(floor2Offline);

    document.getElementById("floor3-online-stat").textContent = floor3Online;
    document.getElementById("floor3-offline-stat").textContent = floor3Offline;
    document.getElementById("floor3-total").textContent = parseInt(floor3Online) + parseInt(floor3Offline);

    document.getElementById("floor4-online-stat").textContent = floor4Online;
    document.getElementById("floor4-offline-stat").textContent = floor4Offline;
    document.getElementById("floor4-total").textContent = parseInt(floor4Online) + parseInt(floor4Offline);
});
