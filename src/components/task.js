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
        <div id="status${id}" class="col-md-1 border-right d-flex align-items-center">
          <i class="far fa-calendar mx-auto font-15 cursor-pointer"></i>
        </div>
        <div class="col-md m-0 border-left border-right overflow-hide d-flex align-items-center">
          <div id="iTaskName${id}" class="w-100 mx-0 break-words">${name}</div>
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

    this.regEvents(id);
    this.setStatus(id);
  }

  regEvents(id) {
    const $prioInc = $(`#prioInc${id}`);
    const $prioDec = $(`#prioDec${id}`);
    const $edTaskName = $(`#edTaskName${id}`);
    const $iTaskName = $(`#iTaskName${id}`);
    const dec = +1;
    const inc = -1;

    $(`#task${id}`).on("mouseenter", () => this.taskBtns(id));
    $(`#task${id}`).on("mouseleave", () => this.taskBtns(id));

    $prioInc.on("click", () => this.data.changePrio(id, inc));

    $prioDec.on("click", () => this.data.changePrio(id, dec));

    $edTaskName.click(() => this.edTaskName(id));

    $iTaskName.focusout(() => this.edTaskName(id));

    $(`#delTask${id}`).on("click", () => this.delTask(id));

    $(`#status${id}`).on("click", () => this.statusToggle(id));
  }

  taskBtns(id) {
    $(`#taskBtns${id}`).find("svg").toggle();
  }

  setStatus(id) {
    if (this.data.status)
      $(`#status${id} i`).toggleClass("fa-calendar fa-calendar-check");
  }

  statusToggle(id) {
    const $status = $(`#status${id} svg`);

    $status.toggleClass("fa-calendar fa-calendar-check");

    this.data.status ? this.data.status = 0: this.data.status = 1;

    this.dbUpdTask(id);
  }

  async dbUpdTask(id) {
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
      this.dbUpdTask(id);
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

    $(`#task${this.data.id}`).remove();
  }
}
