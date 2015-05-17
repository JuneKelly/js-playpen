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

  // Templates
  var templates = {
    taskItem: Handlebars.compile(
      '<span>' +
        '{{task.title}}' +
        '<a class="removeTask" data-taskid="{{idx}}">×</a>' +
      '</span>')
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
    app.channels.tasks.publish('task:added', task);
  };

  var removeTask = function(data) {
    var idx = data.taskId;
    app.dataStore.tasks.splice(idx, 1);
    app.channels.tasks.publish('task:removed', data);
  };

  // Renderers
  var renderTaskList = function() {
    var tasks = app.dataStore.tasks;
    var listItems = page.taskList
          .selectAll('li')
          .data(tasks);
    listItems.enter().append('li').html(function(task, i) {
      return templates.taskItem({task: task, idx: i});
    });
    listItems.exit().remove();
    page.taskList.selectAll('.removeTask').on('click', function(d, i) {
      app.channels.tasks.publish(
        'task:remove',
        this.getAttribute('data-taskid')
      );
    });
  };

  var _init = function() {
    console.log('>> Welcome to Playpen!');

    // Event handlers
    page.taskForm.select('[type=submit]')
      .on('click', function() {
        var input = page.taskForm.select('#taskDescription');
        var taskDescription = input.property('value');
        if(taskDescription) {
          app.channels.tasks.publish('task:add', taskDescription);
          input.property('value', '');
        }
      });

    // Subscriptions
    var tasks = app.channels.tasks;
    tasks.subscribe('task:add', function(data, envelope) {
      addTask(data);
    });
    tasks.subscribe('task:added', function(data, envelope) {
      renderTaskList();
    });
    tasks.subscribe('task:remove', function(data, envelope) {
      removeTask(data);
    });
    tasks.subscribe('task:removed', function(data, envelope) {
      renderTaskList();
    });

    renderTaskList();
    window.app = app;
  };

  _init();
})();
