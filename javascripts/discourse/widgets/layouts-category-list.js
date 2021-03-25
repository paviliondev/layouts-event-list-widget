import { createWidget } from "discourse/widgets/widget";
import { ajax } from "discourse/lib/ajax";
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
  console.log(eventList);

  for (let i = 0; i < eventList.events.length; i++) {
    let event = eventList.events[i];
    console.log("Event + " + event.id + " Below:");
    console.log("Title: " + event.name);
    console.log("Start Date: " + event.starts_at);
    console.log("End Date: " + event.ends_at);
    console.log("Post URL: " + event.post.url);

    // ? watching_invitee or sample_invitee
    // difference is watching_invitee is only showing one

    console.log(event.sample_invitee.length);
    // TODO create new user for testing purposes.
    // for (let j = 0; j < event.sample_invitee.length; j++) {
    //   let invitee = event.sample_invitee[j];
    //   console.log("reached");
    //   console.log(invitee);
    //   // if watching invitee status = going then:
    //   console.log("Invited: " + invitee.user.name);
    // }
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
