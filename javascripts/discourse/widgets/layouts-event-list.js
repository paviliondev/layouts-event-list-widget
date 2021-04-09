import { longDate } from "discourse/lib/formatter";
import DiscourseURL from "discourse/lib/url";
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
    eventList.push(
      h(
        "a.l-event-header",
        {
          attributes: {
            href: "upcoming-events",
          },
        },
        "Upcoming Events"
      )
    );

    // sort event in ascending from start date
    const sortedEvent = events.sort(compareValues("starts_at", "asc"));

    sortedEvent.forEach((event, index) => {
      if (index + 1 <= settings.max_events) {
        // console.log(event.starts_at);
        eventListItems.push(this.attach("layouts-event-link", event));
      }
    });

    eventList.push(h("ul.l-event-items", eventListItems));

    return eventList;
  },
});

createWidget("layouts-event-link", {
  tagName: `li.l-event-item`,
  buildKey: (attrs) => `layouts-event-link-${attrs.id}`,

  getEventTitle(event) {
    const html = h("h3.l-event-item-title", event.name);
    return html;
  },

  getCurrentDayEvent(event) {
    const currentDate = new Date().toISOString().substr(0, 10);
    const eventDateOnly = event.starts_at.substr(0, 10);

    if (eventDateOnly == currentDate) {
      this.tagName = "li.l-event-item.l-event-item-highlighted";
    }

    return null;
  },

  getEventDate(event) {
    const formattedDate = new Date(event.starts_at);
    const dateInfo = h("p.l-event-date", longDate(formattedDate));
    this.getCurrentDayEvent(event);
    // TODO how to make calendar icon appear without adding svg icon subset to settings?
    const html = h("div.l-event-details", [iconNode("calendar"), dateInfo]);

    return html;
  },

  checkInviteeStatus(invitee) {
    if (invitee.status == "going") {
      return iconNode("check", { class: "l-event-invitee-going" });
    }

    if (invitee.status == "not_going") {
      return iconNode("times", { class: "l-event-invitee-not-going" });
    }

    if (invitee.status == "interested") {
      return iconNode("star", { class: "l-event-invitee-interested" });
    }

    return iconNode("question", { class: "l-event-invitee-unknown" });
  },

  getEventInvitees(event) {
    const invitees = [];

    for (let invitee of event.sample_invitees) {
      const eventInviteeAvatar = h("img.l-event-invitee-avatar", {
        attributes: {
          src: invitee.user.avatar_template.replace("{size}", "40"),
        },
      });

      const inviteeStatus = this.checkInviteeStatus(invitee);

      const eventInvitee = h("li.l-event-invitee", [
        eventInviteeAvatar,
        inviteeStatus,
      ]);

      invitees.push(eventInvitee);
    }

    const html = h("ul.l-event-invitees", invitees);

    return html;
  },

  html(attrs) {
    const contents = [];

    contents.push(this.getEventTitle(attrs));
    contents.push(this.getEventDate(attrs));
    if (settings.toggle_invitees == "Disabled") return contents;

    contents.push(this.getEventInvitees(attrs));
    return contents;
  },

  click() {
    DiscourseURL.routeTo(this.attrs.post.url);
  },
});