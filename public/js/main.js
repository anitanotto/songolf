if (localStorage.getItem("UUID") == null) {
    localStorage.setItem("UUID", crypto.randomUUID());
    console.log("New user created: " + localStorage.getItem("UUID"));
} else {
    console.log(`User ${localStorage.getItem("UUID")} connected.`)
}
