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

export default layouts.createLayoutsWidget("event-list", {
  html(attrs) {
    let { eventList } = this.attrs;

    if (!eventList) return console.warn("There are no events");

    // console.log(JSON.stringify(events));
    // console.log(typeof events);

    console.log(eventList);
    let content = [];
    for (let events of eventList.events) {
      content.push(h("p", events.name));
    }

    return content;

    return h("h3.event-list-title", "Upcoming Events");
  },
});

createWidget("layouts-event-link", {
  tagName: "li",
  buildKey: (attrs) => `layouts-event-link-${attrs.event.id}`,

  html(attrs) {
    // let contents = [];
    // contents.push(h("div.event-name", events[0]));
  },
});
