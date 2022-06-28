/**
 * In this example we are tracking how many people are watching the movie with us. 
 * The more people there are, the slower the movie plays. 
 * 
 */

let dataServer;
let pubKey = "pub-c-983eb54b-2d92-49d3-81a4-68619c3b2960";
let subKey = "sub-c-5f7d54fb-893d-4feb-9be1-7ad0b355b34e";
let secretKey = "sec-c-YjdiNjY1YzUtMjhkMy00ODcyLTkxZWItMmIzY2YyYmJhODFl";

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "slowMovieDown";

// used to collect the viewers of the movie
let viewers = [];

let who;  // help us track who is here
let presence; // help up track who is watching

let vid; // variable for video
let playing = false; // make sure the video is not playing right away

let firstClick = false; // the first click sends the message to PubNub

let vidSpeed; // variable to change the video speed

function preload() { // preload our yoyo video
  vid = createVideo("yoyo.mov"); 
  vid.pause();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // initialize pubnub
  dataServer = new PubNub({
    subscribeKey: subKey,
    publishKey: pubKey,
    uuid: "Xinyu",
    secretKey: "secretKey",
    heartbeatInterval: 0,
  });

  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({message: readIncoming});
  dataServer.subscribe({channels: [channelName]});

  // style content
  background(100, 150, 200);

  textAlign(CENTER);
  textSize(50);

  //text("Click to plant your seed", windowWidth/2, windowHeight/4 * 3);

  vid.position(windowWidth/4,windowHeight/4);


}

function draw() {

// we are not drawing anything!
  if (viewers.length < 2) {
    text("Wait for someone to plant the seed together", windowWidth/2, windowHeight/5 * 4);

    allowMessage = false;
  } else {
    drawVideo();
    sendTheMessage();
    allowMessage = true;
  }

}

//function mousePressed() {

  //if (firstClick == false) { 
    //drawVideo();
    //firstClick = true;
    //sendTheMessage();
    // first click draws the video
 //}

//}

function sendTheMessage() {
  dataServer.publish({
    channel: channelName,
    message: "hello!" // message does not mean anything here, we just need a message. 
  });
}



function readIncoming(inMessage) {

  if (inMessage.channel == channelName) {
   who = inMessage.publisher;

      let newinput = true;

      for(let i = 0; i<viewers.length;i++) {
        if(who==viewers[i]) {
          newinput = false;   
        }
      }
      if(newinput) {
        viewers.push(who); // if there is a new viewer, change the video speed
        changeVideoSpeed();
      }
  }
}

function changeVideoSpeed() {

  if (viewers.length == 1){ // if there is only one viewer than the video is a normal speed 

    //vid.pause();
    vid.speed(1);

  } else {

    vidSpeed = 1 + (viewers.length * 0.1) 
    vid.speed(vidSpeed);

  }

}

function drawVideo() { // draw the video to play on the canvas. 

  background(100, 150, 200);
  vid.size(windowWidth/2, windowHeight/2); 
  vid.position(windowWidth/4,windowHeight/4);
  vid.play();
  vid.loop();

}
