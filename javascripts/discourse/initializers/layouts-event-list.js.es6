import { ajax } from "discourse/lib/ajax";

export default {
  name: "layouts-event-list",

  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
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

    if (layoutsError || !siteSettings.calendar_enabled) return;

    const now = new Date();
    ajax(
      `/discourse-post-event/events.json?after=${now.toISOString()}`
    ).then((eventList) => {
      const events = eventList.events;
      const props = {
        events,
      };
      layouts.addSidebarProps(props);
    });
  },
};
