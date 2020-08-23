import List from "../src/components/todoList";
const expect = chai.expect;

export default function tasksTest() {
  describe("tasks", () => {
    const $container = $("#root"),
      listData = {
        name: "testList",
        id: 12345
      };
    const { id, name } = listData,
      taskName1 = "task1",
      taskName2 = "task2";

    let todoList;

    beforeEach(() => {
      todoList = new List($container, listData);
      todoList.mount();
    });

    afterEach(() => {
      todoList.unmount();
    });
 
    it("hovering mouse over task line should make task icons visible (priority arrows, pen, trash bin)", () => {
      $(`#iNewTask${id}`).val(taskName1);
      $(`#addTask${id}`).trigger("click");

      $(`#iNewTask${id}`).val(taskName2);
      $(`#addTask${id}`).trigger("click");

      const task1Id = todoList.tasks[0].data.id;

      $(`#prioDec${task1Id}`).trigger("click");

      expect(todoList.tasks[1].data.id).to.equal(task1Id);
    });

    it("clicking arrow up should move task position up in the task list", () => {
      $(`#iNewTask${id}`).val(taskName1);
      $(`#addTask${id}`).trigger("click");

      $(`#iNewTask${id}`).val(taskName2);
      $(`#addTask${id}`).trigger("click");

      const task2Id = todoList.tasks[1].data.id;

      $(`#prioInc${task2Id}`).trigger("click");

      expect(todoList.tasks[0].data.id).to.equal(task2Id);
    });

    it("clicking arrow down should move task position down in the task list", () => {
      $(`#iNewTask${id}`).val(taskName1);
      $(`#addTask${id}`).trigger("click");

      $(`#iNewTask${id}`).val(taskName2);
      $(`#addTask${id}`).trigger("click");

      const task1Id = todoList.tasks[0].data.id;

      $(`#prioDec${task1Id}`).trigger("click");

      expect(todoList.tasks[1].data.id).to.equal(task1Id);
    });

//    it("clicking arrow down should move task position down in the task list", () => {
//      $(`#iNewTask${id}`).val(taskName1);
//      $(`#addTask${id}`).trigger("click");
//
//      $(`#iNewTask${id}`).val(taskName2);
//      $(`#addTask${id}`).trigger("click");
//
//      const task1Id = todoList.tasks[0].data.id;
//
//      $(`#prioDec${task1Id}`).trigger("click");
//
//      expect(todoList.tasks[1].data.id).to.equal(task1Id);
//    });
  });
}
