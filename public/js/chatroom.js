window.onload = function(){
  (function(){
    $('#input').keypress(function(e) {
      if (e.which == 13) {
        $('#input').submit();
      }
    }.bind(this))

    var inFocus;
    var unseenNotifications = 0;
    $(window).focus(function() {
      inFocus = true;
      unseenNotifications = 0;
      $('title').html("Joe Chat")
    });

    $(window).blur(function() {
      inFocus = false;
    });

    var show = function($el){
      return function(msg, sender){
        $el.append("<li class='chat-body'><strong>" +
          sender + " </strong>" + msg + "</li>");
      }
    }($("#msgs"));

    var ws = new WebSocket('ws://' + window.location.host + window.location.pathname);
    ws.onopen = function() {
      show('websocket opened');
    };
    ws.onclose = function() {
      show('websocket closed');
    };
    ws.onmessage = function(m) {
      var msg = JSON.parse(m.data)
      if (msg['type'] == 'group-message'){
        show(msg.content, msg.sender);
        $(".chat").animate({ scrollTop: $('.chat')[0].scrollHeight }, "slow");
        if (inFocus == false) {
          unseenNotifications++;
          $("title").html("(" + unseenNotifications + ") Joe Chat");
        }
      } else if (msg['type'] == 'status-update') {
        var numUsers = msg.num_users;
        $('#user-count').html(numUsers);
      }
    };

    setInterval(function(){
      ws.send(JSON.stringify({ 'type': 'update-request' }));
    }.bind(this), 500)

    var sender = function(f){
      var input = document.getElementById('input');

      f.onsubmit = function(){
        ws.send(
          JSON.stringify(
            {
              'type': 'group-message',
              'content': input.value,
              'sender': document.getElementById('handle').value
            }
          )
        );
        setTimeout(function(){$('#input').val('');}.bind(this), 5);
        return false;
      }
    }(document.getElementById('form'));
  })();
}
