import Profile from "../src/components/profile";
import List from "../src/components/todoList";
const expect = chai.expect;

export default function todolistTest() {
  describe("to do lists", () => {
    const profile = new Profile($("#root")),
      listData = {
        name: "testList",
        id: 12345
      };
    const { id, name } = listData;

    let todoList;

    beforeEach(() => {
      profile.mount(null, [listData]);
    });

    afterEach(() => {
      profile.toDo.forEach(td => td.unmount(td.data.id));
    });
   
    it("clicking on 'Pen' icon should make list name editable", () => {
      const $iListName = $(`#iListName${id}`);
      $(`#edName${id}`).trigger("click");

      expect($iListName.prop("readonly")).to.be.false;
    });

    it("clicking on 'Trash' icon should remove list", () => {
      $(`#trashBtn${id}`).trigger("click");

      expect($(`#todoList${id}`)[0]).to.be.undefined;
    });

    it("clicking on 'Add Task' button without entering task description should change placeholder text to 'Task description required!'", () => {
      $(`#addTask${id}`).trigger("click");

      expect($(`#iNewTask${id}`).prop("placeholder")).to.equal("Task description required!");
    });

    it("entering text in input field and clicking 'Add Task' should add new task", () => {
      const taskName = "testing";

      $(`#iNewTask${id}`).val(taskName);
      $(`#addTask${id}`).trigger("click");

      expect(profile.toDo[0].tasks[0].data.name).to.equal(taskName);
    });
  });
}
