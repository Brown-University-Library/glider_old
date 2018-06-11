class MessageBroker {

  constructor(props) {
    this.messages = [];
    this.remoteBroker = new RemoteMessenger("firebase", {
	    apiKey: "AIzaSyDiG79nyWATW1tcjLsD2YY2Zr5z8qW7ZyU",
	    authDomain: "glider-flightplan-example.firebaseapp.com",
	    databaseURL: "https://glider-flightplan-example.firebaseio.com",
	    projectId: "glider-flightplan-example",
	    storageBucket: "glider-flightplan-example.appspot.com",
	    messagingSenderId: "201089278480"
    })
  }

  send() {
  	for (var i = 0; i <= this.messages.length; i++)
  		message = this.messages[i];
	  	switch (message.content) {
	  		case "phase-changed":

	  		break;
	  	}


		if(message.sendRemote)
			this.sendRemote(i);
  }

  subscribe(object, channel) {

  		//set up an object to listen for a message to be broadcast;

  }

  sendRemote(message){
  	this.remoteBroker.update(message);
  }

}

class RemoteMessenger {
	constructor(provider, props) {
		switch(provider) {
			case "firebase":

				  firebase.initializeApp(config);

			break;
		}
	}

	sendMessage() {
		// this will send the message to the "message" remote bucket.
	}

	updateValue(key, value) {
		// this will update any remote values that need to be updated. 
		// possibly the most frequently used method
	}
}
