import SignForm from "./components/signForm";
import Profile from "./components/profile";
import "./lib/fontawesome-all.min";
import "./root.css";

$().ready(() => {
  const $container = $("#root");
  const signForm = new SignForm($container);
  const profile = new Profile($container);
  $container.addClass=("container-fluid");

  router();

  async function router(){
    const prof = await fetch("/profile");
    if (prof.status === 200) profile.mount(router);
    else signForm.mount(router);
  }
});


