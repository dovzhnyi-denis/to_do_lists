import Profile from "../src/components/profile";
const expect = chai.expect;

export default function profileTest() {
  describe("profile", () => {
    const $container = $("#root"),
      profile = new Profile($container);

    beforeEach(() => {
      profile.mount(null, []);
    });

    afterEach(() => {
      profile.unmount();
    });
   
    it(`clicking "Add TODO List" creates new to do list`, () => {
      const $todoContainer = $("#todoContainer");

      $("#addList").trigger("click");

      expect($todoContainer.html().length).to.be.above(0);
    });
  });
}
