export default class Task {
  constructor($container, taskData) {
    if (!$container)
      throw new Error(`"$container undefined", nowhere no mount!`);
    else this.$container = $container;
    this.data = taskData;
    console.dir(this.data);
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
        <div class="col-1 m-auto d-flex justify-content-center">
          <dov class="d-flex flex-column justify-content-center align-items-center">
            <canvas id="prioInc${id}" class="prio cursor-pointer" width="14" height="8"></canvas>
            <canvas id="incDecSeparator${id}" width="18" height="6"></canvas>
            <canvas id="prioDec${id}" class="prio cursor-pointer" width="14" height="8"></canvas>
          </dov>
        </div>
        <div id="edTaskName${id}" class="col-1 m-auto text-center">
          <i class="fas fa-pen cursor-pointer"></i>
        </div>
        <div id="delTask${id}" class="col-1 m-auto text-center">
          <i class="far fa-trash-alt cursor-pointer"></i> 
        </div>
      </div>
    `);

    if (this.data.status)
      $(`#status${id} i`).toggleClass("fa-calendar fa-calendar-check");

    this.regEvents(id);
    this.drawIcons(id);
  }

  regEvents(id) {
    const $prioInc = $(`#prioInc${id}`);
    const $prioDec = $(`#prioDec${id}`);
    const $edTaskName = $(`#edTaskName${id}`);
    const $iTaskName = $(`#iTaskName${id}`);
    const dec = +1;
    const inc = -1;

    $prioInc.on("mouseenter", () => this.prioIncHover(id));
    $prioInc.on("mouseleave", () => this.prioInc(id));
    $prioInc.on("click", () => this.data.changePrio(id, inc));

    $prioDec.on("mouseenter", () => this.prioDecHover(id));
    $prioDec.on("mouseleave", () => this.prioDec(id));
    $prioDec.on("click", () => this.data.changePrio(id, dec));

    $edTaskName.click(() => this.edTaskName(id));

    $iTaskName.focusout(() => this.edTaskName(id));

    $(`#delTask${id}`).on("click", () => this.delTask(id));

    $(`#status${id}`).on("click", () => this.statusToggle(id));
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
      body: JSON.stringify({id}),
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

  drawIcons(id) {
    this.prioInc(id);
    this.prioDec(id);
    this.prioBtnSeparator(id);
  }

  prioBtnSeparator(id) {
    const ctx = document.querySelector(`#incDecSeparator${id}`).getContext("2d");

    ctx.moveTo(0,3);
    ctx.lineTo(18,3);

    ctx.strokeStyle = "#6c757d";
    ctx.stroke();
  }

  prioDec(id) {
    const ctx = document.querySelector(`#prioDec${id}`).getContext("2d");

    ctx.moveTo(0,0);
    ctx.lineTo(7,8);
    ctx.lineTo(14,0);
    ctx.closePath();

    ctx.strokeStyle = "transparent";
    ctx.stroke();

    ctx.fillStyle = "#6c757d";
    ctx.fill();
  }

  prioInc(id) {
    const ctx = document.querySelector(`#prioInc${id}`).getContext("2d");
    ctx.moveTo(0,8);
    ctx.lineTo(7,0);
    ctx.lineTo(14,8);
    ctx.closePath();

    ctx.strokeStyle = "transparent";
    ctx.stroke();

    ctx.fillStyle = "#6c757d";
    ctx.fill();
  }

  prioDecHover(id) {
    const ctx = document.querySelector(`#prioDec${id}`).getContext("2d");

    ctx.moveTo(0,0);
    ctx.lineTo(7,8);
    ctx.lineTo(14,0);
    ctx.closePath();

    ctx.strokeStyle = "transparent";
    ctx.stroke();

    ctx.fillStyle = "#1ecbe1";
    ctx.fill();
  }

  prioIncHover(id) {
    const ctx = document.querySelector(`#prioInc${id}`).getContext("2d");
    ctx.moveTo(0,8);
    ctx.lineTo(7,0);
    ctx.lineTo(14,8);
    ctx.closePath();

    ctx.strokeStyle = "transparent";
    ctx.stroke();

    ctx.fillStyle = "#1ecbe1";
    ctx.fill();
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
