const ReminderService = (() => {
  function getStatusLabel(status) {
    const labels = {
      open: translate("statusOpen", "Offen"),
      progress: translate("statusProgress", "In Bearbeitung"),
      done: translate("statusDone", "Erledigt")
    };

    return labels[status] || labels.open;
  }

  function getStatusBadgeClass(status) {
    const classes = {
      open: "badge-red",
      progress: "badge-orange",
      done: "badge-green"
    };

    return classes[status] || "badge-red";
  }

  function getPriorityLabel(priority) {
    const labels = {
      normal: translate("priorityNormal", "Normal"),
      high: translate("priorityHigh", "Hoch"),
      urgent: translate("priorityUrgent", "Dringend")
    };

    return labels[priority] || labels.normal;
  }

  function getPriorityClass(priority) {
    const classes = {
      normal: "",
      high: "priority-high",
      urgent: "priority-urgent"
    };

    return classes[priority] || "";
  }

  function getPriorityBadgeClass(priority) {
    const classes = {
      normal: "",
      high: "badge-orange",
      urgent: "badge-red"
    };

    return classes[priority] || "";
  }

  function isUrgent(customer) {
    return Boolean(customer && customer.priority === "urgent" && customer.status !== "done");
  }

  function isReminderDue(customer) {
    if (!customer || !customer.reminderDate || customer.status === "done") {
      return false;
    }

    const today = getDateOnly(new Date());
    const reminderDate = getDateOnly(customer.reminderDate);

    return reminderDate <= today;
  }

  function getReminderInfo(customer) {
    if (!customer || !customer.reminderType || !customer.reminderDate) {
      return {
        text: "",
        className: ""
      };
    }

    const today = getDateOnly(new Date());
    const reminderDate = getDateOnly(customer.reminderDate);
    const diffDays = getDayDifference(today, reminderDate);
    const reminderType = translateStoredReminderType(customer.reminderType);

    if (diffDays < 0) {
      return {
        text: translate("reminderOverdue", "{type} ist seit {days} Tag(en) überfällig.", {
          type: reminderType,
          days: Math.abs(diffDays)
        }),
        className: "reminder-overdue"
      };
    }

    if (diffDays === 0) {
      return {
        text: translate("reminderToday", "{type} ist heute fällig.", {
          type: reminderType
        }),
        className: "reminder-today"
      };
    }

    if (diffDays <= 3) {
      return {
        text: translate("reminderSoon", "{type} in {days} Tag(en).", {
          type: reminderType,
          days: diffDays
        }),
        className: "reminder-soon"
      };
    }

    return {
      text: translate("reminderDate", "{type} am {date}.", {
        type: reminderType,
        date: formatDate(customer.reminderDate)
      }),
      className: "reminder-normal"
    };
  }

  function getImportantCustomers(customers) {
    if (!Array.isArray(customers)) {
      return [];
    }

    return customers
      .filter(customer => {
        return customer.status !== "done" && (isUrgent(customer) || isReminderDue(customer));
      })
      .sort((a, b) => {
        const priorityOrder = {
          urgent: 0,
          high: 1,
          normal: 2
        };

        const priorityA = priorityOrder[a.priority] ?? 3;
        const priorityB = priorityOrder[b.priority] ?? 3;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        return new Date(a.reminderDate || a.nextDate || 0) - new Date(b.reminderDate || b.nextDate || 0);
      });
  }

  function groupCustomersByDate(customers) {
    const grouped = {};

    if (!Array.isArray(customers)) {
      return grouped;
    }

    customers.forEach(customer => {
      if (!customer.nextDate) {
        return;
      }

      if (!grouped[customer.nextDate]) {
        grouped[customer.nextDate] = [];
      }

      grouped[customer.nextDate].push(customer);
    });

    return grouped;
  }

  function getUpcomingCustomers(customers, days = 7) {
    if (!Array.isArray(customers)) {
      return [];
    }

    const today = getDateOnly(new Date());

    return customers
      .filter(customer => {
        if (!customer.nextDate) {
          return false;
        }

        const nextDate = getDateOnly(customer.nextDate);
        const diffDays = getDayDifference(today, nextDate);

        return diffDays >= 0 && diffDays <= days;
      })
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
  }

  function countOpenCustomers(customers) {
    return customers.filter(customer => customer.status !== "done").length;
  }

  function countDoneCustomers(customers) {
    return customers.filter(customer => customer.status === "done").length;
  }

  function countUrgentCustomers(customers) {
    return customers.filter(customer => isUrgent(customer)).length;
  }

  function countDueReminders(customers) {
    return customers.filter(customer => isReminderDue(customer)).length;
  }

  function matchesSearch(customer, searchText) {
    if (!searchText) {
      return true;
    }

    const text = `
      ${customer.name || ""}
      ${customer.city || ""}
      ${customer.address || ""}
      ${customer.phone || ""}
      ${customer.email || ""}
      ${customer.system || ""}
      ${translateStoredSystem(customer.system) || ""}
      ${customer.machineType || ""}
      ${customer.laneCount || ""}
      ${customer.maintenancePerLane || ""}
      ${customer.serviceType || ""}
      ${translateStoredServiceType(customer.serviceType) || ""}
      ${customer.priority || ""}
      ${getPriorityLabel(customer.priority) || ""}
      ${customer.status || ""}
      ${getStatusLabel(customer.status) || ""}
      ${customer.assignedTo || ""}
      ${customer.reminderType || ""}
      ${translateStoredReminderType(customer.reminderType) || ""}
      ${customer.note || ""}
    `.toLowerCase();

    return text.includes(searchText.toLowerCase());
  }

  function formatDate(dateString) {
    if (!dateString) {
      return translate("notSpecified", "Nicht angegeben");
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return translate("notSpecified", "Nicht angegeben");
    }

    return date.toLocaleDateString(getLocale());
  }

  function getDateOnly(value) {
    const date = new Date(value);

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function getDayDifference(startDate, targetDate) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.ceil((targetDate - startDate) / millisecondsPerDay);
  }

  function translateStoredSystem(value) {
    const map = {
      "Bowlingbahn": "systemBowling",
      "Kegelbahn": "systemSkittles",
      "Bowling- und Kegelbahn": "systemBoth"
    };

    return map[value] ? translate(map[value], value) : value;
  }

  function translateStoredServiceType(value) {
    const map = {
      "Wartung": "serviceMaintenance",
      "Reparatur": "serviceRepair",
      "Rückruf": "serviceCallback",
      "Angebot": "serviceOffer",
      "Kontrolle": "serviceInspection"
    };

    return map[value] ? translate(map[value], value) : value;
  }

  function translateStoredReminderType(value) {
    const map = {
      "Kunde anrufen": "reminderCall",
      "E-Mail schreiben": "reminderEmail",
      "Wartung fällig": "reminderMaintenance",
      "Rückmeldung offen": "reminderFeedback",
      "Termin bestätigen": "reminderConfirm"
    };

    return map[value] ? translate(map[value], value) : value;
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
    getStatusLabel,
    getStatusBadgeClass,

    getPriorityLabel,
    getPriorityClass,
    getPriorityBadgeClass,

    isUrgent,
    isReminderDue,
    getReminderInfo,
    getImportantCustomers,

    groupCustomersByDate,
    getUpcomingCustomers,

    countOpenCustomers,
    countDoneCustomers,
    countUrgentCustomers,
    countDueReminders,

    matchesSearch,
    formatDate,

    translateStoredSystem,
    translateStoredServiceType,
    translateStoredReminderType
  };
})();