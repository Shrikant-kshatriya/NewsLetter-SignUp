const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { response } = require('express');
const { dirname } = require('path');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req,res) => {
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;
    console.log(req.body.fname);
    let data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    };
    let jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/5dee1e0061"
    const options = {
        method: "POST",
        auth: "process.env.APIKEY"
    }
    const request = https.request(url, options, (response) => {
        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }else {
            res.sendFile(__dirname + '/failure.html')
        }
        response.on('data', (data) => {
            let dd = JSON.parse(data);
            console.log(dd);
        })
    });
    request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.listen(process.env.PORT || 3000, () => {
    console.log('server running at port 3000');
});
