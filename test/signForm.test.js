import rndStr from "../src/rnd_uft8_str";
import SignForm from "../src/components/signForm";
import Profile from "../src/components/profile";
const expect = chai.expect;

export default function signFormTest() {
  describe("sign form", () => {
    const name = rndStr(10), // generate 10 characters long random string
      pass = rndStr(3), // generate 3 characters long random string
      $container = $("#root"),
      signForm = new SignForm($container),
      profile = new Profile($container);
    let $toggleBtn,
      $signin,
      $signup,
      $confPass,
      $uName,
      $pass,
      $cPass,
      $err;

    $container.hide();

    beforeEach(() => {
      signForm.mount();

      $toggleBtn = $("#toggleBtn"),
      $signin = $("#signinBtn"),
      $signup = $("#signupBtn"),
      $confPass = $("#confirmPass"),
      $uName = $("#userName"),
      $pass = $("#pass"),
      $cPass = $("#confirmPass"),
      $err = $("#error");
    });

    afterEach(() => {
      // unmount currently mounted component
      if ($("#profileContainer").html()) 
        profile.unmount();
      else if ($("#formContainer").html())
        signForm.unmount();
    });
    
    it("toggle button should switch between sign up and sign in forms", () => {
      expect($toggleBtn.text()).to.equal("Sign Up");
      expect($signin.prop("class")).to.equal("btn btn-primary");
      expect($signup.prop("class")).to.equal("d-none btn btn-primary");
      expect($confPass.prop("class")).to.equal("row d-none justify-content-center");

      $("#toggleBtn").trigger("click");

      expect($toggleBtn.text()).to.equal("Sign In"); 
      expect($signin.prop("class")).to.equal("btn btn-primary d-none");
      expect($signup.prop("class")).to.equal("btn btn-primary");
      expect($confPass.prop("class")).to.equal("row justify-content-center");
    });

    it("sign up form should produce an error if one or more fields are empty", () => {
      const eqStr = "All fields required.";

      function iFieldTest($field) {
        $field.val(name);
        $signup.trigger("click");
        expect($err.text()).to.equal(eqStr);
        $field.val("");
      }

      iFieldTest($uName);
      iFieldTest($pass);
      iFieldTest($cPass);
    });

    it("not matching passwords should produce an error", () => {
      $uName.val(name);
      $pass.val(pass);
      $cPass.val(`${pass}q`);
      $signup.trigger("click");

      expect($err.text()).to.equal("Passwords do not match.");
    });

    it("during sign in/sign up names and passwords exceeding 20 characters should produce an error", () => {
      const eqStr = "Name/password should be 20 characters long or less.";

      function testIFields(signup) {
        if (signup === 1) $signup.trigger("click");
        else $signin.trigger("click");
        expect($err.text()).to.equal(eqStr);
        $err.text("");
        $uName.val("");
        $pass.val("");
        $cPass.val("");
      }

      $uName.val(`${name}${name}1`);
      $pass.val(pass);
      $cPass.val(pass);
      testIFields(1);

      $uName.val(pass);
      $pass.val(`${name}${name}1`);
      $cPass.val(`${name}${name}1`);
      testIFields(1);

      $uName.val(`${name}${name}1`);
      $pass.val(pass);
      testIFields(0);

      $uName.val(pass);
      $pass.val(`${name}${name}1`);
      testIFields(0);
    });
    
    it("it should be possible to register a new user", () => {
      $uName.val(name);
      $pass.val(pass);
      $cPass.val(pass);
      $signup.trigger("click");

      setTimeout(() => { 
        expect($("#profileContainer").html()).to.be.true;
        // implicit test of sign out
        profile.signout();
      }, 2000);


    });

    it("it should be possible to sign in with existing account", () => {
      $uName.val(name);
      $pass.val(pass);
      $signin.trigger("click");

      setTimeout(() => { 
        expect($("#profileContainer").html()).to.be.true;
        // implicit test of sign out
        profile.signout();
      }, 2000);
    });
  });
}
