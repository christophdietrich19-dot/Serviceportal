const ReportService = (() => {
  function createReportHtml(customer) {
    if (!customer) {
      return `
        <div class="report-box">
          <h1>${translate("reportEyebrow", "Servicebericht")}</h1>
          <p>${translate("toastCustomerNotFound", "Servicefall wurde nicht gefunden.")}</p>
        </div>
      `;
    }

    return `
      <div class="report-box">
        <p class="eyebrow">Serviceportal</p>
        <h1>${translate("reportEyebrow", "Servicebericht")}</h1>

        <div class="report-grid">
          ${createReportLine(translate("labelCustomer", "Kunde"), customer.name)}
          ${createReportLine(translate("labelCity", "Ort"), customer.city)}
          ${createReportLine(translate("labelAddress", "Adresse"), customer.address)}
          ${createReportLine(translate("labelPhone", "Telefon"), customer.phone)}
          ${createReportLine(translate("labelEmail", "E-Mail"), customer.email)}

          ${createReportLine(translate("labelSystem", "Anlage"), translateStoredSystem(customer.system))}
          ${createReportLine(translate("labelMachineType", "Maschinentyp"), customer.machineType)}
          ${createReportLine(translate("labelLanes", "Bahnanzahl"), customer.laneCount)}
          ${createReportLine(translate("labelMaintenancePerLane", "Wartung pro Bahn"), customer.maintenancePerLane)}

          ${createReportLine(translate("labelServiceType", "Serviceart"), translateStoredServiceType(customer.serviceType))}
          ${createReportLine(translate("labelStatus", "Status"), ReminderService.getStatusLabel(customer.status))}
          ${createReportLine(translate("labelPriority", "Priorität"), ReminderService.getPriorityLabel(customer.priority))}
          ${createReportLine(translate("labelAssignedTo", "Zugewiesen an"), customer.assignedTo || translate("notAssigned", "Nicht zugewiesen"))}

          ${createReportLine(
            translate("labelNextDate", "Nächster Termin"),
            customer.nextDate ? ReminderService.formatDate(customer.nextDate) : translate("noDateOpen", "Noch offen")
          )}

          ${createReportLine(translate("labelCreatedBy", "Erstellt von"), customer.createdBy)}
          ${createReportLine(translate("labelCreatedAt", "Erstellt am"), formatDateTime(customer.createdAt))}
          ${createReportLine(translate("labelUpdatedAt", "Bearbeitet am"), formatDateTime(customer.updatedAt))}
          ${createReportLine(translate("labelCompletedAt", "Erledigt am"), formatDateTime(customer.completedAt))}
          ${createReportLine(translate("labelReportCreatedAt", "Bericht erstellt am"), new Date().toLocaleString(getLocale()))}
        </div>

        <h2>${translate("labelWorkNotes", "Notiz / durchgeführte Arbeiten")}</h2>
        <p>${escapeHtml(customer.note || translate("noNote", "Keine Notiz vorhanden."))}</p>

        <h2>${translate("labelReminder", "Erinnerung")}</h2>
        <p>${escapeHtml(createReminderText(customer))}</p>

        <br><br>

        <p><strong>${translate("labelSignatureEmployee", "Unterschrift Mitarbeiter")}:</strong> _______________________________</p>
        <p><strong>${translate("labelSignatureCustomer", "Unterschrift Kunde")}:</strong> _____________________________________</p>
      </div>
    `;
  }

  function createReportLine(label, value) {
    return `
      <div class="report-line">
        <strong>${escapeHtml(label)}:</strong><br>
        ${escapeHtml(value || translate("notSpecified", "Nicht angegeben"))}
      </div>
    `;
  }

  function createReminderText(customer) {
    if (!customer.reminderType) {
      return translate("noReminder", "Keine Erinnerung");
    }

    const reminderType = translateStoredReminderType(customer.reminderType);

    if (!customer.reminderDate) {
      return reminderType;
    }

    const language = getLanguage();

    if (language === "en") {
      return `${reminderType} on ${ReminderService.formatDate(customer.reminderDate)}`;
    }

    return `${reminderType} am ${ReminderService.formatDate(customer.reminderDate)}`;
  }

  function formatDateTime(dateString) {
    if (!dateString) {
      return translate("notSpecified", "Nicht angegeben");
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return translate("notSpecified", "Nicht angegeben");
    }

    return date.toLocaleString(getLocale());
  }

  function translateStoredSystem(value) {
    if (typeof ReminderService !== "undefined" && ReminderService.translateStoredSystem) {
      return ReminderService.translateStoredSystem(value);
    }

    return value;
  }

  function translateStoredServiceType(value) {
    if (typeof ReminderService !== "undefined" && ReminderService.translateStoredServiceType) {
      return ReminderService.translateStoredServiceType(value);
    }

    return value;
  }

  function translateStoredReminderType(value) {
    if (typeof ReminderService !== "undefined" && ReminderService.translateStoredReminderType) {
      return ReminderService.translateStoredReminderType(value);
    }

    return value;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getLocale() {
    if (typeof I18nService === "undefined") {
      return "de-DE";
    }

    return I18nService.getLanguage() === "en" ? "en-GB" : "de-DE";
  }

  function getLanguage() {
    if (typeof I18nService === "undefined") {
      return "de";
    }

    return I18nService.getLanguage();
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
    createReportHtml,
    escapeHtml,
    formatDateTime
  };
})();