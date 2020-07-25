import Profile from "../src/components/profile";
const expect = chai.expect;

export default function profileTest() {
  describe("profile", () => {
    const $container = $("#root"),
      profile = new Profile($container);
    let $edProjName,
      $iProjName;

    beforeEach(() => {
      profile.mount();
      
      $edProjName = $("#edProjName");
      $iProjName = $("#iProjName");
    });

    afterEach(() => {
      profile.unmount();
    });
   
    it("it should be possible to edit and set project name", () => {
      const e = $.Event("keypress");
      e.which = 13;

      v$edProjName.trigger("click");
      expect($iProjName.prop("readonly")).to.be.false;
      expect($iProjName.is(":focus")).to.be.true;
// pressing "enter" in input field should set it's "readonly" property to true
      $iProjName.trigger(e);
      expect($iProjName.prop("readonly")).to.be.true;
      expect($iProjName.is(":focus")).to.be.false;
// clicking "pen" icon should toggle "#iProjName" input field's "readonly" attribute between true and false
      v$edProjName.trigger("click");
      expect($iProjName.prop("readonly")).to.be.false;
      expect($iProjName.is(":focus")).to.be.true;

      v$edProjName.trigger("click");
      expect($iProjName.prop("readonly")).to.be.true;
      expect($iProjName.is(":focus")).to.be.false;

    });
  });
}
