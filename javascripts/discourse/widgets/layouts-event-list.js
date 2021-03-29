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
  // console.log(events);

  let events = eventList.events;

  for (let event of events) {
    console.log(event);
    console.log(`Event ID: ${event.id}`);
    console.log(`Event Name: ${event.name}`);
    console.log(`Event Duration: ${event.starts_at} - ${event.ends_at}`);
    console.log(`Event Topic URL: ${event.post.url}`);

    let inviteeList = event.sample_invitees;
    for (let invited of inviteeList) {
      console.log(`${invited.user.name} is ${invited.status}.`);
    }
  }
});
// !

export default layouts.createLayoutsWidget("event-list", {
  getHello() {
    let { hello } = this.attrs;

    if (!hello) return "Upcoming Events";

    return hello;
  },

  html(attrs) {
    // let { hello } = attrs;
    let myHello = this.getHello();

    return h("h3.event-list-title", myHello);
    // return h("h3.event-list-title", "Upcoming Events");
  },
});

createWidget("layouts-event-link", {
  tagName: "li",
  buildKey: (attrs) => `layouts-event-link-${attrs.event.id}`,

  html(attrs) {
    let contents = [];
    // contents.push(h("div.event-name", events[0]));
  },
});
