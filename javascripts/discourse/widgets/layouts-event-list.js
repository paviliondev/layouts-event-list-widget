import { longDate } from "discourse/lib/formatter";
import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
const { iconNode } = require("discourse-common/lib/icon-library");
const { iconHTML } = require("discourse-common/lib/icon-library");

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

    events.forEach((event, index) => {
      if (index + 1 <= settings.max_events) {
        eventListItems.push(this.attach("layouts-event-link", event));
      }
    });

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
    let formattedDate = new Date(attrs.starts_at);
    let date = h("p.layouts-event-date", longDate(formattedDate));
    // contents.push(h("div.event-details", date));
    // TODO how to make calendar icon appear without adding svg icon subset to settings?
    // contents.push(date);
    contents.push(h("div.layouts-event-details", [iconNode("calendar"), date]));
    // contents.push(h("div", iconNode("lock"), h("p", longDate(formattedDate))));

    if (!settings.toggle_invitees) return contents;
    let attendees = [];
    for (let invitees of attrs.sample_invitees) {
      let eventInviteeAvatar = h("img.event-invited-user", {
        attributes: {
          src: invitees.user.avatar_template.replace("{size}", "40"),
        },
      });

      let inviteeStatus;
      if (invitees.status == "going") {
        inviteeStatus = iconNode("check", { class: "invitee-going" });
      } else if (invitees.status == "not_going") {
        inviteeStatus = iconNode("times", { class: "invitee-not-going" });
      } else {
        inviteeStatus = iconNode("star", { class: "invitee-interested" });
      }

      let eventAttendee = h("li.event-attendee", [
        eventInviteeAvatar,
        inviteeStatus,
      ]);

      attendees.push(eventAttendee);
    }

    contents.push(h("ul.attendees", attendees));
    return contents;
  },

  click() {
    DiscourseURL.routeTo(this.attrs.post.url);
  },
});
