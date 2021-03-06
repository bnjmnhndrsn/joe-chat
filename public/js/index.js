window.onload = function(){
  (function(){
    $('#create').click(function() {
      var userPath = $('#basic-url').val();
      if (userPath == "") {
        alert('You must specify a path!')
      } else {
        var path = window.location.origin + '/' + userPath;
        window.open(path);
      }
    });

    var fetchAndAppendActiveRooms = function() {
      var url = window.location.origin + '/open_rooms';
      $.ajax({
        url: url,
        success: function(response) {
          $roomList = $('#active-room-list');
          $roomList.html("");
          var propertyCounter = 0;
          for (var property in response) {
            if (response.hasOwnProperty(property)) {
              propertyCounter++;
              $roomList.append("<a href='" + window.location.origin + "/" + property + "' class='list-group-item'>" + property +
                "<span class='pull-right'>" + response[property] + "  User(s)</span></a>"
              );
            }
            if (propertyCounter > 0) {
              $('#active-room-header').show();
            }
          }
          if (propertyCounter == 0) {
            $('#active-room-header').hide();
          }
        }.bind(this)
      });
    }

    fetchAndAppendActiveRooms();
    setInterval(fetchAndAppendActiveRooms, 1500);
  })();
}
