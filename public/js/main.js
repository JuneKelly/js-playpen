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
    taskForm.select('[type=submit]').on('click', function() {
      var input = taskForm.select('#taskDescription');
      var taskDescription = input.property('value');
      addTask(taskDescription);
      input.property('value', '');
      drawTaskList();
    });

    var drawTaskList = function() {
      var tasks = app.dataStore.tasks;
      var taskList = d3.select('#taskList');
      var listItems = taskList.selectAll('li').data(tasks);
      listItems.enter().append('li').text(function(x) { return x; });
      listItems.exit().remove();
    };


    drawTaskList();
    window.app = app;
  };

  _init();
})();
