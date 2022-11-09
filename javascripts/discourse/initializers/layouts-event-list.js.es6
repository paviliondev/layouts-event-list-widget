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

    ajax(`/discourse-post-event/events.json`).then((eventList) => {
      let events = eventList.events;

      // See further https://discourse.pluginmanager.org/t/580
      if (events && events.length) {
        events = events.filter((event) => {
          return (new Date(event.starts_at)).getTime() > Date.now();
        });
      }

      const props = {
        events,
      };
      layouts.addSidebarProps(props);
    });
  },
};
