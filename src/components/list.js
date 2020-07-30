import Task from "./task";

export default class List{
  constructor($container, projData) {
    if (!$container)
      throw new Error(`"$container undefined", nowhere no mount!`);
    else this.$container = $container;
    this.data = projData;
    this.tasks= [];
  }

  mount() {
    const {
      id,
      name
    } = this.data;

    this.$container.append(`
      <div id="projectContainer${id}" class="card mx-auto mb-3 w-75 bg-transp no-border">
        <div class="row w-100 m-auto p-2 d-flex align-items-center bg-grad-0 border-dark-blue font-15">
          <div class="col-md-1 text-center">
            <i class="fas fa-clipboard-list font-20"></i>
          </div>
          <div class="col-md px-0">
            <input id="iProjName" class="w-100 py-1 mx-auto text-white bg-brdr-transparent" type="text" readonly value="${name}" >
          </div>
          <div id="edProjName" class="col-md-1 text-center" >
            <i class="fas fa-pen cursor-pointer"></i>
          </div>
          <div id="trashBtn" class="col-md-1 text-center">
            <i class="far fa-trash-alt cursor-pointer"></i> 
          </div>
        </div>
        <div class="row w-100 m-auto px-2 pt-2 pb-3 bg-grey-1">
          <div class="col-md-1 text-center">
            <i class="fas fa-plus font-20 my-auto text-green-1"></i>
          </div>
          <div class="col-md px-0">
            <input id="iNewTask" class="h-100 w-100 py-1 mx-auto border-t-dark-grey" placeholder="Start typing here to create new task">
          </div>
          <div class="col-md-2 pl-0">
            <button id="addTask" type="button" class="bg-grad-1 border-green-dark text-white font-weight-bold btn-block btn btn-default">Add Task</button>
          </div>
        </div>
        <div id="tasks" class="border border-top-0 bg-white">
        </div>
        <div class="row w-100 mx-auto border-bot-round bg-white">
          <p class="col"></p>
        </div>
      </div>
    `);

    $("#edProjName").on("click", () => this.editProjectName());
    $("#trashBtn").on("click", () => this.unmount());
    $("#iProjName").on("keypress", (e) => {
      if(e.which === 13) // "Enter" key
        $("#iProjName").prop("readonly", (i, val) => !val).blur();
    });
    $("#addTask").on("click", () => this.addTask());
    
    if (this.tasks.length > 0) 
      this.tasks.forEach((t) => t.mount());
    
  }

  addTask() {
    const $iNewTask = $("#iNewTask");
    const $tasks = $("#tasks");
    const taskData = {
      id: new Date().getTime(),
      status: 1,
      descr: "",
      projId: this.data.id,
      priority: 0
    };
    
    if ($iNewTask.val().length === 0) 
      $iNewTask.prop("placeholder", "Task description required!"); 
    else {
      taskData.descr= $iNewTask.val();
      this.tasks.push(new Task($tasks, taskData));
      this.tasks[this.tasks.length - 1].mount();
      $iNewTask.prop("placeholder", "Start typing here to create new task")
        .val("");
      this.dbInsertTask(taskData);
    }
  }

  async dbInsertTask(task) {
    const options = {
      method: "post",
      body: JSON.stringify(task),
      headers: {
        "content-type": "application/json"
      }
    };
    const res = await fetch("/inserttask", options);

    if (res.status !== 201) {
      let body = await res.json();
      $("#err").text(body.message);
    }
  }

  editProjectName() {
    const $iProjName = $("#iProjName");
    $iProjName.prop("readonly", (i, val) => !val);
    $iProjName.is(":focus") ? $iProjName.blur(): $iProjName.focus();
  }

  unmount() {
    $("#edProjName").off();
    $("#iProjName").off();
    $("#trashBtn").off();
    $("#addTask").off();

    $(`#projectContainer${this.data.id}`).remove();
  }
}
