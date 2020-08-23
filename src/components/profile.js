import todoList from "./todoList";

export default class Profile {
  constructor($container) {
    if (!$container)
      throw new Error(`"$container undefined", nowhere no mount!`);
    else this.$container = $container;
    
    this.toDo = [];

    this.moveTask = (oldListId, newListId, taskId) => {
      const oldList = this.toDo.find(td => td.data.id === oldListId);
      const newList = this.toDo.find(td => td.data.id === newListId);
      const task = oldList.tasks.find(t => t.data.id === taskId);
      
      oldList.tasks = oldList.tasks.filter(t => t.data.id !== taskId);
      newList.tasks.push(task);

      task.$container = $(`#tasks${newListId}`);
      // bind changePrio method to new todo list      
      task.data.changePrio = newList.changePrio;
      // set task priority at the bottom of the new list
      task.data.priority = newList.tasks.length - 1;
      
      task.data.listId = newListId;

      newList.sortTasks();

      oldList.refreshList(oldListId);
      newList.refreshList(newListId);
    };
  }

  mount(router, profData) {
    if (router) this.router = router;
    if (!profData) throw new Error("profData is undefined");
;

    this.$container.html(`
      <div id="profileContainer" class="bg-main-gradient overflow-auto">
        <div class="row">
          <div class="col text-right">
            <span class="tip signout">Sign Out</span>
          </div>
          <div id="signout" class="col-1 text-right">
            <button id="signoutBtn" class="btn btn-dark px-2 py-1" type="button">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
        <div id="todoContainer"></div>
        <div id="addList" class="row mx-auto width-100 bg-secondary mb-3 cursor-pointer">
          <div class="col-xs ml-auto pl-2 pr-1 d-flex align-items-center bg-grad-0">
            <h2 class="my-0 pb-1 pressed-plus font-weight-bold">+</h2>
          </div>
          <div class="col-xs mr-auto pl-1 pr-2 pb-1 d-flex align-items-center bg-grad-0 text-center">
            <h2 class="m-0 pressed-text bg-dark font-10 font-weight-bold">Add TODO List</h2>
          </div>
        </div>
      </div>
    `);
    
    this.showTodoLists(profData);
    this.regEvents();
  }

  regEvents() {
    const $signoutBtn = $("#signoutBtn");
    $(".tip").hide();
    $signoutBtn.on("click", () => this.signout());
    $signoutBtn.hover(() => $(".signout").toggle());

    $("#addList").on("click", () => this.addTodo());
  }
  
  showTodoLists(profData) {
    const $todo = $("#todoContainer");

    profData.forEach(td => {
      // add method references to each todo list object here
      td.moveTask = this.moveTask;

      this.toDo.push(new todoList($todo, td));
    });

    this.toDo.forEach(td => td.mount());
  }

  async addTodo() {
    const $todo = $("#todoContainer");
    const listData = {
      name: "Things To Do",
      id: new Date().getTime(),
    };

    this.toDo.push(new todoList($todo, listData));
    this.toDo[this.toDo.length - 1].mount();

    const options = {
      method: "post",
      body: JSON.stringify(listData),
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await fetch("/insertlist", options);
    if (res.status !== 201) {
      const err = await res.json();
      throw err;
    }
  }

  async signout() {
    const res = await fetch("/signout");
    if (res.status === 200) this.unmount();
    else this.$container.text("error");
  }

  editProjectName() {
    const $iProjName = $("#iProjName");
    $iProjName.prop("readonly", (i, val) => !val);
    $iProjName.is(":focus") ? $iProjName.blur(): $iProjName.focus();
  }

  unmount() {
    $("#signoutBtn").off();

    $("#profileContainer").remove();
    if (this.router) this.router();
  }
}
