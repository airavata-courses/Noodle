const kafka = require('kafka-node')
const Producer = kafka.Producer
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient(process.env.KAFKA_SERVER)


let producer = null
let consumer = null


//producer = new Producer(client);
//consumer = new Consumer(

//  client,
//  [{ topic: 'current-status',
//    offset:0, 
//    partition: 0 }],
//    {
//      autoCommit: false,
//      encoding: 'utf8',
//      fromOffset: true
//    }
// )

try {
	producer = new Producer(client);
	consumer = new Consumer(
		{
			kafkaHost: "kafka-service:9092",
			//groupId: 'api-gateway-group',
			autoCommit: true,
			protocol: ["roundrobin"],
			autoCommitIntervalMs: 5000,
			fetchMaxWaitMs: 1000,
			fetchMaxBytes: 1024*1024,
			encoding: 'utf8',
			fromOffset: "latest"
		},
		['current-status']
	)
} catch (error) {
	console.log(error)
	process.exit()
}

module.exports={producer,consumer}