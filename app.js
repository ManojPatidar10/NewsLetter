const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');


//make an express app
const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({extended: true})); 

//create a static folder 
app.use(express.static(path.join(__dirname, 'public')));

// Let's setup signup with "/signup" and with POST method
app.post('/signup', (req, res)=>{

    const{ firstName, lastName, email } = req.body;
    
    // make sure fields are not empty
    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }

    // construct data
    const data={
        members:[{
            email_address: email,
            status : 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    //convert to string
    const postData =JSON.stringify(data);


    const options = {
        url: 'https://us13.api.mailchimp.com/3.0/lists/966ec65277',
        method: 'POST',
        headers:{
            Authorization:'auth 4fbaaf44ca50777b3d4695449f7abd80-us13'
        },
        body: postData
    }
    //make a request to mailchimp api
    request(options, (err, response, body)=>{
            if(err){
                res.redirect('/fail.html');
            }
            else{
                if(response.statusCode===200){
                    res.redirect('/success.html');
                }
                else{
                    res.redirect('/fail.html');
                }
            }
    });
})

const PORT = process.env.PORT || 5020;

app.listen(PORT, console.log(`server started at ${PORT}`));
