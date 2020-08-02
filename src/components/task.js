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
        <div id="status" class="col-md-1 border-right d-flex align-items-center">
          <i class="far fa-sticky-note mx-auto font-15"></i>
        </div>
        <div class="col-md border-left border-right ml-1 d-flex align-items-center">
          <p class="my-auto break-words">${name}</p>
        </div>
        <div class="col-1 m-auto d-flex justify-content-center">
          <dov class="d-flex flex-column justify-content-center align-items-center">
            <canvas id="prioInc${id}" class="cursor-pointer" width="14" height="8"></canvas>
            <canvas id="incDecSeparator${id}" width="18" height="6"></canvas>
            <canvas id="prioDec${id}" class="cursor-pointer" width="14" height="8"></canvas>
          </dov>
        </div>
        <div class="col-1 m-auto text-center">
          <i class="fas fa-pen cursor-pointer"></i>
        </div>
        <div class="col-1 m-auto text-center">
          <i class="far fa-trash-alt cursor-pointer"></i> 
        </div>
      </div>
    `);

    this.drawIcons(id);
  }

  drawIcons(id) {
    this.prioInc(id);
    this.prioDec(id);
    this.incDecSeparator(id);
  }

  incDecSeparator(id) {
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

  editProjectName() {
//    const $iProjName = $("#iProjName");
//    $iProjName.prop("readonly", (i, val) => !val);
//    $iProjName.is(":focus") ? $iProjName.blur(): $iProjName.focus();
  }

  unmount() {
//    $("#edProjName").off();
//    $("#iProjName").off();
//    $(".signout").off();
//    $(".pen").off();
//    $(".fa-trash-alt").off();

    $(`#task{this.data.id}`).remove();
  }
}
