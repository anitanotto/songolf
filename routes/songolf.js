import songolfController from "../controllers/songolf.js";

function routeMessage(message, socket, hub) {
    songolfController[message.message](message, socket, hub);
};

export default routeMessage;
