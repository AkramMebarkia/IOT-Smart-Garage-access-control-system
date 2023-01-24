function createClient(name) {
    var client = new Paho.MQTT.Client("localhost", 9001, "/ws", name + "_" + parseInt(Math.random() * 100, 10));
    client.onConnectionLost = onConnectionLost;
    client.connect({onSuccess: function(){
        console.log("Connected");
        client.subscribe("/Police/Stealings");
        console.log(name + " Subsecribed To " + "/Police/Stealings");
      }});
    return client;
}


function connect(clientNum) {
    var client = getClient(clientNum);
    if (client.isConnected()) {
        return;
    }
    client.connect();
}


function onConnect() {
    console.log("connected");
}
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}


function creatReclamationItem(message){
    var  current_time = new Date();
        let houre = current_time.getHours();
        let minuts = current_time.getMinutes();
        let seconds = current_time.getSeconds();
    var div = document.createElement('div');
    div.classList.add("reclamation-item"); 
    message = message.payloadString;
    var garageName = String(message).substring(0, String(message).indexOf("*"));
    var garageAddress = String(message).substring(String(message).indexOf("*") + 1, String(message).length);
    var content = '<div class="left"><div class="top"><span>🚨   </span><span style="font-weight: 600;">' + garageName + '</span></div><div class="bottom"><span>' + houre + ":" + minuts + ":" + seconds + '</span><span>' + garageAddress + '</span></div></div><!-- <div class="right"><button>Accepter ✅</button> <button>Refusé ❌</button></div> -->';   
    div.innerHTML = content;
    return div;
}


function onArrived(clientNum) {
    return function (message) {
        var  current_time = new Date();

        let houre = current_time.getHours();
        let minuts = current_time.getMinutes();
        let seconds = current_time.getSeconds();
        reclamationArea = document.getElementById("reclamation-area");
        console.log(message.payloadString);
        reclamationItem = creatReclamationItem(message);
        reclamationArea.appendChild(reclamationItem);
        
    }
}


function getClient(clientNum) {
    switch (clientNum) {
        case 1:
            return postePolice;
            break;
        default:
            return null;
            break;
    }
}


postePolice = createClient("Post Police");
postePolice.onMessageArrived = onArrived(1);