(function() {
  var helpers = {
    randomId: function() {
      return String(Date.now() + Math.random());
    }
  };

  var app = {
    dataStore: {
      tasks: [
        {title: 'Do the dishes',
         complete: false,
         id: helpers.randomId()}
      ]
    },
    channels: {
      tasks: postal.channel('tasks'),
      notifications: postal.channel('notifications')
    }
  };

  // Templates
  var templates = {
    taskItem: Handlebars.compile(
      '<span>' +
        '{{task.title}}' +
        '<a class="removeTask" data-taskid="{{task.id}}">×</a>' +
      '</span>')
  };

  var addTask = function(taskDescription) {
    var task = {
      id: helpers.randomId(),
      title: taskDescription,
      done: false
    };
    app.dataStore.tasks.push(task);
    app.channels.tasks.publish('task:added', task);
  };

  var removeTask = function(data) {
    var removed = _.remove(app.dataStore.tasks, function(task) {
      return task.id === data.taskId;
    });
    app.channels.tasks.publish('task:removed', removed);
  };

  // Renderers
  var page = {
    taskForm: d3.select('form#taskForm'),
    taskList: d3.select('#taskList')
  };

  var renderTaskList = function() {
    var tasks = app.dataStore.tasks;
    var listItems = page.taskList
          .selectAll('li')
          .data(tasks, function(d, i) { return d.title; });
    listItems.enter().append('li').html(function(task, i) {
      return templates.taskItem({task: task});
    });
    listItems.exit().remove();
    page.taskList.selectAll('.removeTask').on('click', function(d, i) {
      app.channels.tasks.publish(
        'task:remove',
        {taskId: this.getAttribute('data-taskid')}
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
