import { createWidget } from "discourse/widgets/widget";
import { ajax } from "discourse/lib/ajax";

let layouts;

// Import layouts plugin with safegaurd for when widget exists without plugin:
try {
  layouts = requirejs(
    "discourse/plugins/discourse-layouts/discourse/lib/layouts"
  );
} catch (error) {
  layouts = { createLayoutsWidget: createWidget };
  console.warn(error);
}

// ! TEMP for testing, remove later/move to initializer:
ajax(`/discourse-post-event/events.json`).then(function (result) {
  var eventArray = result;
  console.log(eventArray);

  for (var i = 0; i < eventArray.events.length; i++) {
    var event = eventArray.events[i];
    console.log("Event + " + event.id + " Below:");
    console.log("Title " + event.name);
    console.log("Start Date " + event.starts_at);
    console.log("End Date " + event.ends_at);
  }
});

// !

export default layouts.createLayoutsWidget("event-list", {});

createWidget("layouts-event-link", {
  tagName: "li",
  buildKey: (attrs) => `layouts-event-link-${attrs.event.id}`,
});
