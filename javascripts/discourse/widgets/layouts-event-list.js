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

function compareValues(key, order = "asc") {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
    const comparison = a[key].localeCompare(b[key]);

    return order === "desc" ? comparison * -1 : comparison;
  };
}

export default layouts.createLayoutsWidget("event-list", {
  html(attrs) {
    const { events } = attrs;

    if (events == null || events == undefined) return;

    console.log(events); // TODO remove for production

    const eventListItems = [];
    const eventList = [];
    eventList.push(h("h2.layouts-event-title", "Upcoming Events"));

    // sort event in ascending from start date
    const sortedEvent = events.sort(compareValues("starts_at", "asc"));

    sortedEvent.forEach((event, index) => {
      if (index + 1 <= settings.max_events) {
        console.log(event.starts_at);
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

  getEventTitle(event) {
    const html = h("h3", event.name);
    return html;
  },

  getEventDate(event) {
    const formattedDate = new Date(event.starts_at);
    const dateInfo = h("p.layouts-event-date", longDate(formattedDate));
    // TODO how to make calendar icon appear without adding svg icon subset to settings?
    const html = h("div.layouts-event-details", [
      iconNode("calendar"),
      dateInfo,
    ]);

    return html;
  },

  checkInviteeStatus(invitee) {
    if (invitee.status == "going") {
      return iconNode("check", { class: "invitee-going" });
    }

    if (invitee.status == "not_going") {
      return iconNode("times", { class: "invitee-not-going" });
    }

    if (invitee.status == "interested") {
      return iconNode("star", { class: "invitee-interested" });
    }
  },

  getEventAttendees(event) {
    const attendees = [];

    for (let invitees of event.sample_invitees) {
      const eventInviteeAvatar = h("img.event-invited-user", {
        attributes: {
          src: invitees.user.avatar_template.replace("{size}", "40"),
        },
      });

      const inviteeStatus = this.checkInviteeStatus(invitees);

      const eventAttendee = h("li.event-attendee", [
        eventInviteeAvatar,
        inviteeStatus,
      ]);

      attendees.push(eventAttendee);
    }

    const html = h("ul.attendees", attendees);

    return html;
  },

  html(attrs) {
    const contents = [];

    contents.push(this.getEventTitle(attrs));
    contents.push(this.getEventDate(attrs));

    if (!settings.toggle_invitees) return contents;

    contents.push(this.getEventAttendees(attrs));
    return contents;
  },

  click() {
    DiscourseURL.routeTo(this.attrs.post.url);
  },
});
