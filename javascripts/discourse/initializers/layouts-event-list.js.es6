import { ajax } from "discourse/lib/ajax";

export default {
  name: "layouts-event-list",

  initialize() {
    let layouts;
    let layoutsError;

    // Import layouts plugin with safegaurd for when widget exists without plugin:
    try {
      layouts = requirejs(
        "discourse/plugins/discourse-layouts/discourse/lib/layouts"
      );
    } catch (error) {
      layoutsError = error;
      console.warn(layoutsError);
    }

    if (layoutsError) return;

    // let events = [];

    ajax(`/discourse-post-event/events.json`).then((eventList) => {
      // let eventItems = eventList.events;

      // for (let currentEvent of eventItems) {
      //   events.push(currentEvent);
      // }

      let props = {
        eventList,
      };

      layouts.addSidebarProps(props);
    });

    // let props = {
    //   events,
    // };

    // layouts.addSidebarProps(props);
  },
};
