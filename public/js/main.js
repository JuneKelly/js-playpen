(function() {
  var app = {
    dataStore: {
      tasks: [
        {title: 'one', complete: false}
      ]
    }
  };

  var page = {
    taskForm: d3.select('form#taskForm'),
    taskList: d3.select('#taskList')
  };

  var addTask = function(taskDescription) {
    app.dataStore.tasks.push({
      title: taskDescription,
      done: false
    });
  };

  var _init = function() {
    console.log('>> Welcome to Playpen!');

    // Event handlers
    page.taskForm.select('[type=submit]').on('click', function() {
      var input = page.taskForm.select('#taskDescription');
      var taskDescription = input.property('value');
      addTask(taskDescription);
      input.property('value', '');
      renderTaskList();
    });

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


    renderTaskList();
    window.app = app;
  };

  _init();
})();
