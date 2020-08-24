<h1>To Do Lists</h1>
<p>Simple app to help you get even more organized.</p>

<h3>Installation and running instruction:</h3>
<ul>
  <li>Clone repository with <code style="background:lightgrey">git clone https://github.com/dovzhnyi-denis/to_do_lists.git</code></li>
  <li>Enter project directory;</li>
  <li>Execute commands:
  <ul> 
    <li><code style="background:lightgrey">npm i</code>;</li>
    <li><code style="background:lightgrey">npm run build</code>;</li>
    <li><code style="background:lightgrey">node app.js</code>;</li>
  </ul>
  <li>In browser visit <i>http://localhost:3000</i>;</li>
</ul>

<h3>Tests:</h3>
<ul>
  <li>To run back-end tests execute <code style="background:lightgray">npm test</code>;</li>
  <li>To run front-end test: execute <code style="background:lightgray">npm run build-test</code>, in browser open client-test/test-runner.html;</li>
</ul>

<h3>User stories:</h3>
<ul>
  <li>User can Sign Up/Sign In. When signing up unique name is required;</li>
  <li>User can add new To Do List by clicking "Add TODO List" button. There is no limit on number of lists user can have;</li>
  <li>User can change To Do List name by clicking on "Pen" icon, located to the right of To Do List name;</li>
  <li>User can remove To Do List by clicking on "Trash" icon, located to the right of "Pen" icon;</li>
  <li>User can add new task by typing it's description in input field located under To Do List name, and then clicking "Add Task" located to the right of input field. Task description is required;</li>
  <li>User can mark task as completed by clicking icon to the left of task name/description, visual clue will be provided;</li>
  <li>By hovering mouse over a task, extra buttons will be displayed:</li>
  <ul>
    <li>Arrow keys allow to change task position in the list by moving it up or down;</li>
    <li>Clicking "Pen" icon makes task description editable;</li>
    <li>Clicking "Trash" icon removes task;</li>
  </ul>
  <li>User can set a deadline for each task. Task status will automaticaly update to show if task had reached it's deadline;</li>
  <li>User can move task to a different "To Do List".</li>
</ul>
