import List from "../src/components/list";
const expect = chai.expect;

export default function listTest() {
  describe("to do lists", () => {
    const $container = $("#root"),
      listData = {
        name: "iddqd",
        id: 12345
      };
    const { id, name } = listData;

    let todoList;

    beforeEach(() => {
      todoList = new List($container, listData);
      todoList.mount();
    });

    afterEach(() => {
      todoList.unmount();
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
      const task = "testing";

      $(`#iNewTask${id}`).val(task);
      $(`#addTask${id}`).trigger("click");

      expect($(`#tasks${id}`).html().length).to.be.above(0);
    });
  });
}
