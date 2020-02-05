

function receive(){
  const server = require('../../server.js')
  const { EventHubConsumerClient } = require("@azure/event-hubs");
  const connectionString = "Endpoint=sb://poc-data-ingestion.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=qbO+gi23r5F/rd44tXy6tsSt0Q1HXveDIleOdyoCIBA=";    
  const eventHubName = "poc-event-hub";
  const consumerGroup = "never_ever_use"; // consumer group
  var counter = 0;

  async function main() {

  // create a consumer client for the event hub by specifying the checkpoint store
  const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

  // subscribe for the events and specify handlers for processing the events and errors.
  const subscription = consumerClient.subscribe({
    processEvents: async (events, context) => {
      for (const event of events) {
        if(event.body.location != null ){
          server.io.emit('iot_ping', event.body)
          }
        }
        // update the checkpoint
        await context.updateCheckpoint(events[events.length - 1]);
      },
      processError: async (err, context) => {
        console.log(`Error : ${err}`);
      }
    });

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
}

module.exports = {receive: receive}
