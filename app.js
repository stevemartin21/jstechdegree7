//  __ =   ===  __  __  ` `  % %  __dirname  __filename

//LIst of Variables and modules 
const express= require('express');
const app = express();
const bodyParser= require('body-parser');
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);


//Request Friend list 

let friendList =[];

T.get('friends/list', { screen_name: 'SackLakeCity', count:5 },  function (err, data, response) {

  	for (let i=0; i<data.users.length; i++){

  			//RUn for loop and grab values for each friend
		   let userImage = data.users[i].profile_image_url;
			let realName = data.users[i].name;
		  let screenName = data.users[i].screen_name;

		  //Add object to array with values 
		  friendList.push({
		  userImage:userImage,
		  realName:realName,
		  screenName:screenName
		  });
	}
 
 
});

// Status Updatee for twitter

let statusesArray= [
]

let statuses={};

T.get('statuses/user_timeline', { screen_name: 'SackLakeCity', count:5 },  function (err, data, response) {
	//For Loop for each item in teh data
 	for (let i=0; i<data.length; i++){

 		//Grab Values 

		   let name= data[i].user.name;
			let followers  = data[i].user.friends_count;
		  let screen_name  = data[i].user.screen_name;
		  let text = data[i].text;
		  let retweet = data[i].retweet_count;
		  let likes = data[i].favorite_count;
		  let dateTweeted =data[i].created_at;
		  let image = data[i].user.profile_image_url;
		  // PUt values into an object and array
		  statusesArray.push({

		  text:text,
		  followers:followers,
		  screen_name:screen_name,
		  name:name,
		  retweet:retweet,
		  likes:likes,
		  dateTweeted:dateTweeted,
		  image:image

		  });  
		  
	} 
});


//Direct Message Request
var directMessage =[];
var directMessageList =[];

T.get('direct_messages/events/list', { count: 7 }, function(err, data, response) {
// For loop for messates
	for (i=0; i<data.events.length; i++){
		id= data.events[i].id;
		//Grab Ide
		directMessage.push(id);

	}
	//second request iwth ids
			for (i=0; i<directMessage.length; i++){
					T.get('direct_messages/show', { id: directMessage[i] }, function(err, data, response)	{

						let message = data.text;
						let sender = data.sender.profile_image_url;
						let time = data.sender.created_at;
						let name = data.sender.name;		
						// Add vlaues to object and array
						directMessageList.push({

						  message:message,
						  sender:sender,
						  time:time,
						  name:name
						 
						 });
					})
			}
});


//Set the pug engine
app.set('view engine', 'pug');
//request public folders
app.use(express.static('public'))
//set route to pull request
app.get('/', (req, res)=> {
	//load created ojbects 
	res.render('index', {statusesArray, friendList, directMessageList});
})

app.listen(3000, () =>{
	console.log('Things are runnning!')
} )



/*


console.log(data.events[0].message_create.message_data.entities);
  console.log(data.events[0].message_create.message_data.text);
  console.log(data.events[1].message_create.message_data.text);
  console.log(data.events[2].message_create.message_data.text);
  console.log(data.events[3].message_create.message_data.text);
  console.log(data.events[4].message_create.message_data.text);


You will need to create the following files:

A Jade/Pug template file to display tweets and messages


The following files are provided:

Create a new Twitter application
This will generate the keys and access tokens you need to authenticate your application so it can communicate with the Twitter API. You can find a link to a tutorial on how to do this in the project resources. Please note that while the tutorial says to create a Twitter dev account at dev.twitter.com, the url to create a Twitter dev account is now https://apps.twitter.com/
Use and interact with the Twitter API
To use and interact with the Twitter API, you’ll need to set up a way to give the Twitter API the set of keys and access tokens that were generated when you create your Twitter app. It’s a good idea to use an npm module to help you with this part. For this project, you’ll use an npm module called Twit. You can find a link in the project resources. Be sure to look through the documentation and familiarize yourself with how it works.
Create a file called config.js. In this file, you’ll assign an object literal to the module.exports object, as shown in the Twit documentation. The object literal should have the following properties with their corresponding values from your Twitter application account:
consumer_key
consumer_secret
access_token
access_token_secret
Import this config.js code into your app.js file to authenticate your application so you can request data from the Twitter API.
NOTE: The config.js file must be listed in the .gitignore file so it won’t be committed to your github repository. This will prevent your keys and tokens from getting posted publicly to GitHub. It is very important that you do NOT upload any of your personal API keys / secrets / passwords to Github or other publicly accessible place. When your project is reviewed, the project reviewer will use their own config file.

Make a Pug/Jade template for the main page
The template should have spaces for:
your 5 most recent tweets
your 5 most recent friends
your 5 most recent direct messages
It should also include your personal Twitter name and profile image at the top of the screen.
Styling is not the important part of this project. Craft your template markup to take advantage of the CSS we’ve provided you. Knowing how to work with someone else’s styles is a very important skill as a full-stack developer. Pay attention to class names, inheritance, and so on. Try to avoid element types that are not used in the provided HTML and CSS files.
Handle requests and routes using Node and Express
Using Node and Express, request the data you need from Twitter’s API, render it in your template, and send it to the client at the “/” route. Please avoid using Express generator to set up this project. It will be good practice to set up a simple Express app yourself!
Each rendered result must include all of the information seen in the sample layout:



Tweets
message content
# of retweets
# of likes
date tweeted


Friends
profile image
real name
screen name


Messages
message body
profile image
date the message was sent
time the message was sent
NOTE: Twitter API Update: The Twitter API now asks that API users no longer target direct_messages, but rather direct_messages/events/list. The problem is that this only targets DMs in the last thirty days. So if your user doesn't have 5 DMs in the last thirty days, and your app is expecting 5 DMs, then your app will throw an error, likely crash, and not load to the page. As a developer, the way to deal with this would be to use a conditional to check that the DMs exist before trying to doing something with them. If there are less than 5 DMs available, then all you can do is print what's available. And if you can figure out how to print a "Direct Message unavailable or does not exist" placeholder message in lieu of the missing DMs, then all the better.

NOTE: You don’t have to display direct messages as a back and forth conversation. Displaying only sent or received messages is fine.

Make sure the application actually renders your correct Twitter information by running it on your local machine and comparing it to your recent Twitter activity.




*/




