import SignForm from "./components/signForm";
import Profile from "./components/profile";
import "./lib/fontawesome-all.min";
import "./root.css";

$().ready(async () => {
  try {
  const $container = $("#root");
  const signForm = new SignForm($container);
  const profile = new Profile($container);
  $container.addClass=("container-fluid");

  router();
 
  async function router() {
    // check if user is signed in, display profile if true, otherwise display sign in/up form
    const res = await fetch("/profile");
    if (res.status === 200) {
      const profData = await res.json();
      profile.mount(router, profData);
    }
    else signForm.mount(router);
  }
  } catch (err) {
      console.log(err);
  }
});
