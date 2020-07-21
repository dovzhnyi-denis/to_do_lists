export default class SignForm {
  constructor($mountContainer = $("body")){
    this.$container = $mountContainer;
  }

  mount(router) {
    if (router) this.router = router;

    this.$container.append(`
      <div id="formContainer" class="card bg-main-gradient">
        <form class="w-50 mx-auto" style="margin-top: 30vh;">
          <div class="row">
            <div class="col text-center">
              <button id="toggleBtn" type="button" class="btn bg-info float-right">Sign Up</button>
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            <div class="col-sm-6 p-3">
              <input id="userName" type="text" class="form-control" placeholder="User name">
            </div>
          </div>
          <div class="row d-flex justify-content-center">
            <div class="col-sm-6 p-3">
              <input id="pass" type="text" class="form-control" placeholder="Password">
            </div>
          </div>
          <div id="confirmPass" class="row d-none justify-content-center">
            <div class="col-sm-6 p-3">
              <input id="passCheck" type="text" class="form-control" placeholder="Confirm pass">
            </div>
          </div>
          <div class="row text-center">
            <div class="col-sm-6 m-auto">
              <button id="signinBtn" type="button" class="btn btn-primary">Sign In</button>
              <button id="signupBtn" type="button" class="d-none btn btn-primary">Sign Up</button>
            </div>
          </div>
          <div class="row text-center mt-2">
            <div class="col-sm-6 m-auto">
              <h3 id="error" class="text-danger" hidden>Error</h3>
            </div>
          </div>
        </form>
      </div>
     `);

    $("#toggleBtn").on("click", () => {
    this.toggleForm();
    });
 
    $("#signupBtn").on("click", () => {
    this.signUp();
    });

    $("#signinBtn").on("click", () => {
    this.signIn();
    });
  }

  toggleForm() {
    const $toggleBtn = $("#toggleBtn");
    const $signinBtn= $("#signinBtn");
    const $signupBtn= $("#signupBtn");
    const $confPass = $("#confirmPass");
    const signup = "Sign Up";
    const signin = "Sign In";

    $("#error").prop("hidden", true);

    if ($toggleBtn.text() === "Sign Up") {
      $toggleBtn.text(signin);
      $signinBtn.toggleClass("d-none");
      $signupBtn.toggleClass("d-none");
      $confPass.toggleClass("d-none");
    } else {
      $toggleBtn.text(signup);
      $signinBtn.toggleClass("d-none");
      $signupBtn.toggleClass("d-none");
      $confPass.toggleClass("d-none");
    }
  }

  async signUp() {
    const $userName = $("#userName");
    const $pass = $("#pass");
    const $passCheck = $("#passCheck");
    const $err = $("#error");

    if ($userName.val().length === 0 || $pass.val().length === 0 ||
      $passCheck.val().length === 0) {
      $err.prop("hidden", false).text("All fields required.");
    } else if ($userName.val().length > 20 || $pass.val().length > 20) {
      $err.prop("hidden", false)
          .text("Name/password should be 20 characters long or less.");
    } else if ($pass.val() !== $passCheck.val()) {
      $err.prop("hidden", false)
          .text("Passwords do not match."); 
    } else {
      const userData = {
        name: $userName.val(),
        pass: $pass.val()
      };
      const options = {
        method: "post",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json"
        }
      };

      const res = await fetch("/signup", options);
      const body = await res.json();
      let err = "Server error";

      if (res.status === 201) {
        return this.unmount(body.message);
      } 
      if (res.status === 409) {
        err = "User already exist";
      }
      $err.prop("hidden", false)
        .text(err);
    }
  }

  async signIn() {
    const $userName = $("#userName");
    const $pass = $("#pass");
    const $err = $("#error");
    // validate user input
    if ($userName.val().length === 0 || $pass.val().length === 0) {
      $err.prop("hidden", false).text("All fields required.");
    } else if ($userName.val().length > 20 || $pass.val().length > 20) {
      $err.prop("hidden", false)
          .text("Name/password should be 20 characters long or less.");
    } else {
      const userData = {
        name: $userName.val(),
        pass: $pass.val()
      };
      const options = {
        method: "post",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json"
        }
      };

      const res = await fetch("/signin", options);
      const body = await res.json();
      
      if (res.status === 200) {
        return this.unmount();
      } else {
        $err.prop("hidden", false)
          .text(body.message);
      }
    }
  }

  unmount() {
    $("#toggleBtn").unbind("click", this.toggleForm);
    $("#signinBtn").unbind("click", this.signIn);
    $("#signupBtn").unbind("click", this.signUp);

    this.$container.text("");
    if (this.router) this.router();
  }
}
