const kafka = require('kafka-node')
const Producer = kafka.Producer
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient(process.env.KAFKA_SERVER)

producer = new Producer(client);
consumer = new Consumer(

  client,
  [{ topic: 'current-status',
    offset:0, 
    partition: 0 }],
    {
      autoCommit: false,
      encoding: 'utf8',
      fromOffset: true
    }
) 

module.exports={producer,consumer}