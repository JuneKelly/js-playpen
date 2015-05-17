(function() {
  var app = {
    dataStore: {
      tasks: [
        {title: 'one', complete: false}
      ]
    },
    channels: {
      tasks: postal.channel('tasks')
    }
  };

  var page = {
    taskForm: d3.select('form#taskForm'),
    taskList: d3.select('#taskList')
  };

  var addTask = function(taskDescription) {
    var task = {
      title: taskDescription,
      done: false
    };
    app.dataStore.tasks.push(task);
    app.channels.tasks.publish('task.add.complete', task);
  };

  // Renderers
  var renderTaskList = function() {
    var tasks = app.dataStore.tasks;
    var listItems = page.taskList.selectAll('li').data(tasks);
    listItems.enter().append('li').html(function(task) {
      return task.title + '<a class="removeTask" data-taskid="1">×</a>';
    });
    listItems.exit().remove();
    page.taskList.selectAll('.removeTask').on('click', function() {
      console.log('remove');
    });
  };

  var _init = function() {
    console.log('>> Welcome to Playpen!');

    // Event handlers
    page.taskForm.select('[type=submit]').on('click', function() {
      var input = page.taskForm.select('#taskDescription');
      var taskDescription = input.property('value');
      app.channels.tasks.publish('task.add', taskDescription);
      input.property('value', '');
    });

    // Subscriptions
    var tasks = app.channels.tasks;
    tasks.subscribe('task.add', function(data, envelope) {
      addTask(data);
    });
    tasks.subscribe('task.add.complete', function(data, envelope) {
      renderTaskList();
    });

    renderTaskList();
    window.app = app;
  };

  _init();
})();
