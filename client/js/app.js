$(document).ready(function() {

  ee = new EventEmitter2();


  $('#js-ws-url-btn').on('click', function(e) {

    var wsurl = $('#js-ws-url').val()
    ee.emit('new-connection', wsurl)

  });
  

  ee.on('new-connection', function(wsurl) {
      ws = new WebSocket(wsurl, "sensors-protocol");

      ws.onopen = function(e) { 
        // console.log("wow: "+e.data)
        ee.emit('connected', e.data)
      }

      ws.onclose = function(e) { 
        // console.log("wow: "+e.data)
        ee.emit('disconnected', e.data)
      }

      ws.onerror = function(e) { 
        // console.log("wow: "+e.data)
        ee.emit('error', e.data)
      }

      ws.onmessage = function(e) { 
        var obj = JSON.parse(e.data);

        ee.emit(obj.msgtype, obj)
      }



      ee.on('data', function(obj){
        random.append(new Date().getTime(), obj.value);
        console.log('data.ric: '+obj.value)
      });

      ee.on('disconnected', function(msg){
        console.log('dric: '+msg)
      });

      ee.on('connected', function(msg){
        console.log('cric: '+msg)

        random = new TimeSeries();
        setInterval(function() {
          // ws.send('hello world');
          // ee.emit('data', {value: 800.00})
        }, 500);
        createTimeline('chart1');

      });

      ee.on('error', function(msg){
        console.log('eric: '+msg)
      });

      
      function createTimeline() {
        var chart = new SmoothieChart();
        chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
        chart.streamTo(document.getElementById("chart1"), 500);
      }

  });




});