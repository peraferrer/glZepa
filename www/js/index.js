var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();

    $('#btnBluetooh').tap(function() {
      if ($(this).text() == 'Bluetooth Connect') {
        bluetoothSerial.connect('20:13:08:16:06:35', blueConnect, blueFailure);
      } else {
        bluetoothSerial.disconnect(blueDisconnect);
      }
    });
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');

    function onSuccess(acceleration) {
      $("#x").html('<b>X: </b>' + (acceleration.x * 50).toFixed(2));
      $("#y").html('<b>Y: </b>' + (acceleration.y * 50).toFixed(2));
      $("#z").html('<b>Z: </b>' + (acceleration.z * 50).toFixed(2));

      bluetoothSerial.isConnected(
        function() {
          bluetoothSerial.write('X: ' + (acceleration.x * 50).toFixed(2), blueWriteSuccess, blueWriteFailure);
          bluetoothSerial.write('Y: ' + (acceleration.y * 50).toFixed(2), blueWriteSuccess, blueWriteFailure);
          bluetoothSerial.write('Z: ' + (acceleration.z * 50).toFixed(2), blueWriteSuccess, blueWriteFailure);
        }
      );
    }

    function onError(err) {
      alert('Accel: '+err);
    }

    setInterval(function() {
      navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
    },100);

    bluetoothSerial.isEnabled(
      function() {
        $("#bluelist").html("");
        bluetoothSerial.list(function(devices) {
          devices.forEach(function(device) {
            document.getElementById("bluelist").innerHTML += device.name + ' | ' + device.address + '<br>';
          })
        }, function(err) {
          //alert(err);
        });
      },
      function() {
        alert("Bluetooth is NOT Enabled");
      }
    );

  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
//        var parentElement = document.getElementById(id);
//        var listeningElement = parentElement.querySelector('.listening');
//        var receivedElement = parentElement.querySelector('.received');
//
//        listeningElement.setAttribute('style', 'display:none;');
//        receivedElement.setAttribute('style', 'display:block;');
//
//        console.log('Received Event: ' + id);
  }
};

var blueConnect = function() {
  $('#btnBluetooh').text('Bluetooth Disconnect');
  $('#btnBluetooh').button('refresh');
};

var blueFailure = function(err) {
  alert(err);
  $('#btnBluetooh').text('Bluetooth Connect');
  $('#btnBluetooh').button('refresh');
};

var blueDisconnect = function() {
  $('#btnBluetooh').text('Bluetooth Connect');
  $('#btnBluetooh').button('refresh');
};

var blueWriteSuccess = function() {
};

var blueWriteFailure = function(err) {
  alert(err);
};