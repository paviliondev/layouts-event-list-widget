import { ajax } from "discourse/lib/ajax";
import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";

let layouts;

// Import layouts plugin with safegaurd for when widget exists without plugin:
// TODO: Add check for discourse-calendar plugin?
try {
  layouts = requirejs(
    "discourse/plugins/discourse-layouts/discourse/lib/layouts"
  );
} catch (error) {
  layouts = { createLayoutsWidget: createWidget };
  console.warn(error);
}

// ! TEMP for testing, remove later/move to initializer:

ajax(`/discourse-post-event/events.json`).then((eventList) => {
  // Log entire events object
  let events = eventList.events;

  for (let event of events) {
    console.log(event);
    console.log(`Event ID: ${event.id}`);
    console.log(`Event ID: ${event.name}`);
    console.log(`Event ID: ${event.starts_at}`);
    console.log(`Event ID: ${event.ends_at}`);
    console.log(`Event ID: ${event.post.url}`);

    let inviteeList = event.sample_invitees;

    for (let invited of inviteeList) {
      console.log(`${invited.user.name} is ${invited.status}.`);
    }
  }
});

// !

export default layouts.createLayoutsWidget("event-list", {
  html() {
    return h("h3.", "Upcoming Events");
  },
});

createWidget("layouts-event-link", {
  tagName: "li",
  buildKey: (attrs) => `layouts-event-link-${attrs.event.id}`,
});
