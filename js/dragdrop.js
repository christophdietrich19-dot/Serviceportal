const DragDropService = (() => {
  let draggedCustomerId = null;

  function initialize() {
    setupColumn("boardOpenList", "open");
    setupColumn("boardProgressList", "progress");
    setupColumn("boardDoneList", "done");
  }

  function makeCardDraggable(card, customerId) {
    if (!card || !customerId) {
      return;
    }

    card.setAttribute("draggable", "true");

    card.addEventListener("dragstart", () => {
      draggedCustomerId = customerId;
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      draggedCustomerId = null;
      card.classList.remove("dragging");
    });
  }

  function setupColumn(elementId, newStatus) {
    const column = UIService.getElement(elementId);

    if (!column) {
      return;
    }

    column.addEventListener("dragover", event => {
      event.preventDefault();
      column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("drag-over");
    });

    column.addEventListener("drop", event => {
      event.preventDefault();
      column.classList.remove("drag-over");

      if (!draggedCustomerId) {
        return;
      }

      moveCustomerToStatus(draggedCustomerId, newStatus);
    });
  }

  function moveCustomerToStatus(customerId, newStatus) {
    const updates = {
      status: newStatus,
      updatedBy: AuthService.getCurrentUserName()
    };

    if (newStatus === "done") {
      updates.completedAt = new Date().toISOString();
    }

    if (newStatus !== "done") {
      updates.completedAt = null;
    }

    StorageService.updateCustomer(customerId, updates);

    CustomerService.renderAll();

    UIService.showToast(
      translate("toastStatusChanged", "Status geändert: {status}", {
        status: ReminderService.getStatusLabel(newStatus)
      })
    );
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
    initialize,
    makeCardDraggable
  };
})();