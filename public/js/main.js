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
    console.log('>> Welcome to Playpen!');

    // Event handlers
    var taskForm = d3.select('form#taskForm');
    taskForm.select('#submit').on('click', function() {
      var input = taskForm.select('#taskDescription');
      var taskDescription = input.property('value');
      addTask(taskDescription);
      input.property('value', '');
    });


    window.app = app;
  };

  _init();
})();
