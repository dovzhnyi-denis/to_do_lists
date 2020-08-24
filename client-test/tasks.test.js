import Profile from "../src/components/profile";
import List from "../src/components/todoList";
const expect = chai.expect;

export default function tasksTest() {
  describe("tasks", () => {
    const $profCont = $("#root");
    const profile = new Profile($profCont);


    const $container = $("#todoContainer"),
      listData = {
        name: "testList",
        id: 12345
      };
    const list1Id = listData.id,
      task1Name = "task1",
      task2Name = "task2";

    let todoList;

    beforeEach(() => {
      profile.mount(null, [listData]);

      $(`#iNewTask${list1Id}`).val(task1Name);
      $(`#addTask${list1Id}`).trigger("click");
    });

    afterEach(() => {
      profile.toDo.forEach(td => td.unmount());
      profile.unmount();
    });
 
    it("hovering mouse over task line should make task buttons visible (priority arrows, pen, trash bin)", () => {
      const taskId = profile.toDo[0].tasks[0].data.id;
      const $taskBtns = $(`#taskBtns${taskId}`).find("svg");

      $(`#task${taskId}`).trigger("mouseover");

      for (let btn of $taskBtns) {
        expect(btn.style.display).to.not.equal("none");
      };
    });

    it("clicking arrow up should move task position up in the task list", () => {
      $(`#iNewTask${list1Id}`).val(task2Name);
      $(`#addTask${list1Id}`).trigger("click");

      const task2Id = profile.toDo[0].tasks[1].data.id;

      $(`#prioInc${task2Id}`).trigger("click");

      expect(profile.toDo[0].tasks[0].data.id).to.equal(task2Id);
    });

    it("clicking arrow down should move task position down in the task list", () => {
      $(`#iNewTask${list1Id}`).val(task2Name);
      $(`#addTask${list1Id}`).trigger("click");

      const task1Id = profile.toDo[0].tasks[0].data.id;

      $(`#prioDec${task1Id}`).trigger("click");

      expect(profile.toDo[0].tasks[1].data.id).to.equal(task1Id);
    });

    it("clicking on pen button should make task name editable", () => {

      const taskId = profile.toDo[0].tasks[0].data.id;

      $(`#edTaskName${taskId}`).trigger("click");

      expect($(`#iTaskName${taskId}`).attr("contenteditable")).to.equal("true");
    });

    it("clicking on trash bin button should remove task", () => {
      const taskId = profile.toDo[0].tasks[0].data.id;

      $(`#delTask${taskId}`).trigger("click");

      expect($(`#task${taskId}`).length).to.equal(0);
      expect(profile.toDo[0].tasks.length).to.equal(0);
    });

    it("clicking on status icon should toggle status", () => { 
      const taskId = profile.toDo[0].tasks[0].data.id;

      $(`#status${taskId}`).trigger("click");

      expect(profile.toDo[0].tasks[0].data.status).to.equal(1);
    });

    it("tasks can be moved between lists", () => {
      $("#addList").trigger("click");
      const list2Id = profile.toDo[1].data.id;

      const taskId = profile.toDo[0].tasks[0].data.id;
      $(`#changeList${taskId}`).css("display", "none");

      $(`#changeListBtn${taskId}`).trigger("click");
      $(`#moveToList${list2Id}`).trigger("click");
      expect(profile.toDo[1].tasks[0].data.listId).to.equal(list2Id);
    });

    it("task status should change to finished if current date is past deadline", () => {
      const taskId = profile.toDo[0].tasks[0].data.id;

      $(`#deadline${taskId}`)[0].valueAsDate = new Date();
      $(`#deadline${taskId}`).trigger("change");

      expect(profile.toDo[0].tasks[0].data.status).to.equal(1);
    });
  });
}
