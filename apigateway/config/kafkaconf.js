const kafka = require('kafka-node')
const Producer = kafka.Producer
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient({kafkaHost: 'kafka-service:9092'})


let producer = null
let consumer = null

try {
producer = new Producer(client);
consumer = new Consumer(

  client,
  [{ topic: 'current-status', 
    partitions: 1 }],
    {
      autoCommit: false,
      encoding: 'utf8',
      fromOffset: false
    }
 )
  }
catch (error) {
	console.log(error)
	process.exit()
}

module.exports={producer,consumer}