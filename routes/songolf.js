import songolfController from "../controllers/songolf.js";

function routeMessage(message, socket, hub, index) {
    songolfController[message.message](message, socket, hub, index);
};

export default routeMessage;
