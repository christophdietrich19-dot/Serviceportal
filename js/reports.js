const ReportService = (() => {
  function createReportHtml(customer) {
    if (!customer) {
      return `
        <div class="report-box">
          <h1>Servicebericht</h1>
          <p>Kein Servicefall ausgewählt.</p>
        </div>
      `;
    }

    return `
      <div class="report-box">
        <p class="eyebrow">Serviceportal</p>
        <h1>Servicebericht</h1>

        <div class="report-grid">
          ${createReportLine("Kunde", customer.name)}
          ${createReportLine("Ort", customer.city)}
          ${createReportLine("Adresse", customer.address)}
          ${createReportLine("Telefon", customer.phone)}
          ${createReportLine("E-Mail", customer.email)}

          ${createReportLine("Anlage", customer.system)}
          ${createReportLine("Maschinentyp", customer.machineType)}
          ${createReportLine("Bahnanzahl", customer.laneCount)}
          ${createReportLine("Wartung pro Bahn", customer.maintenancePerLane)}

          ${createReportLine("Serviceart", customer.serviceType)}
          ${createReportLine("Status", ReminderService.getStatusLabel(customer.status))}
          ${createReportLine("Priorität", ReminderService.getPriorityLabel(customer.priority))}
          ${createReportLine("Zugewiesen an", customer.assignedTo || "Nicht zugewiesen")}

          ${createReportLine(
            "Nächster Termin",
            customer.nextDate ? ReminderService.formatDate(customer.nextDate) : "Noch offen"
          )}

          ${createReportLine("Erstellt von", customer.createdBy)}
          ${createReportLine("Erstellt am", formatDateTime(customer.createdAt))}
          ${createReportLine("Bearbeitet am", formatDateTime(customer.updatedAt))}
          ${createReportLine("Erledigt am", formatDateTime(customer.completedAt))}
          ${createReportLine("Bericht erstellt am", new Date().toLocaleString("de-DE"))}
        </div>

        <h2>Notiz / durchgeführte Arbeiten</h2>
        <p>${escapeHtml(customer.note || "Keine Notiz vorhanden.")}</p>

        <h2>Erinnerung</h2>
        <p>${escapeHtml(createReminderText(customer))}</p>

        <br><br>

        <p><strong>Unterschrift Mitarbeiter:</strong> _______________________________</p>
        <p><strong>Unterschrift Kunde:</strong> _____________________________________</p>
      </div>
    `;
  }

  function createReportLine(label, value) {
    return `
      <div class="report-line">
        <strong>${escapeHtml(label)}:</strong><br>
        ${escapeHtml(value || "Nicht angegeben")}
      </div>
    `;
  }

  function createReminderText(customer) {
    if (!customer.reminderType) {
      return "Keine Erinnerung";
    }

    if (!customer.reminderDate) {
      return customer.reminderType;
    }

    return `${customer.reminderType} am ${ReminderService.formatDate(customer.reminderDate)}`;
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

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  return {
    createReportHtml,
    escapeHtml
  };
})();