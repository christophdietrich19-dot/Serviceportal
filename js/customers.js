const CustomerService = (() => {
  function createCustomerFromForm() {
    const imageInput = UIService.getElement("serviceImage");
    const imageFile = imageInput?.files?.[0];

    const customer = {
      name: UIService.getValue("customerName"),
      city: UIService.getValue("customerCity"),
      address: UIService.getValue("customerAddress"),
      phone: UIService.getValue("customerPhone"),
      email: UIService.getValue("customerEmail"),
      system: UIService.getRawValue("customerSystem"),
      machineType: UIService.getRawValue("machineType"),
      laneCount: UIService.getRawValue("laneCount"),
      maintenancePerLane: UIService.getValue("maintenancePerLane"),
      serviceType: UIService.getRawValue("serviceType"),
      priority: UIService.getRawValue("priority"),
      assignedTo: UIService.getRawValue("assignedTo"),
      status: UIService.getRawValue("status"),
      nextDate: UIService.getRawValue("nextDate"),
      reminderType: UIService.getRawValue("reminderType"),
      reminderDate: UIService.getRawValue("reminderDate"),
      note: UIService.getValue("note"),
      image: "",
      createdBy: AuthService.getCurrentUserName()
    };

    if (!customer.name) {
      UIService.showToast("Bitte mindestens einen Kundennamen eintragen.");
      return;
    }

    if (imageFile) {
      const reader = new FileReader();

      reader.onload = event => {
        saveCustomer({
          ...customer,
          image: event.target.result
        });
      };

      reader.readAsDataURL(imageFile);
      return;
    }

    saveCustomer(customer);
  }

  function saveCustomer(customer) {
    StorageService.addCustomer(customer);

    UIService.resetForm("customerForm");

    renderAll();
    UIService.showPage("customersPage");
    UIService.showToast("Kunde / Servicefall wurde gespeichert.");
  }

  function renderAll() {
    renderDashboard();
    renderCustomers();
    renderStatusBoard();
    renderImportantLists();
    renderReports();

    if (typeof CalendarService !== "undefined") {
      CalendarService.renderCalendar();
    }

    if (typeof TechnicianService !== "undefined") {
      TechnicianService.renderTechnicianDashboard();
    }

    AuthService.renderAccounts();
    AuthService.refreshAssignableUserSelects();
  }

  function renderDashboard() {
    const customers = StorageService.getCustomers();
    const accounts = StorageService.getAccounts();

    const openCustomers = customers.filter(customer => customer.status !== "done");
    const dueCustomers = customers.filter(customer => ReminderService.isReminderDue(customer));
    const urgentCustomers = customers.filter(customer => ReminderService.isUrgent(customer));

    UIService.setText("customerCount", customers.length);
    UIService.setText("openCount", openCustomers.length);
    UIService.setText("dueCount", dueCustomers.length);
    UIService.setText("urgentCount", urgentCustomers.length);
    UIService.setText("accountCount", accounts.length);

    const message =
      dueCustomers.length === 0 && urgentCustomers.length === 0
        ? "Aktuell sind keine fälligen Erinnerungen oder dringenden Fälle vorhanden."
        : `Heute wichtig: ${dueCustomers.length} Erinnerung(en) und ${urgentCustomers.length} dringende Fälle prüfen.`;

    UIService.setText("dailyMessage", message);
  }

  function renderCustomers() {
    const list = UIService.getElement("customersList");

    if (!list) {
      return;
    }

    const customers = getFilteredCustomers();

    list.innerHTML = "";

    if (customers.length === 0) {
      list.innerHTML = `<p class="empty">Keine passenden Kunden oder Servicefälle gefunden.</p>`;
      return;
    }

    customers.forEach(customer => {
      list.appendChild(createCustomerCard(customer));
    });
  }

  function getFilteredCustomers() {
    const customers = StorageService.getCustomers();
    const searchText = UIService.getValue("customerSearch");
    const statusFilter = UIService.getRawValue("statusFilter") || "all";

    return customers.filter(customer => {
      const statusMatches = statusFilter === "all" || customer.status === statusFilter;
      const searchMatches = ReminderService.matchesSearch(customer, searchText);

      return statusMatches && searchMatches;
    });
  }

  function createCustomerCard(customer) {
    const card = document.createElement("article");
    card.className = `customer-card ${ReminderService.getPriorityClass(customer.priority)}`;

    const reminderInfo = ReminderService.getReminderInfo(customer);

    const reminderHtml = reminderInfo.text
      ? `<div class="reminder-box ${reminderInfo.className}">${ReportService.escapeHtml(reminderInfo.text)}</div>`
      : "";

    const imageHtml = customer.image
      ? `<img class="service-image" src="${customer.image}" alt="Servicebild" />`
      : "";

    card.innerHTML = `
      <div class="card-topline">
        <div>
          <h3>${ReportService.escapeHtml(customer.name)}</h3>
          <p>
            ${ReportService.escapeHtml(customer.city || "Ort nicht angegeben")}
            · ${ReportService.escapeHtml(customer.serviceType || "Servicefall")}
          </p>
        </div>

        <div class="badges">
          <span class="badge ${ReminderService.getPriorityBadgeClass(customer.priority)}">
            ${ReminderService.getPriorityLabel(customer.priority)}
          </span>

          <span class="badge ${ReminderService.getStatusBadgeClass(customer.status)}">
            ${ReminderService.getStatusLabel(customer.status)}
          </span>
        </div>
      </div>

      <div class="info-mini-grid">
        <div>
          <strong>Maschine</strong>
          <span>${ReportService.escapeHtml(customer.machineType || "Nicht angegeben")}</span>
        </div>

        <div>
          <strong>Bahnen</strong>
          <span>${ReportService.escapeHtml(customer.laneCount || "Nicht angegeben")}</span>
        </div>

        <div>
          <strong>Termin</strong>
          <span>${customer.nextDate ? ReminderService.formatDate(customer.nextDate) : "Noch offen"}</span>
        </div>

        <div>
          <strong>Mitarbeiter</strong>
          <span>${ReportService.escapeHtml(customer.assignedTo || "Nicht zugewiesen")}</span>
        </div>
      </div>

      ${reminderHtml}

      <div class="card-actions">
        <button class="action-button edit-button" type="button" data-action="detail" data-id="${customer.id}">
          Akte öffnen
        </button>

        ${UIService.createActionLinks(customer)}

        <button class="action-button report-button" type="button" data-action="report" data-id="${customer.id}">
          Servicebericht
        </button>
      </div>

      ${imageHtml}

      <div class="card-actions">
        <button class="action-button edit-button" type="button" data-action="edit" data-id="${customer.id}">
          Bearbeiten
        </button>

        ${
          customer.status !== "done"
            ? `<button class="action-button done-button" type="button" data-action="done" data-id="${customer.id}">
                Als erledigt markieren
              </button>`
            : ""
        }

        ${
          AuthService.isAdmin()
            ? `<button class="action-button delete-button" type="button" data-action="delete" data-id="${customer.id}">
                Löschen
              </button>`
            : ""
        }
      </div>
    `;

    return card;
  }

  function renderStatusBoard() {
    const customers = StorageService.getCustomers();

    const openCustomers = customers.filter(customer => customer.status === "open");
    const progressCustomers = customers.filter(customer => customer.status === "progress");
    const doneCustomers = customers.filter(customer => customer.status === "done");

    UIService.setText("boardOpenCount", openCustomers.length);
    UIService.setText("boardProgressCount", progressCustomers.length);
    UIService.setText("boardDoneCount", doneCustomers.length);

    renderBoardColumn("boardOpenList", openCustomers);
    renderBoardColumn("boardProgressList", progressCustomers);
    renderBoardColumn("boardDoneList", doneCustomers);
  }

  function renderBoardColumn(elementId, customers) {
    const list = UIService.getElement(elementId);

    if (!list) {
      return;
    }

    list.innerHTML = "";

    if (customers.length === 0) {
      list.innerHTML = `<p class="board-empty">Keine Servicefälle in dieser Spalte.</p>`;
      return;
    }

    customers.forEach(customer => {
      list.appendChild(createBoardCard(customer));
    });
  }

  function createBoardCard(customer) {
    const card = document.createElement("article");
    card.className = `board-card ${ReminderService.getPriorityClass(customer.priority)}`;

    card.innerHTML = `
      <h4>${ReportService.escapeHtml(customer.name)}</h4>

      <p>${ReportService.escapeHtml(customer.city || "Ort nicht angegeben")}</p>
      <p>${ReportService.escapeHtml(customer.serviceType || "Servicefall")} · ${ReminderService.getPriorityLabel(customer.priority)}</p>
      <p>Termin: ${customer.nextDate ? ReminderService.formatDate(customer.nextDate) : "Noch offen"}</p>
      <p>Techniker: ${ReportService.escapeHtml(customer.assignedTo || "Nicht zugewiesen")}</p>
      <p>Maschine: ${ReportService.escapeHtml(customer.machineType || "Nicht angegeben")}</p>

      <div class="board-card-actions">
        <button class="action-button edit-button" type="button" data-action="detail" data-id="${customer.id}">
          Öffnen
        </button>

        <button class="action-button report-button" type="button" data-action="report" data-id="${customer.id}">
          Bericht
        </button>
      </div>
    `;

    if (typeof DragDropService !== "undefined") {
      DragDropService.makeCardDraggable(card, customer.id);
    }

    return card;
  }

  function renderImportantLists() {
    const customers = StorageService.getCustomers();
    const importantCustomers = ReminderService.getImportantCustomers(customers);

    renderImportantList("importantList", importantCustomers);
    renderImportantList("dashboardImportantList", importantCustomers);
  }

  function renderImportantList(elementId, customers) {
    const list = UIService.getElement(elementId);

    if (!list) {
      return;
    }

    list.innerHTML = "";

    if (customers.length === 0) {
      list.innerHTML = `<p class="empty">Aktuell sind keine Erinnerungen oder dringenden Fälle fällig.</p>`;
      return;
    }

    customers.forEach(customer => {
      const item = document.createElement("article");
      item.className = "important-item";

      const reminderInfo = ReminderService.getReminderInfo(customer);
      const message = reminderInfo.text || "Dringender Servicefall ohne Erinnerung.";

      item.innerHTML = `
        <div>
          <h3>${ReportService.escapeHtml(customer.name)}</h3>
          <p>${ReportService.escapeHtml(message)}</p>
          <p>
            ${ReportService.escapeHtml(customer.city || "Ort nicht angegeben")}
            ${customer.nextDate ? " · Termin: " + ReminderService.formatDate(customer.nextDate) : ""}
          </p>
          <p>Zugewiesen an: ${ReportService.escapeHtml(customer.assignedTo || "Nicht zugewiesen")}</p>
        </div>

        <div class="important-actions">
          ${UIService.createActionLinks(customer)}

          <button class="action-button edit-button" type="button" data-action="detail" data-id="${customer.id}">
            Akte öffnen
          </button>
        </div>
      `;

      list.appendChild(item);
    });
  }

  function renderReports() {
    const reportsList = UIService.getElement("reportsList");

    if (!reportsList) {
      return;
    }

    const doneCustomers = StorageService.getCustomers()
      .filter(customer => customer.status === "done")
      .sort((a, b) => new Date(b.completedAt || b.updatedAt || 0) - new Date(a.completedAt || a.updatedAt || 0));

    reportsList.innerHTML = "";

    if (doneCustomers.length === 0) {
      reportsList.innerHTML = `<p class="empty">Noch keine erledigten Servicefälle vorhanden.</p>`;
      return;
    }

    doneCustomers.forEach(customer => {
      const card = document.createElement("article");
      card.className = "customer-card";

      card.innerHTML = `
        <div class="card-topline">
          <div>
            <h3>${ReportService.escapeHtml(customer.name)}</h3>
            <p>
              ${ReportService.escapeHtml(customer.serviceType || "Servicefall")}
              · ${ReportService.escapeHtml(customer.city || "Ort nicht angegeben")}
            </p>
          </div>

          <div class="badges">
            <span class="badge badge-green">Erledigt</span>
            <span class="badge badge-gold">${ReportService.escapeHtml(customer.assignedTo || "Nicht zugewiesen")}</span>
          </div>
        </div>

        <p><strong>Erledigt am:</strong> ${formatDateTime(customer.completedAt)}</p>
        <p><strong>Notiz:</strong> ${ReportService.escapeHtml(customer.note || "Keine Notiz vorhanden.")}</p>

        <div class="card-actions">
          <button class="action-button report-button" type="button" data-action="report" data-id="${customer.id}">
            Servicebericht öffnen
          </button>
        </div>
      `;

      reportsList.appendChild(card);
    });
  }

  function openDetail(customerId) {
    const customer = findCustomerById(customerId);

    if (!customer) {
      UIService.showToast("Servicefall wurde nicht gefunden.");
      return;
    }

    UIService.setHtml("customerDetailContent", createDetailHtml(customer));
    UIService.openModal("customerDetailModal");
  }

  function createDetailHtml(customer) {
    const reminderInfo = ReminderService.getReminderInfo(customer);

    const reminderHtml = reminderInfo.text
      ? `
        <div class="detail-section">
          <h3>Erinnerung</h3>
          <div class="reminder-box ${reminderInfo.className}">
            ${ReportService.escapeHtml(reminderInfo.text)}
          </div>
        </div>
      `
      : "";

    const imageHtml = customer.image
      ? `
        <div class="detail-section">
          <h3>Bild / Dokumentation</h3>
          <img class="service-image" src="${customer.image}" alt="Servicebild" />
        </div>
      `
      : "";

    return `
      <div class="detail-grid">
        ${createDetailBox("Kunde", customer.name)}
        ${createDetailBox("Ort", customer.city)}
        ${createDetailBox("Adresse", customer.address)}
        ${createDetailBox("Telefon", customer.phone)}
        ${createDetailBox("E-Mail", customer.email)}
        ${createDetailBox("Anlage", customer.system)}
        ${createDetailBox("Maschinentyp", customer.machineType)}
        ${createDetailBox("Bahnanzahl", customer.laneCount)}
        ${createDetailBox("Wartung pro Bahn", customer.maintenancePerLane)}
        ${createDetailBox("Serviceart", customer.serviceType)}
        ${createDetailBox("Status", ReminderService.getStatusLabel(customer.status))}
        ${createDetailBox("Priorität", ReminderService.getPriorityLabel(customer.priority))}
        ${createDetailBox("Zugewiesen an", customer.assignedTo || "Nicht zugewiesen")}
        ${createDetailBox("Nächster Termin", customer.nextDate ? ReminderService.formatDate(customer.nextDate) : "Noch offen")}
        ${createDetailBox("Erstellt von", customer.createdBy || "Unbekannt")}
      </div>

      <div class="detail-section">
        <h3>Notiz</h3>
        <p class="muted-text">${ReportService.escapeHtml(customer.note || "Keine Notiz vorhanden.")}</p>
      </div>

      ${reminderHtml}

      <div class="detail-section">
        <h3>Serviceverlauf</h3>

        <div class="timeline">
          <div class="timeline-item">
            <h4>Eintrag angelegt</h4>
            <p>${formatDateTime(customer.createdAt)}</p>
            <p>Erstellt von: ${ReportService.escapeHtml(customer.createdBy || "Unbekannt")}</p>
          </div>

          ${
            customer.updatedAt
              ? `
                <div class="timeline-item">
                  <h4>Eintrag bearbeitet</h4>
                  <p>${formatDateTime(customer.updatedAt)}</p>
                  <p>Bearbeitet von: ${ReportService.escapeHtml(customer.updatedBy || "Unbekannt")}</p>
                </div>
              `
              : ""
          }

          ${
            customer.status === "done"
              ? `
                <div class="timeline-item">
                  <h4>Servicefall erledigt</h4>
                  <p>${formatDateTime(customer.completedAt)}</p>
                  <p>Erledigt von: ${ReportService.escapeHtml(customer.updatedBy || "Unbekannt")}</p>
                </div>
              `
              : ""
          }
        </div>
      </div>

      ${imageHtml}

      <div class="detail-actions">
        ${UIService.createActionLinks(customer)}

        <button class="action-button edit-button" type="button" data-action="edit" data-id="${customer.id}">
          Bearbeiten
        </button>

        <button class="action-button report-button" type="button" data-action="report" data-id="${customer.id}">
          Servicebericht öffnen
        </button>

        ${
          customer.status !== "done"
            ? `<button class="action-button done-button" type="button" data-action="done" data-id="${customer.id}">
                Als erledigt markieren
              </button>`
            : ""
        }
      </div>
    `;
  }

  function createDetailBox(label, value) {
    return `
      <div class="detail-box">
        <strong>${ReportService.escapeHtml(label)}</strong>
        <span>${ReportService.escapeHtml(value || "Nicht angegeben")}</span>
      </div>
    `;
  }

  function openEditModal(customerId) {
    const customer = findCustomerById(customerId);

    if (!customer) {
      UIService.showToast("Servicefall wurde nicht gefunden.");
      return;
    }

    AuthService.refreshAssignableUserSelects();

    UIService.setValue("editCustomerId", customer.id);
    UIService.setValue("editCustomerName", customer.name);
    UIService.setValue("editCustomerCity", customer.city);
    UIService.setValue("editCustomerAddress", customer.address);
    UIService.setValue("editCustomerPhone", customer.phone);
    UIService.setValue("editCustomerEmail", customer.email);
    UIService.setValue("editCustomerSystem", customer.system);
    UIService.setValue("editMachineType", customer.machineType);
    UIService.setValue("editLaneCount", customer.laneCount);
    UIService.setValue("editMaintenancePerLane", customer.maintenancePerLane);
    UIService.setValue("editServiceType", customer.serviceType);
    UIService.setValue("editPriority", customer.priority);
    UIService.setValue("editAssignedTo", customer.assignedTo);
    UIService.setValue("editStatus", customer.status);
    UIService.setValue("editNextDate", customer.nextDate);
    UIService.setValue("editReminderType", customer.reminderType);
    UIService.setValue("editReminderDate", customer.reminderDate);
    UIService.setValue("editNote", customer.note);

    UIService.openModal("editCustomerModal");
  }

  function saveEditedCustomer() {
    const customerId = UIService.getRawValue("editCustomerId");

    if (!customerId) {
      UIService.showToast("Kein Servicefall ausgewählt.");
      return;
    }

    const oldCustomer = findCustomerById(customerId);

    const updates = {
      name: UIService.getValue("editCustomerName"),
      city: UIService.getValue("editCustomerCity"),
      address: UIService.getValue("editCustomerAddress"),
      phone: UIService.getValue("editCustomerPhone"),
      email: UIService.getValue("editCustomerEmail"),
      system: UIService.getRawValue("editCustomerSystem"),
      machineType: UIService.getRawValue("editMachineType"),
      laneCount: UIService.getRawValue("editLaneCount"),
      maintenancePerLane: UIService.getValue("editMaintenancePerLane"),
      serviceType: UIService.getRawValue("editServiceType"),
      priority: UIService.getRawValue("editPriority"),
      assignedTo: UIService.getRawValue("editAssignedTo"),
      status: UIService.getRawValue("editStatus"),
      nextDate: UIService.getRawValue("editNextDate"),
      reminderType: UIService.getRawValue("editReminderType"),
      reminderDate: UIService.getRawValue("editReminderDate"),
      note: UIService.getValue("editNote"),
      updatedBy: AuthService.getCurrentUserName()
    };

    if (!updates.name) {
      UIService.showToast("Bitte mindestens einen Kundennamen eintragen.");
      return;
    }

    if (oldCustomer && oldCustomer.status !== "done" && updates.status === "done") {
      updates.completedAt = new Date().toISOString();
    }

    if (oldCustomer && oldCustomer.status === "done" && updates.status !== "done") {
      updates.completedAt = null;
    }

    StorageService.updateCustomer(customerId, updates);

    UIService.closeModal("editCustomerModal");

    renderAll();
    UIService.showToast("Änderungen wurden gespeichert.");
  }

  function markAsDone(customerId) {
    StorageService.updateCustomer(customerId, {
      status: "done",
      completedAt: new Date().toISOString(),
      updatedBy: AuthService.getCurrentUserName()
    });

    renderAll();
    UIService.showToast("Servicefall wurde als erledigt markiert.");
  }

  function deleteCustomer(customerId) {
    if (!AuthService.isAdmin()) {
      UIService.showToast("Nur Admins dürfen Einträge löschen.");
      return;
    }

    const confirmed = confirm("Soll dieser Servicefall wirklich gelöscht werden?");

    if (!confirmed) {
      return;
    }

    StorageService.deleteCustomer(customerId);

    renderAll();
    UIService.showToast("Eintrag wurde gelöscht.");
  }

  function openReport(customerId) {
    const customer = findCustomerById(customerId);

    if (!customer) {
      UIService.showToast("Servicefall wurde nicht gefunden.");
      return;
    }

    UIService.closeModal("customerDetailModal");
    UIService.setHtml("reportContent", ReportService.createReportHtml(customer));
    UIService.openModal("reportModal");
  }

  function findCustomerById(customerId) {
    return StorageService.getCustomers().find(customer => customer.id === customerId) || null;
  }

  function handleListClick(event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;
    const customerId = button.dataset.id;

    if (!customerId) {
      return;
    }

    if (action === "detail") {
      openDetail(customerId);
      return;
    }

    if (action === "edit") {
      openEditModal(customerId);
      return;
    }

    if (action === "done") {
      markAsDone(customerId);
      return;
    }

    if (action === "delete") {
      deleteCustomer(customerId);
      return;
    }

    if (action === "report") {
      openReport(customerId);
    }
  }

  function formatDateTime(dateString) {
    if (!dateString) {
      return "Nicht angegeben";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Nicht angegeben";
    }

    return date.toLocaleString("de-DE");
  }

  return {
    createCustomerFromForm,
    renderAll,
    renderDashboard,
    renderCustomers,
    renderStatusBoard,
    renderImportantLists,
    renderReports,

    openDetail,
    openEditModal,
    saveEditedCustomer,
    markAsDone,
    deleteCustomer,
    openReport,

    handleListClick
  };
})();