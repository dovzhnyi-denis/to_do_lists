import "./root.css";

$().ready( () => {
  let q = `<p id="d1"></p>`;
  let w = `<p class="testing testing1">testing</p>`;
  $("#root").append(w, q);
  $("#d1").text(add(1, 2));
  $(".testing1").removeClass("testing1", "testing");
});
