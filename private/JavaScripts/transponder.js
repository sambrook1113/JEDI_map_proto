

function receive(){
const { EventHubConsumerClient } = require("@azure/event-hubs");
const connectionString = "Endpoint=sb://poc-data-ingestion.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=qbO+gi23r5F/rd44tXy6tsSt0Q1HXveDIleOdyoCIBA=";    
const eventHubName = "poc-event-hub";
const consumerGroup = "4Working"; // name of the default consumer group
var counter = 0;

async function main() {

  // create a consumer client for the event hub by specifying the checkpoint store
  const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

  // subscribe for the events and specify handlers for processing the events and errors.
  const subscription = consumerClient.subscribe({
      processEvents: async (events, context) => {
        for (const event of events) {
          if(true ){
            console.log(`Received event: '${event.body}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`);
            console.log(event.body.Alocation.lat + " " + event.body.Alocation.lon)
            counter++
            console.log(counter)
          }
        }
        // update the checkpoint
        await context.updateCheckpoint(events[events.length - 1]);
      },

      processError: async (err, context) => {
        console.log(`Error : ${err}`);
      }
    }
  );

  // after 30 seconds, stop processing
  await new Promise((resolve) => {
    setTimeout(async () => {
      await subscription.close();
      await consumerClient.close();
      resolve();
    }, 3000000);
  });
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});






//   console.log('transponder.receive function!')
//   var counter = 0;
//   const { EventHubClient, delay } = require("@azure/event-hubs");

  

//   require("dotenv").config();

  

// // Connection string - primary key of the Event Hubs namespace. 
// // For example: Endpoint=sb://myeventhubns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// //const connectionString = String(process.env.eventHubConnectionString);
// const connectionString = "Endpoint=sb://poc-data-ingestion.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=qbO+gi23r5F/rd44tXy6tsSt0Q1HXveDIleOdyoCIBA=";
// // Name of the event hub. For example: myeventhub
// //const eventHubsName = String(process.env.eventHubName);

// var d = new Date();
// const time = d.getTime();

// const eventHubsName = "poc-event-hub";
// async function main() {
//   const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName);
//   const allPartitionIds = await client.getPartitionIds();
//   const firstPartitionId = allPartitionIds[0];

//   const receiveHandler = client.receive(firstPartitionId, eventData => {
//     //console.log(`Received message: ${eventData.body.Alocation.lon} from partition ${firstPartitionId}`);
//     var messageTime = new Date(eventData.enqueuedTimeUtc);
//     if(messageTime > time && eventData.annotations["iothub-connection-device-id"] == "0333a45c-8d26-4d58-9531-6ea1f9d61883"){
//       console.log(eventData.annotations["iothub-connection-device-id"]);
//       //console.log(eventData.body.Alocation.lat + " " + eventData.body.Alocation.lon + " " +  eventData.annotations["iothub-connection-device-id"]);
//       console.log(counter);
//       counter++;
//     }
//     else{
//       //console.log(eventData.body.deviceId)
//     }
//   }, error => {
//     console.log('Error when receiving message: ', error)
//   });

  

//   // Sleep for a while before stopping the receive operation.
//   //await delay(15000);
//   //await receiveHandler.stop();

  

//   //await client.close();
// }



// main().catch(err => {
//   console.log("Error occurred: ", err);
// });
}

module.exports = {receive: receive}
