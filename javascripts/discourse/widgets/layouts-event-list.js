import DiscourseURL from "discourse/lib/url";
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
    let { events } = this.attrs;
    let contents = [];

    if (events == null || events == undefined) return;

    // if discourse setting allows titlebar:
    console.log(events);

    // let contents = [];
    let eventListItems = [];
    let eventList = [];
    eventList.push(h("h2.layouts-event-title", "Upcoming Events"));
    for (let event of events) {
      eventListItems.push(this.attach("layouts-event-link", event));
    }
    eventList.push(h("ul.events-list", eventListItems));

    return eventList;
  },
});

createWidget("layouts-event-link", {
  tagName: "li.event-item",
  buildKey: (attrs) => `layouts-event-link-${attrs.id}`,

  html(attrs) {
    let contents = [];
    // Event Title
    contents.push(h("h3", attrs.name));
    contents.push(h("p", attrs.starts_at));

    if (settings.toggle_invitees) {
      for (let invitees of attrs.sample_invitees) {
        if (invitees.status === "going") {
          contents.push(
            h("img.event-invited-user", {
              attributes: {
                src: invitees.user.avatar_template.replace("{size}", "40"),
              },
            })
          );
          // contents.push(h("p", invitees.user.name));
        }
      }
    }
    return contents;
  },

  click() {
    DiscourseURL.routeTo(this.attrs.post.url);
  },
});
