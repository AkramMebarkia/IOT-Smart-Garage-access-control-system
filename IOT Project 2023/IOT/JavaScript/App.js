function createClient(name) {
    var client = new Paho.MQTT.Client("localhost", 9001, "/ws", name + "_" + parseInt(Math.random() * 100, 10));
    client.onConnectionLost = onConnectionLost;
    client.connect({
        onSuccess: onConnect
    });
    return client;
}


function connect(clientNum) {
    var client = getClient(clientNum);
    if (client.isConnected()) {
        return;
    }
    client.connect();
    setConnectionStatus(clientNum, true);
}

function getGarageName(clientNum){
    switch (clientNum) {
        case 1:
            return "Garage 1";
            break;
        case 2:
            return "Garage 2";
            break;
        case 3:
            return "Garage 3";
            break;
        case 4:
            return "Garage 4";
            break;
        default:
            return null;
            break;
    }
}

function sendOpenMessage(clientNum) {
    var openButton = document.querySelectorAll(".open_button");  
    var closeButton = document.querySelectorAll(".close_button");
    openButton[clientNum - 1].disabled = true;
    closeButton[clientNum - 1].disabled = false;
    
    let client = getClient(clientNum);
    if (!client.isConnected()) {
        return;
    }
    var clientName = getGarageName(clientNum);
    var topic = "/Garages/" + clientName;
    var msg = "Open";
    console.log("message from " + clientName + ": " + msg);
    message = createMessage(msg, topic);
    getClient(clientNum).send(message);
    console.log("sent message succesfully");
}
function sendCloseMessage(clientNum) {
    var openButton = document.querySelectorAll(".open_button");  
    var closeButton = document.querySelectorAll(".close_button");
    openButton[clientNum - 1].disabled = false;
    closeButton[clientNum - 1].disabled = true;
    let client = getClient(clientNum);
    if (!client.isConnected()) {
        return;
    }
    var clientName = getGarageName(clientNum);
    var topic = "/Garages/" + clientName;
    var msg = "Close";
    console.log("message from " + clientName + ": " + msg);
    message = createMessage(msg, topic);
    getClient(clientNum).send(message);
    console.log("sent message succesfully");
}


function createMessage(msg, topic) {
    message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    return message;
}

//called when the client connects
function onConnect() {
    console.log("connected");
}

//called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// Declaration of garage instances 
const GARAGE_1 = 1;
const GARAGE_2 = 2;
const GARAGE_3 = 3;
const GARAGE_4 = 4;

// helper just to get desired client based on it number
function getClient(clientNum) {
    switch (clientNum) {
        case GARAGE_1:
            return garage_1;
            break;
        case GARAGE_2:
            return garage_2;
            break;
        case GARAGE_3:
            return garage_3;
            break;
        case GARAGE_4:
            return garage_4;
            break;
        default:
            return null;
            break;
    }
}

garage_1 = createClient("Garage_1");
garage_2 = createClient("Garage_2");
garage_3 = createClient("Garage_3");
garage_4 = createClient("Garage_4");
