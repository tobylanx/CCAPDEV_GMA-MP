document.addEventListener("DOMContentLoaded", function () {
    const addSeatButton = document.getElementById("addSeatButton");
    const seatContainer = document.getElementById("seatContainer");

    addSeatButton.addEventListener("click", function () {
        const newSeatEntry = document.createElement("div");
        newSeatEntry.classList.add("seat-entry");

        const newSeatLabel = document.createElement("label");
        newSeatLabel.setAttribute("for", "seat-select");
        newSeatLabel.textContent = "Choose Seat ID (1-20):";

        const newSeatInput = document.createElement("input");
        newSeatInput.setAttribute("type", "number");
        newSeatInput.setAttribute("class", "seat-select");
        newSeatInput.setAttribute("min", "1");
        newSeatInput.setAttribute("max", "20");

        newSeatEntry.appendChild(newSeatLabel);
        newSeatEntry.appendChild(newSeatInput);

        seatContainer.appendChild(newSeatEntry);
    });
});
