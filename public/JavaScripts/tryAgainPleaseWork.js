"use strict";

// Use the Azure IoT device SDK for devices that connect to Azure IoT Central.
var iotHubTransport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
var SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;

var provisioningHost = 'global.azure-devices-provisioning.net';
var idScope = '0ne000B6266';
var registrationId = '37b09fce-8bbc-4693-a2d0-3ae722543d5b';
var symmetricKey = '5JmQDnPLN63QquPDvdxia28LdwXr9WzTU1uqoAV7AYE=';
var provisioningSecurityClient = new SymmetricKeySecurityClient(registrationId, symmetricKey);
var provisioningClient = ProvisioningDeviceClient.create(provisioningHost, idScope, new ProvisioningTransport(), provisioningSecurityClient);
var hubClient;

var targetTemperature = 0;
var i=0;

// Send device measurements.
function sendTelemetry() {
    var temperature = targetTemperature + (Math.random() * 15);
    var locationArray = [[50.908187, -1.404441], [51.196519, -1.008933], [51.337438, -0.761741], [51.457392, -0.465110], [51.597510, -0.283836], [51.769242, 0.087670], [51.946210, -0.018775],
    [52.084576, 0.015706], [52.205465, 0.121017], [52.345006, 0.317804], [52.430686, 0.535777], [52.524624, 0.790442], [52.580939, 0.983464], [52.603542, 1.175982], [52.630640, 1.296145]];
    var locationLong = locationArray[i++][1];
    var locationLat = locationArray[i++][0];
    var data = JSON.stringify({
      temperature: temperature,
      Alocation: {
          lon: locationLong,
          //alt: altitude,
          lat: locationLat
        }
      });
    var message = new Message(data);
    hubClient.sendEvent(message, (err, res) => console.log(`Sent message: ${message.getData()}` +
      (err ? `; error: ${err.toString()}` : '') +
      (res ? `; status: ${res.constructor.name}` : '')));
  }

  // Send device reported properties.
function sendDeviceProperties(twin, properties) {
    twin.properties.reported.update(properties, (err) => console.log(`Sent device properties: ${JSON.stringify(properties)}; ` +
      (err ? `error: ${err.toString()}` : `status: success`)));
  }

  // Handle settings changes that come from Azure IoT Central via the device twin.
function handleSettings(twin) {
    twin.on('properties.desired', function (desiredChange) {
      for (let setting in desiredChange) {
        if (settings[setting]) {
          console.log(`Received setting: ${setting}: ${desiredChange[setting].value}`);
          settings[setting](desiredChange[setting].value, (newValue, status, message) => {
            var patch = {
              [setting]: {
                value: newValue,
                status: status,
                desiredVersion: desiredChange.$version,
                message: message
              }
            }
            twin.properties.reported.update(patch, (err) => console.log(`Sent setting update for ${setting}; ` +
              (err ? `error: ${err.toString()}` : `status: success`)));
          });
        }
      }
    });
  }

  // Handle countdown command
function onCountdown(request, response) {
    console.log('Received call to countdown');
  
    var countFrom = (typeof(request.payload.countFrom) === 'number' && request.payload.countFrom < 100) ? request.payload.countFrom : 10;
  
    response.send(200, (err) => {
      if (err) {
        console.error('Unable to send method response: ' + err.toString());
      } else {
        hubClient.getTwin((err, twin) => {
          function doCountdown(){
            if ( countFrom >= 0 ) {
              var patch = {
                countdown:{
                  value: countFrom
                }
              };
              sendDeviceProperties(twin, patch);
              countFrom--;
              setTimeout(doCountdown, 2000 );
            }
          }
  
          doCountdown();
        });
      }
    });
  }

  // Handle device connection to Azure IoT Central.
var connectCallback = (err) => {
    if (err) {
      console.log(`Device could not connect to Azure IoT Central: ${err.toString()}`);
    } else {
      console.log('Device successfully connected to Azure IoT Central');
  
      // Create handler for countdown command
      hubClient.onDeviceMethod('countdown', onCountdown);
  
      // Send telemetry measurements to Azure IoT Central every 1 second.
      setInterval(sendTelemetry, 1000);
  
      // Get device twin from Azure IoT Central.
      hubClient.getTwin((err, twin) => {
        if (err) {
          console.log(`Error getting device twin: ${err.toString()}`);
        } else {
          // Send device properties once on device start up.
          var properties = {
            serialNumber: '123-ABC',
            manufacturer: 'Contoso',
            devicetype: 'whatver',
          };
          sendDeviceProperties(twin, properties);
        }
      });
    }
  };
  
  // Start the device (register and connect to Azure IoT Central).
  provisioningClient.register((err, result) => {
    if (err) {
      console.log('Error registering device: ' + err);
    } else {
      console.log('Registration succeeded');
      console.log('Assigned hub=' + result.assignedHub);
      console.log('DeviceId=' + result.deviceId);
      var connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + symmetricKey;
      hubClient = Client.fromConnectionString(connectionString, iotHubTransport);
  
      hubClient.open(connectCallback);
    }
  });