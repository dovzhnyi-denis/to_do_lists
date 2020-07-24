export default class Profile {
  constructor($mountContainer = $("body")) {
    this.$container = $mountContainer;    
  }

  mount(router) {
    if (router) this.router = router;

    this.$container.html(`
      <div id="profileContainer" class="card bg-main-gradient">
        <div id="signout" class="position-fixed" style="top:1rem;right:1rem;">
          <button id="signoutBtn" class="btn btn-dark px-2 py-1" type="button">
            <i class="fas fa-sign-out-alt"></i>
          </button>
          <div id="signout-tip">Sign Out</div>
        </div>
        <div class="m-auto w-100 d-flex justify-content-center">
          <div class="row w-75 bg-primary p-2 d-flex align-items-center project-bar-bg font-lg">
            <div class="col-md-2 d-flex justify-content-center">
              <i class="fas fa-clipboard-list" style="font-size:2rem;"></i>
            </div>
            <div class="col-md-8 d-flex justify-content-start">
              <input id="projectName" class="text-white my-auto" type="text" readonly value="Project Name" style="background-color:transparent;border-color:transparent">
            </div>
            <div id="edProjName" class="col-md-1">
              <i  class="fas fa-pen m-auto text-center" style="cursor:pointer"></i>
            </div>
            <div class="col-md-1">
              <i class="far fa-trash-alt m-auto text-center"></i>
            </div>
          </div>
      </div>
    `);

    $("#signoutBtn").on("click", () => {
    this.signout();
    });
    
    $("#edProjName").on("click", () => this.editProjectName());
   }

  async signout() {
    const res = await fetch("/signout");
    if (res.status === 200) this.unmount();
    else this.$container.text("error");
  }

  editProjectName() {
    const $projName = $("#projectName");
    $projName.prop("readonly", (i, val) => !val).focus();
  }

  unmount() {
    $("#signoutBtn").off("click");
    $("#edProjName").off("click");

    this.$container.html("");
    if (this.router) this.router();
  }
}
