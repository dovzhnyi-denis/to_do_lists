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
        <div id="status" class="col-md-1 text-center border-right d-flex align-items-center">
          <i class="far fa-sticky-note font-15"></i>
        </div>
        <div class="col-md border-left border-right ml-1 d-flex align-items-center">
          <p class="my-auto break-words">${name}</p>
        </div>
        <div class="col-1 d-flex justify-content-center">
          <dov class="d-flex flex-column justify-content-center align-items-center">
            <i class="fas fa-sort-up font-15 text-secondary cursor-pointer"></i>
            <img src="https://img.icons8.com/office/16/000000/horizontal-line.png"/>
            <i class="fas fa-sort-down font-15 text-secondary cursor-pointer"></i>
          </dov>
        </div>
        <div class="col-1 my-auto text-center">
          <i class="fas fa-pen cursor-pointer"></i>
        </div>
        <div class="col-1 my-auto text-center">
          <i class="far fa-trash-alt cursor-pointer"></i> 
        </div>
      </div>
    `);

//    $("#edProjName").on("click", () => this.editProjectName());
//
//    $("#trashBtn").on("click", () => this.unmount());
//
//    $("#iProjName").on("keypress", (e) => {
//      if(e.which === 13) // "Enter" key
//        $("#iProjName").prop("readonly", (i, val) => !val).blur();
//    });

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
