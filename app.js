//  __ =   ===  __  __  ` `  % %  __dirname  __filename

/*THis works

T.get('search/tweets', { q: 'rio de janeiro since:2011-07-17', count: 5 }, function(err, data, response) {
  console.log(data)

});

*/
/*
		The template should have spaces for:
		your 5 most recent tweets
		your 5 most recent friends
		your 5 most recent direct messages

*/

// To do 

// Read twitter API Dos

//Write Put File based on index.html file--do a little piece of pug at a time


const express= require('express');

//console.log('Success');

const app = express();

const bodyParser= require('body-parser');

var Twit = require('twit');

var config = require('./config');
//console.log(config);

var T = new Twit(config);

/*

var params  = { 
	//q: 'rio de janeiro flamengo since:2011-07-17', 
	count: 5,
	screen_name: 'SackLakeCity'
	//result_type: 'popular' 
};

*/

// I needed to create an object called params that can be passed into the get request and then can be used to get the recent tweens

//Because I used the module it makes it really eacy, basically I do a get request which grabs my authentication and goes to twitter  and based on the query
// I do I can get 

//T.get('search/tweets', params, gotData);

//GET statuses/user_timeline  since_id  statuses/user_timeline

// Friends profile image real name screen name

/*

 userImage = data.users[i].profile_image_url;
  
  friends.realName = data.users[i].name;
  
  friends.screenName = data.users[i].screen_name;


*/



let friendList =[];

T.get('friends/list', { screen_name: 'SackLakeCity', count:5 },  function (err, data, response) {
 /// console.log(data);
  //console.log('It worked');
 // console.log(data.users.length);

  	for (let i=0; i<data.users.length; i++){

  			//console.log('it worked again')

		   let userImage = data.users[i].profile_image_url;
			let realName = data.users[i].name;
		  let screenName = data.users[i].screen_name;
		
		  friendList.push({

		  userImage:userImage,
		  realName:realName,
		  screenName:screenName
		 
		  });

		 

	}
 
 // console.log(friends);
});

//let text,retweet, likes, dateTweeted;

let statusesArray= [
]

let statuses={};

T.get('statuses/user_timeline', { screen_name: 'SackLakeCity', count:5 },  function (err, data, response) {
 //console.log(data);
 //console.log(data.length);

 	for (let i=0; i<data.length; i++){

		   let name= data[i].user.name;
			let followers  = data[i].user.friends_count;
		  let screen_name  = data[i].user.screen_name;
		  let text = data[i].text;
		  let retweet = data[i].retweet_count;
		  let likes = data[i].favorite_count;
		  let dateTweeted =data[i].created_at;
		  let image = data[i].user.profile_image_url;

		  

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
		  //console.log(statusesArray);	
		 
	} 
});






//direct_messages/events/list  Messages  message body  date the message was sent time the message was sent

/*

ul
  each val, index in {1:'one',2:'two',3:'three'}
    li= index + ': ' + val
*/
var directMessage =[];
var directMessageList =[];

T.get('direct_messages/events/list', { count: 7 }, function(err, data, response) {
	


	for (i=0; i<data.events.length; i++){
		id= data.events[i].id;

		directMessage.push(id);

	}

	//console.log(directMessage);

			for (i=0; i<directMessage.length; i++){


					T.get('direct_messages/show', { id: directMessage[i] }, function(err, data, response)	{

						//console.log(data);

								


								let message = data.text;
								let sender = data.sender.profile_image_url;
								let time = data.sender.created_at;
								let name = data.sender.name;


										directMessageList.push({

						  				message:message,
						  				sender:sender,
						  				time:time,
						  				name:name
						 
						  				});

						  				

						  		


					})

			}



});


//console.log(directMessage);

	
/*
// .message_create

function gotData(err, data, response) {

	console.log(data);
	
	/*var tweets = data.statuses;
	for (i=0; i<tweets.length; i++){
		console.log(tweets[i].text);
		//console.log(data.events[4].message_create.message_data.text);
	}
	
  
};

var tweet = { status: 'Go Utes!' }

function tweeted (err, data, response) {
  if(err){
  	console.log('Something Web Wrong')
  }else{
  	console.log('Congrats you sent a tweet!')
  }
}

*/


//T.post('statuses/update', tweet, tweeted);







app.set('view engine', 'pug');

app.use(express.static('public'))

app.get('/', (req, res)=> {

	res.render('index', {statusesArray, friendList, directMessageList});
	
	console.log(friendList);
	//console.log(friends);
	console.log(directMessageList);

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




