if (localStorage.getItem("UUID") == null) {
    localStorage.setItem("UUID", crypto.randomUUID());
    console.log("New user created: " + localStorage.getItem("UUID"));
} else {
    console.log(`User ${localStorage.getItem("UUID")} connected.`);
}

document.querySelector('html').addEventListener("htmx:wsOpen", (event) => {
    event.detail.socketWrapper.send(JSON.stringify({"userId": localStorage.getItem("UUID"), "message": "connect"}));
});

document.querySelector('html').addEventListener("htmx:wsConfigSend", (event) => {
    event.detail.parameters.userId = localStorage.getItem("UUID")
    event.detail.parameters.message = event.target.id
});
