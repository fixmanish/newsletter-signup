// jshint esversion: 6

const express = require('express');
const app = express();
const request = require('request');
const https = require('https');
const hostname = '0.0.0.0';

const bodyParser =  require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

//routing the signup.html to the home directory to take user inputs as front end
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
})

//routing via post request, getting user inputs and routing to mailchimp api
app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const emailAdd = req.body.email;

  const data = {
    members: [
      {
        email_address: emailAdd,
        status: "subscribed",
        marge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const url = "https://us21.api.mailchimp.com/3.0/lists/609d08e817";
  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "manish1:3e569542f079135c1f07204fe5ca8388-us21"
  }

  // this const is function scoped, it doesn't clash with that which have been for npm module.
  // it is for extracting data
  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    // the "data" here written as a first parameter in response.on specifies
    // that if a data is recived from the server it will parse it as JSON object
    // it is not the "data" which you named as const ok.
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

  // console.log(firstName, lastName, emailAdd);
})

// for the failure route, after the failed message arrives and button clicked
app.post("/failure", function(req, res){
  res.redirect("/");
})

// either run on the process environment that deployment server gives or at 3000 locally
app.listen(process.env.PORT || 3000, hostname, function(){
  console.log("Server is running on port 3000.")
});

// Mailchimp API key
// 3e569542f079135c1f07204fe5ca8388-us21
// API keys for security reasons don't get accessible after creation

// audience or list id
// 609d08e817