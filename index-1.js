var express     = require('express');
var FCM         = require('fcm-node');
var app         = express();
var request     = require('request');
var bodyParser  = require('body-parser');
var serverKey   = 'AAAALFM0PVE:APA91bGNDeVpSrYR-ulakmv59NvH-g7eJ9MUkMSzW1Nvc2F5ZDZsYgqBgv4G1QOiTAFEoiB7-w4LNrRmuH0QwY0fYzACpdHNNuEaaQ_s-JxRufBkjsRHHYFbPPa4bMiVVG9ePgsHs7ib';
var fcm         = new FCM(serverKey);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '200mb',
    extended: true,
    parameterLimit: 5000000
}));



app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Content-Type", "application/x-www-form-urlencoded","application/json","application/image");
    res.header("Access-Control-Allow-Headers","Content-Type");
    res.header('Access-Control-Allow-Methods: GET, POST, PUT');
    next();
});

app.post('/getNotification', function(req, res) {
    console.log('req :::', req);
    var getNotification = function() {
       var messageObj = req.body;
       var tokenObj = req.body.tokenLists;
       var pushObj = [];
       console.log('messageObj :::', messageObj);
       for (var i = 0; i < tokenObj.length; i++) {
           var message = {
               //to: 'fpLafCAvBhk:APA91bHzOYLIz54MYrAutiRXJm_pUtDDN3tKmqtDsJXmXfscxVc8PmybfIRKBaHCkpxuZpYVwUqskX_UgrIlr_pAHEhNFoZ9pRrJB-uLUJt9zGWC9Bqywi-0CnI7KWvCEUMU0ngEvyJK',
               to: tokenObj[i],
               notification: {
                   title: 'New message',
                   body: messageObj.message,
                   receiver: messageObj.recvRefKey,
                   recvrName: messageObj.recvrName,
                   senderName: messageObj.senderName
               },
               data: {  //you can send only notification or only data(or include both)
                   title: 'New message',
                   message: messageObj.message,
                   receiver: messageObj.recvRefKey,
                   recvrName: messageObj.recvrName,
                  senderName: messageObj.senderName
               }
           };
           pushObj.push(message);
           fcm.send(message, function(err, response){
               if (err) {
                   console.log("Something has gone wrong!");
                   res.send(err)
               } else {
                   console.log("Successfully sent with response: ", response);
               }
           });
       }

       if(tokenObj.length == pushObj.length) {
           res.send("Success");
       }
   }



    getNotification();


});

app.listen(3000, function() {
    console.log('App is running on 3000 port')
});
