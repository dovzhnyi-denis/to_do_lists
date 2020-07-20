export default class Profile {
  constructor($mountContainer = $("body")) {
    this.$container = $mountContainer;    
  }

  mount() {
    this.$container.append(`
      <div id="profile">user profile</div>
    `);
  }
}
