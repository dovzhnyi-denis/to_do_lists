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
      <div id="todoList${id}" class="card mx-auto mb-3 w-75 bg-transp no-border">
        <div class="row w-100 m-auto p-2 d-flex align-items-center bg-grad-0 border-dark-blue font-15">
          <div class="col-md-1 text-center">
            <i class="fas fa-clipboard-list font-20"></i>
          </div>
          <div class="col-md px-0">
            <input id="iListName${id}" class="w-100 py-1 mx-auto text-white text-truncate bg-brdr-transparent" type="text" maxlength="50" readonly value="${name}">
          </div>
          <div id="edName${id}" class="col-md-1 text-center" >
            <i class="fas fa-pen cursor-pointer"></i>
          </div>
          <div id="trashBtn${id}" class="col-md-1 text-center">
            <i class="far fa-trash-alt cursor-pointer"></i> 
          </div>
        </div>
        <div class="row w-100 m-auto px-2 pt-2 pb-3 bg-grey-1">
          <div class="col-md-1 text-center">
            <i class="fas fa-plus font-20 my-auto text-green-1"></i>
          </div>
          <div class="col-md px-0">
            <input id="iNewTask${id}" class="h-100 w-100 py-1 mx-auto border-t-dark-grey" placeholder="Start typing here to create new task">
          </div>
          <div class="col-md-2 pl-0">
            <button id="addTask${id}" type="button" class="bg-grad-1 border-green-dark text-white font-weight-bold btn-block btn btn-default">Add Task</button>
          </div>
        </div>
        <div id="tasks${id}" class="border border-top-0 bg-white">
        </div>
        <div class="row w-100 mx-auto border-bot-round bg-white">
          <p id="err${id}" class="col text-center my-0 p-1 text-danger"></p>
        </div>
      </div>
    `);
    
    this.regEvents(id);
    this.getTasks(id);
  }

  async getTasks(id) {
    const options = {
      method: "post",
      body: JSON.stringify({todoListId: id}),
      headers: {
        "content-type": "application/json"
      }
    };

    const res = await fetch("/gettasks", options);
    const body = await res.json();
    if (res.status !== 200) throw body;;

    const $tasks = $(`#tasks${id}`);
    body.forEach(t => this.tasks.push(new Task($tasks, t)));
    if (this.tasks.length > 0) 
      this.tasks.forEach((t) => t.mount());
  }

  regEvents(id) {
    $(`#edName${id}`).on("click", () => this.edName(id));
    $(`#iListName${id}`).on("keypress", (e) => {
      if(e.which === 13) // "Enter" key
        this.edName(id);
    });
    $(`#iListName${id}`).focusout(() => this.dbUpdListName(id));

    $(`#trashBtn${id}`).on("click", () => this.dbRemoveList(id));
    $(`#addTask${id}`).on("click", () => this.addTask(id));
    $(`#iNewTask${id}`).on("keypress", (e) => {
      if(e.which === 13) // "Enter" key
        this.addTask(id);
    });
  }

  async addTask(id) {
    const $iNewTask = $(`#iNewTask${id}`);
    const $tasks = $(`#tasks${id}`);
    const taskData = {
      id: new Date().getTime(),
      status: 1,
      name: "",
      todo_list_id: this.data.id,
      priority: 0
    };
    // reset error field
    $(`err${id}`).text();
    
    if ($iNewTask.val().length === 0) 
      $iNewTask.prop("placeholder", "Task description required!"); 
    else {
      taskData.name = $iNewTask.val();
      this.tasks.push(new Task($tasks, taskData));
      this.tasks[this.tasks.length - 1].mount();
      $iNewTask.prop("placeholder", "Start typing here to create new task")
          .val("");
      if (!(await this.dbInsertTask(taskData)))
        $(`err${id}`).text("Database error. Unable to insert task.");
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
      return 1;
    }
    return 0;
  }

  async dbUpdListName(id) {
    const $iListName = $(`#iListName${id}`);
    const listData = {
      id,
      name: $iListName.val()
    };
    const options = {
      method: "post",
      body: JSON.stringify(listData),
      headers: {
        "content-type": "application/json"
      }
    };
    // reset error field
    $(`err${id}`).text();

    $iListName.prop("readonly", true);

    const res = await fetch("/updlistname", options);
    if (res.status !== 200) {
      const err = await res.json();
      $(`err${id}`).text(err.message);
      throw err;
    }
  }

  edName(id) {
    const $iListName = $(`#iListName${id}`);
    // reset error field
    $(`err${id}`).text();

    $iListName.prop("readonly", (i, val) => !val);
    $iListName.is(":focus") ? $iListName.blur(): $iListName.focus();
  }

  unmount() {
    const { id } = this.data;

    $(`#edName${id}`).off();
    $(`#iListName${id}`).off();
    $(`#trashBtn${id}`).off();
    $(`#addTask${id}`).off();
    $(`#iNewTask${id}`).off();

    $(`#todoList${id}`).remove();
  }

  async dbRemoveList(id) {
    const options = {
      method: "post",
      body: JSON.stringify({id}),
      headers: {
        "content-type": "application/json"
      }
    };
    const res = await fetch("/removelist", options);
    // reset error field
    $(`err${id}`).text();

    if (res.status !== 200) {
      const err = await res.json();
      $(`err${id}`).text(err.message);
      throw err;
    }

    this.unmount();
  }
}
