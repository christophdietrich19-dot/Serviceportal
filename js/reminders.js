const ReminderService = (() => {
  function getStatusLabel(status) {
    const labels = {
      open: "Offen",
      progress: "In Bearbeitung",
      done: "Erledigt"
    };

    return labels[status] || "Offen";
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
      normal: "Normal",
      high: "Hoch",
      urgent: "Dringend"
    };

    return labels[priority] || "Normal";
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

    if (diffDays < 0) {
      return {
        text: `${customer.reminderType} ist seit ${Math.abs(diffDays)} Tag(en) überfällig.`,
        className: "reminder-overdue"
      };
    }

    if (diffDays === 0) {
      return {
        text: `${customer.reminderType} ist heute fällig.`,
        className: "reminder-today"
      };
    }

    if (diffDays <= 3) {
      return {
        text: `${customer.reminderType} in ${diffDays} Tag(en).`,
        className: "reminder-soon"
      };
    }

    return {
      text: `${customer.reminderType} am ${formatDate(customer.reminderDate)}.`,
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
      ${customer.machineType || ""}
      ${customer.laneCount || ""}
      ${customer.maintenancePerLane || ""}
      ${customer.serviceType || ""}
      ${customer.priority || ""}
      ${customer.status || ""}
      ${customer.assignedTo || ""}
      ${customer.note || ""}
    `.toLowerCase();

    return text.includes(searchText.toLowerCase());
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "Nicht angegeben";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Nicht angegeben";
    }

    return date.toLocaleDateString("de-DE");
  }

  function getDateOnly(value) {
    const date = new Date(value);

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function getDayDifference(startDate, targetDate) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.ceil((targetDate - startDate) / millisecondsPerDay);
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
    formatDate
  };
})();