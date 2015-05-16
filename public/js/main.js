(function() {
  var app = {
    dataStore: {
      tasks: ['one']
    }
  };

  var addTask = function(taskDescription) {
    app.dataStore.tasks.push(taskDescription);
  };

  var _init = function() {
    console.log('>> Hello!');

    // Event handlers
    var form = d3.select('form#taskForm');
    form.select('#submit').on('click', function() {
      console.log('>> clicked');
      var input = form.select('#taskDescription');
      var taskDescription = input.property('value');
      addTask(taskDescription);
      input.property('value', '');
    });


    window.app = app;
  };

  _init();
})();
