const CalendarService = (() => {
  function renderCalendar() {
    const calendarGrid = UIService.getElement("calendarGrid");

    if (!calendarGrid) {
      return;
    }

    const customers = StorageService.getCustomers();
    const groupedCustomers = ReminderService.groupCustomersByDate(customers);
    const upcomingDates = getUpcomingDates(5);

    calendarGrid.innerHTML = "";

    upcomingDates.forEach(dateString => {
      const entries = groupedCustomers[dateString] || [];
      calendarGrid.appendChild(createDayCard(dateString, entries));
    });
  }

  function createDayCard(dateString, customers) {
    const card = document.createElement("article");
    card.className = "calendar-day";

    const entriesHtml = customers.length === 0
      ? `<p class="muted-text">${translate("calendarNoEntries", "Keine Termine vorhanden.")}</p>`
      : customers
          .sort((a, b) => sortByPriority(a, b))
          .map(customer => createCalendarEntry(customer))
          .join("");

    card.innerHTML = `
      <h3>${formatGermanDate(dateString)}</h3>
      ${entriesHtml}
    `;

    return card;
  }

  function createCalendarEntry(customer) {
    const priorityClass = customer.priority === "urgent" ? "urgent" : "";

    return `
      <div class="calendar-entry ${priorityClass}">
        <strong>${ReportService.escapeHtml(customer.name)}</strong>

        <p>${ReportService.escapeHtml(customer.city || translate("locationOpen", "Ort offen"))}</p>
        <p>${ReportService.escapeHtml(ReminderService.translateStoredServiceType(customer.serviceType) || translate("serviceCase", "Servicefall"))}</p>
        <p>${translate("labelTechnician", "Techniker")}: ${ReportService.escapeHtml(customer.assignedTo || translate("notAssigned", "Nicht zugewiesen"))}</p>
        <p>${translate("labelStatus", "Status")}: ${ReminderService.getStatusLabel(customer.status)}</p>
        <p>${translate("labelPriority", "Priorität")}: ${ReminderService.getPriorityLabel(customer.priority)}</p>

        <div class="card-actions">
          <button
            class="action-button edit-button"
            type="button"
            data-calendar-open="${customer.id}"
          >
            ${translate("actionOpen", "Öffnen")}
          </button>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    const calendarGrid = UIService.getElement("calendarGrid");

    if (!calendarGrid) {
      return;
    }

    calendarGrid.addEventListener("click", event => {
      const button = event.target.closest("[data-calendar-open]");

      if (!button) {
        return;
      }

      CustomerService.openDetail(button.dataset.calendarOpen);
    });
  }

  function getUpcomingDates(days) {
    const dates = [];

    for (let index = 0; index < days; index++) {
      const date = new Date();

      date.setDate(date.getDate() + index);

      dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
  }

  function formatGermanDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return translate("noDateOpen", "Noch offen");
    }

    return date.toLocaleDateString(getLocale(), {
      weekday: "long",
      day: "2-digit",
      month: "2-digit"
    });
  }

  function sortByPriority(a, b) {
    const order = {
      urgent: 0,
      high: 1,
      normal: 2
    };

    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
  }

  function getLocale() {
    if (typeof I18nService === "undefined") {
      return "de-DE";
    }

    return I18nService.getLanguage() === "en" ? "en-GB" : "de-DE";
  }

  function translate(key, fallback, replacements = {}) {
    if (typeof I18nService === "undefined") {
      let text = fallback;

      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replaceAll(`{${placeholder}}`, value);
      });

      return text;
    }

    return I18nService.t(key, replacements);
  }

  return {
    renderCalendar,
    bindEvents
  };
})();