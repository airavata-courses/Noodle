const express = require('express')
const bodyParser = require('body-parser')
const cors=require('cors')
const app = express()
var kafka = require('kafka-node')
const client = new kafka.KafkaClient();
const admin = new kafka.Admin(client);
global.resMap = {}

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("API Gateway")
})

require("./routes/route")(app);

const PORT = 5050;

app.listen(PORT, () => console.log('API Gateway Server started on port ' +PORT));

var topics = [{
    topic: 'current-status',
    partitions: 0,
    replicationFactor: 1
  },{
    topic: 'data-retrieve',
    partitions: 0,
    replicationFactor: 1
  },{
    topic: 'retrieved-data',
    partitions: 0,
    replicationFactor: 1
  },{
    topic: 'retrieve-session',
    partitions: 0,
    replicationFactor: 1
  }]
  client.createTopics(topics, (error, result) => {
    console.log(result)
  });

const consumer = require('./config/kafkaconf').consumer
    
  consumer.on('message', (message)=>{
      console.log('Entered consumer.on.message')
      data = JSON.parse(message.value)    
      resMap[data.user] = data;
      console.log(resMap)
  }
       
)
//console.log(data)
consumer.on('error', (error)=>{
  console.log('error', error)
})
