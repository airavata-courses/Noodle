const producer=require('../config/kafkaconf').producer

 function produce(message,topic) {


smessage = JSON.stringify(message)
return new Promise((resolve,reject)=>{
    let payloads = [
        {
        topic: topic,
        messages: smessage
        }
    ]
    producer.send(payloads, (error, data) => {
        if (error) {
            console.log(error)
            reject(error)
        } else {  
        console.log('produced');
        }
    })
})
}


module.exports = { produce };