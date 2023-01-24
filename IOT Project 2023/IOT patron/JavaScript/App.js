
function createClient(name) {
    var client = new Paho.MQTT.Client("localhost", 9001, "/ws", name + "_" + parseInt(Math.random() * 100, 10));

    client.onConnectionLost = onConnectionLost;

    client.connect({onSuccess: function(){
        console.log("Connected");
        client.subscribe("/Garages/" + name);
        console.log(name + " Subsecribed To " + "/Garages/" + name);
      }});
    return client;
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
function getLocation(clientNum){
    switch (clientNum) {
        case 1:
            return "36.038908, 4.816912 El Anceur";
            break;
        case 2:
            return "36.056920, 4.847552 Sidi Zitouni, El Anceur";
            break;
        case 3:
            return "35.716731, 4.522503 M'sila, M'Sila";
            break;
        case 4:
            return "36.720185, 3.137594 P4CP+6X4, El Harrach";
            break;
        default:
            return null;
            break;
    }
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
function sendMessageToPolice(clientNum) { 
    let client = getClient(clientNum);
    if (!client.isConnected()) {
        return;
    }
    var clientName = getGarageName(clientNum);
    const msg = getGarageName(clientNum) + "*" + getLocation(clientNum);
    var topic = "/Police/Stealings";
    console.log("message from " + clientName + ": " + msg);
    message = createMessage(msg, topic);
    getClient(clientNum).send(message);
    console.log("sent message succesfully");
}

function onArrived(clientNum) {
    return function (message) {
        var  current_time = new Date();
        let houre = current_time.getHours();
        let minuts = current_time.getMinutes();
        let seconds = current_time.getSeconds();
        if(message.payloadString == "Open"){ 
            var lockImage = document.querySelectorAll('.lock_image');
            lockImage[clientNum - 1].src = "./images/unlock.svg";
            let validation = confirm("In " + houre + ":" + minuts + ":" + seconds + "\nWarning " + getGarageName(clientNum) + " Is Opening, Are You The Opener (ok = yes, cancle = no)?");
            if(validation){
                window.alert(getGarageName(clientNum) + " Open with Patrone Permision");
            }else{
                //warning it's steal CALL POLICE MANS
                console.log("Let's call the polices here");
                sendMessageToPolice(clientNum);

            }
        }else{
            window.alert(getGarageName(clientNum) + " Getting close right now!");
            var lockImage = document.querySelectorAll('.lock_image');
            lockImage[clientNum - 1].src = "./images/Lock.svg";
        }
    }
}

function connect(clientNum) {
    var client = getClient(clientNum);
    if (client.isConnected()) {
        return;
    }

    client.connect();
}


function subscribe(clientNum) {
    var topic = "/Garages/" + clientNum;
    getClient(clientNum).subscribe(topic);
    console.log("subscribed");
}


function createMessage(msg, topic) {
    message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    return message;
}


function onConnect() {
    console.log("connected");
}

//called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// Declaration of garages instances 
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

garage_1 = createClient("Garage 1");
garage_2 = createClient("Garage 2");
garage_3 = createClient("Garage 3");
garage_4 = createClient("Garage 4");

// bind onMessageArrived callbaks for all clients
garage_1.onMessageArrived = onArrived(GARAGE_1);
garage_2.onMessageArrived = onArrived(GARAGE_2);
garage_3.onMessageArrived = onArrived(GARAGE_3);
garage_4.onMessageArrived = onArrived(GARAGE_4);