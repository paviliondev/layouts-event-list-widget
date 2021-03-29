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

    let events = [];
    let hello = "Hello World!";

    ajax(`/discourse-post-event/events.json`).then((eventList) => {
      events.push(eventList.events);
    });

    let props = {
      events,
      hello,
    };

    layouts.addSidebarProps(props);
  },
};
