const TechnicianService = (() => {
  function renderTechnicianDashboard() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      return;
    }

    renderStats(currentUser);
    renderTodayRoute(currentUser);
    renderUpcomingTasks(currentUser);
  }

  function renderStats(currentUser) {
    const customers = getAssignedCustomers(currentUser);

    UIService.setText("technicianOpenCount", customers.filter(customer => customer.status === "open").length);
    UIService.setText("technicianProgressCount", customers.filter(customer => customer.status === "progress").length);
    UIService.setText("technicianUrgentCount", customers.filter(customer => ReminderService.isUrgent(customer)).length);
    UIService.setText("technicianDoneCount", customers.filter(customer => customer.status === "done").length);
  }

  function renderTodayRoute(currentUser) {
    const routeContainer = UIService.getElement("technicianRouteList");

    if (!routeContainer) {
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const todayCustomers = getAssignedCustomers(currentUser)
      .filter(customer => customer.nextDate === today)
      .sort((a, b) => sortByPriority(a, b));

    routeContainer.innerHTML = "";

    if (todayCustomers.length === 0) {
      routeContainer.innerHTML = `<p class="empty">${translate("technicianRouteEmpty", "Heute sind keine Einsätze geplant.")}</p>`;
      return;
    }

    todayCustomers.forEach((customer, index) => {
      const item = document.createElement("article");
      item.className = "route-item";

      item.innerHTML = `
        <div class="route-number">${index + 1}</div>

        <div class="route-content">
          <h3>${ReportService.escapeHtml(customer.name)}</h3>
          <p>${ReportService.escapeHtml(customer.address || translate("addressOpen", "Adresse offen"))}</p>
          <p>${ReportService.escapeHtml(customer.city || "")}</p>

          <div class="card-actions">
            ${UIService.createActionLinks(customer)}

            <button
              class="action-button edit-button"
              type="button"
              data-technician-detail="${customer.id}"
            >
              ${translate("actionOpenFile", "Akte öffnen")}
            </button>

            <button
              class="action-button done-button"
              type="button"
              data-technician-done="${customer.id}"
            >
              ${translate("actionDone", "Als erledigt markieren")}
            </button>
          </div>
        </div>
      `;

      routeContainer.appendChild(item);
    });
  }

  function renderUpcomingTasks(currentUser) {
    const container = UIService.getElement("technicianUpcomingList");

    if (!container) {
      return;
    }

    const upcomingCustomers = getAssignedCustomers(currentUser)
      .filter(customer => customer.status !== "done" && customer.nextDate)
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));

    container.innerHTML = "";

    if (upcomingCustomers.length === 0) {
      container.innerHTML = `<p class="empty">${translate("technicianUpcomingEmpty", "Aktuell sind keine offenen Einsätze zugewiesen.")}</p>`;
      return;
    }

    upcomingCustomers.slice(0, 8).forEach(customer => {
      const card = document.createElement("article");
      card.className = `technician-upcoming-card ${ReminderService.getPriorityClass(customer.priority)}`;

      card.innerHTML = `
        <div class="technician-upcoming-top">
          <div>
            <h3>${ReportService.escapeHtml(customer.name)}</h3>
            <p>${ReportService.escapeHtml(customer.city || translate("locationOpen", "Ort offen"))}</p>
          </div>

          <span class="badge ${ReminderService.getPriorityBadgeClass(customer.priority)}">
            ${ReminderService.getPriorityLabel(customer.priority)}
          </span>
        </div>

        <div class="technician-upcoming-grid">
          <div>
            <strong>${translate("labelAppointment", "Termin")}</strong>
            <span>${ReminderService.formatDate(customer.nextDate)}</span>
          </div>

          <div>
            <strong>${translate("labelStatus", "Status")}</strong>
            <span>${ReminderService.getStatusLabel(customer.status)}</span>
          </div>

          <div>
            <strong>${translate("labelMachineType", "Maschinentyp")}</strong>
            <span>${ReportService.escapeHtml(customer.machineType || translate("notSpecified", "Nicht angegeben"))}</span>
          </div>

          <div>
            <strong>${translate("labelLanes", "Bahnanzahl")}</strong>
            <span>${ReportService.escapeHtml(customer.laneCount || translate("notSpecified", "Nicht angegeben"))}</span>
          </div>
        </div>

        <div class="card-actions">
          ${UIService.createActionLinks(customer)}

          <button
            class="action-button edit-button"
            type="button"
            data-technician-detail="${customer.id}"
          >
            ${translate("actionOpenFile", "Akte öffnen")}
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }

  function bindEvents() {
    UIService.getElement("technicianRouteList")?.addEventListener("click", handleClick);
    UIService.getElement("technicianUpcomingList")?.addEventListener("click", handleClick);
  }

  function handleClick(event) {
    const detailButton = event.target.closest("[data-technician-detail]");

    if (detailButton) {
      CustomerService.openDetail(detailButton.dataset.technicianDetail);
      return;
    }

    const doneButton = event.target.closest("[data-technician-done]");

    if (doneButton) {
      CustomerService.markAsDone(doneButton.dataset.technicianDone);
    }
  }

  function getAssignedCustomers(currentUser) {
    const customers = StorageService.getCustomers();

    if (AuthService.isAdmin()) {
      return customers;
    }

    return customers.filter(customer => customer.assignedTo === currentUser.name);
  }

  function sortByPriority(a, b) {
    const order = {
      urgent: 0,
      high: 1,
      normal: 2
    };

    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
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
    renderTechnicianDashboard,
    bindEvents
  };
})();