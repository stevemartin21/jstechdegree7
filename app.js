//  __ =   ===  __  __  ` `  % %  __dirname  __filename

//LIst of Variables and modules 
const express= require('express');
const app = express();
const bodyParser= require('body-parser');
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);
var userName = config.accountName

//Request Friend list 
let friendList =[];

T.get('friends/list', { screen_name: userName, count:5 },  function (err, data, response) {
	console.log('success');
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

T.get('statuses/user_timeline', { screen_name: userName, count:5 },  function (err, data, response) {
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
	//load created ojbects and render index pug
	res.render('index', {statusesArray, friendList, directMessageList});
})

app.listen(3000, () =>{
	console.log('Things are runnning!')
} )



