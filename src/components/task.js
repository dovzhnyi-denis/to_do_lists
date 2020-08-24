export default class Task {
  constructor($container, taskData) {
    if (!$container)
      throw new Error(`"$container undefined", nowhere no mount!`);
    else this.$container = $container;
    this.data = taskData;
  }

  mount() {
    const {
      id,
      name
    } = this.data;

    this.$container.append(`
      <div id="task${id}" class="row m-auto border-top">
        <div class="col-md-1 border-right d-flex justify-content-between align-items-center">
          <svg id="changeListBtn${id}" class="bg-light-blue-1 border-dark-blue cursor-pointer" width="20" height="24" >
            <path class="ico-fill-white" d="M12 2 L4 12 L12 20"/>
          </svg>
          <ul id="changeList${id}" class="p-1 text-white font-7 drop-left-items bg-dark-blue-1 display-no">
          </ul>
          <div id="status${id}">
            <i class="far fa-calendar mx-auto font-15 cursor-pointer"></i>
          </div>
        </div>
        <div class="col-md m-0 border-left border-right overflow-hide d-flex align-items-center">
          <div id="iTaskName${id}" class="w-100 mx-0 break-words">${name}</div>
        </div>
        <div class="col-md-2 m-auto text-center border-right bg-transp">
          <div class="d-flex flex-column justify-content-center align-content-center">
            <input id="deadline${id}" class="h-75 w-100 no-border bg-transparent text-center date" type="date">
          </div>
        </div>
        <div id="taskBtns${id}" class="col-md-3 m-auto d-flex justify-content-center">
        <div class="m-auto d-flex justify-content-center">
          <dov class="d-flex flex-column justify-content-center align-items-center">

            <svg id="prioInc${id}" height="8" width="14">
              <polygon class="ico-fill-darkgray cursor-pointer" points="0,8 7,0, 14,8"/>
            </svg>
            <svg height="6" width="18">
              <polygon points="0,3 18,3" style="stroke:#6c757d;stroke-width:1;"/>
            </svg>
            <svg id="prioDec${id}" height="8" width="14">
              <polygon class="ico-fill-darkgray cursor-pointer" points="0,0 7,8, 14,0"/>
            </svg>
          </dov>
        </div>
        <div>
          <svg height="14" width="6">
            <polygon points="3,0 3,14" style="stroke:#6c757d;stroke-width:1;"/>
          </svg>
        </div>
        <div id="edTaskName${id}" class="m-auto text-center">
          <i class="fas fa-pen cursor-pointer"></i>
        </div>
        <div>
          <svg height="14" width="6">
            <polygon points="3,0 3,14" style="stroke:#6c757d;stroke-width:1;"/>
          </svg>
        </div>
        <div id="delTask${id}" class="m-auto text-center">
          <i class="far fa-trash-alt cursor-pointer"></i> 
        </div>
        </div>
      </div>
    `);

    $(`#taskBtns${id}`).find("svg").toggle(); 
    $(`#taskBtns${id}`).find("i").toggle();

    this.init(id);
    this.regEvents(id);
  }

  regEvents(id) {
    const dec = +1;
    const inc = -1;

    $(`#task${id}`).on("mouseenter", () => this.taskBtns(id));
    $(`#task${id}`).on("mouseleave", () => this.taskBtns(id));

    $(`#prioInc${id}`).on("click", () => this.data.changePrio(id, inc));

    $(`#prioDec${id}`).on("click", () => this.data.changePrio(id, dec));

    $(`#edTaskName${id}`).click(() => this.edTaskName(id));

    $(`#iTaskName${id}`).focusout(() => this.edTaskName(id));

    $(`#delTask${id}`).on("click", () => this.delTask(id));

    $(`#status${id}`).on("click", () => this.statusToggle(id));

    $(`#deadline${id}`).on("change", () => this.deadline(id));

    $(`#changeListBtn${id}`).on("click", () => this.showChangeList(id));
    $(`#changeList${id}`).on("mouseleave", () => this.hideChangeList(id));
  }

  showChangeList(taskId) {
    const $changeList = $(`#changeList${taskId}`);

    if ($changeList.css("display") === "block") {
      this.hideChangeList(taskId);
      return;
    }

    const $todoLists = $(`#todoContainer`).children();

    for (let t of $todoLists) {
      const listId = +t.attributes.id.nodeValue.match(/\d+/g)[0];
      const listName = $(`#iListName${listId}`).val();

      $changeList.append(`<li id="moveToList${listId}" class="text-truncate cursor-pointer">${listName}</li>`);
      // register event for each <li> element
      $(`#moveToList${listId}`).on("click", () => {
        let oldListId = this.data.listId;

        this.data.moveTask(oldListId, listId, taskId);

        this.updTask(taskId);
      });
    }

    $changeList.show(); 
  }

  hideChangeList(id) {
    const $changeList = $(`#changeList${id}`);

    $changeList.hide();
    // if $changeList container isn't empty, unregister events and remove children
    if ($changeList.children().length > 0) {
      for (let t of $changeList.children()) {
        const id = t.attributes.id.nodeValue.match(/\d+/g)[0];
        const $moveToList = $(`#moveToList${id}`);
        
        $moveToList.off();
        $moveToList.remove();
      }
    }
  }

  deadline(id) {
    this.data.deadline = $(`#deadline${id}`).val();
    // if current date had reached or passed deadline - set task status as completed
    const deadline = new Date(this.data.deadline).getTime();
    const curDate = new Date().getTime();
    if (curDate >= deadline) {
      this.data.status = 1;
      $(`#status${id} svg`).removeClass("fa-calendar")
        .addClass("fa-calendar-check");
    } else {
      this.data.status = 0;
      $(`#status${id} svg`).removeClass("fa-calendar-check")
        .addClass("fa-calendar");
    }
    this.updTask(id);
  }

  taskBtns(id) {
    $(`#taskBtns${id}`).find("svg").toggle();
  }

  init(id) {
    if (this.data.deadline)
      $(`#deadline${id}`).val(this.data.deadline);
    if (this.data.status)
      $(`#status${id} i`).toggleClass("fa-calendar fa-calendar-check");
  }

  statusToggle(id) {
    const $status = $(`#status${id} svg`);

    $status.toggleClass("fa-calendar fa-calendar-check");

    this.data.status ? this.data.status = 0: this.data.status = 1;

    this.updTask(id);
  }

  async updTask(id) {
    const $iTaskName = $(`#iTaskName${id}`);
    this.data.name = $iTaskName.text();
    const taskData = this.data;
    const options = {
      method: "post",
      body: JSON.stringify(taskData),
      headers: {
        "content-type": "application/json"
      }
    };

    const res = await fetch("/updtask", options);
    if (res.status !== 200) {
      const err = await res.json();
      throw err;
    }
  }

  async delTask(id) {
    const options = {
      method: "post",
      body: JSON.stringify({taskId: id}),
      headers: {
        "content-type": "application/json"
      }
    };

    this.unmount();

    const res = await fetch("/removetask", options);

    if (res.status !== 200) {
      const err = await res.json();
      throw err;
    }
  }

  edTaskName(id) {
    const $iTaskName = $(`#iTaskName${id}`);
    if ($iTaskName[0].attributes.contenteditable) {
      $iTaskName.removeAttr("contenteditable");
      this.updTask(id);
    } else {
      $iTaskName.prop("contenteditable", true);
      $iTaskName.focus();
    }
  }

  unmount() {
    const { id } = this.data;

    $(`#prioInc${id}`).off();
    $(`#prioDec${id}`).off();
    $(`#edTaskName${id}`).off();
    $(`#iTaskName${id}`).off();
    $(`#delTask${id}`).off();
    $(`#status${id}`).off();
    $(`#deadline${id}`).off();
    $(`#changeListBtn${id}`).off();
    $(`#changeList${id}`).off();

    $(`#task${this.data.id}`).remove();
    this.data.todoDelTask(id);
  }
}
