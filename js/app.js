document.addEventListener("DOMContentLoaded", () => {
  StorageService.ensureDefaultData();

  const savedTheme = StorageService.getTheme();
  UIService.applyTheme(savedTheme);

  bindGlobalEvents();
  bindNavigation();
  bindForms();

  if (typeof CalendarService !== "undefined") {
    CalendarService.bindEvents();
  }

  if (typeof TechnicianService !== "undefined") {
    TechnicianService.bindEvents();
  }

  if (typeof DragDropService !== "undefined") {
    DragDropService.initialize();
  }

  CustomerService.renderAll();
  AuthService.refreshAssignableUserSelects();

  showLoginView();
});

function bindGlobalEvents() {
  UIService.getElement("openMenuButton")?.addEventListener("click", () => {
    UIService.openMenu();
  });

  UIService.getElement("closeMenuButton")?.addEventListener("click", () => {
    UIService.closeMenu();
  });

  UIService.getElement("menuOverlay")?.addEventListener("click", () => {
    UIService.closeMenu();
  });

  UIService.getElement("themeButton")?.addEventListener("click", () => {
    UIService.toggleTheme();
  });

  UIService.getElement("themeButtonSettings")?.addEventListener("click", () => {
    UIService.toggleTheme();
  });

  UIService.getElement("logoutButton")?.addEventListener("click", handleLogout);

  UIService.getElement("helpMenuButton")?.addEventListener("click", () => {
    UIService.openModal("helpModal");
  });

  UIService.getElement("floatingHelpButton")?.addEventListener("click", () => {
    UIService.openModal("helpModal");
  });

  UIService.getElement("closeHelpButton")?.addEventListener("click", () => {
    UIService.closeModal("helpModal");
  });

  UIService.getElement("closeDetailButton")?.addEventListener("click", () => {
    UIService.closeModal("customerDetailModal");
  });

  UIService.getElement("closeEditButton")?.addEventListener("click", () => {
    UIService.closeModal("editCustomerModal");
  });

  UIService.getElement("closeReportButton")?.addEventListener("click", () => {
    UIService.closeModal("reportModal");
  });

  UIService.getElement("printReportButton")?.addEventListener("click", () => {
    window.print();
  });

  UIService.getElement("loadDemoDataButton")?.addEventListener("click", () => {
    const confirmed = confirm("Demo-Daten laden? Bestehende Demo-Daten werden ersetzt.");

    if (!confirmed) {
      return;
    }

    StorageService.loadDemoData();
    CustomerService.renderAll();
    UIService.showToast("Demo-Daten wurden geladen.");
  });

  UIService.getElement("resetDataButton")?.addEventListener("click", () => {
    const confirmed = confirm("Alle Kunden und Demo-Daten wirklich löschen?");

    if (!confirmed) {
      return;
    }

    StorageService.resetAllData();
    CustomerService.renderAll();
    AuthService.renderAccounts();
    AuthService.refreshAssignableUserSelects();

    UIService.showToast("Demo-Daten wurden zurückgesetzt.");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      UIService.closeAllModals();
      UIService.closeMenu();
    }

    const loginIsVisible = !UIService.getElement("loginView")?.classList.contains("hidden");

    if (loginIsVisible && event.key === "Enter") {
      handleLogin();
    }
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
      }
    });
  });

  UIService.getElement("customersList")?.addEventListener("click", CustomerService.handleListClick);
  UIService.getElement("reportsList")?.addEventListener("click", CustomerService.handleListClick);
  UIService.getElement("dashboardImportantList")?.addEventListener("click", CustomerService.handleListClick);
  UIService.getElement("importantList")?.addEventListener("click", CustomerService.handleListClick);
  UIService.getElement("customerDetailContent")?.addEventListener("click", CustomerService.handleListClick);

  document.querySelectorAll(".board-list").forEach(list => {
    list.addEventListener("click", CustomerService.handleListClick);
  });

  UIService.getElement("customerSearch")?.addEventListener("input", () => {
    CustomerService.renderCustomers();
  });

  UIService.getElement("statusFilter")?.addEventListener("change", () => {
    CustomerService.renderCustomers();
  });
}

function bindNavigation() {
  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
      const page = button.dataset.page;

      if (!page) {
        return;
      }

      UIService.showPage(page);
    });
  });

  document.querySelectorAll("[data-page-target]").forEach(button => {
    button.addEventListener("click", () => {
      const page = button.dataset.pageTarget;

      if (!page) {
        return;
      }

      UIService.showPage(page);
    });
  });
}

function bindForms() {
  UIService.getElement("loginButton")?.addEventListener("click", handleLogin);

  UIService.getElement("customerForm")?.addEventListener("submit", event => {
    event.preventDefault();
    CustomerService.createCustomerFromForm();
  });

  UIService.getElement("editCustomerForm")?.addEventListener("submit", event => {
    event.preventDefault();
    CustomerService.saveEditedCustomer();
  });

  UIService.getElement("accountForm")?.addEventListener("submit", event => {
    event.preventDefault();
    handleAccountCreation();
  });
}

function handleLogin() {
  const email = UIService.getValue("loginEmail");
  const password = UIService.getValue("loginPassword");

  const result = AuthService.login(email, password);

  if (!result.success) {
    UIService.showToast(result.message);
    return;
  }

  AuthService.updateUserDisplay();

  showWelcomeScreen(() => {
    showAppView();
    CustomerService.renderAll();
    UIService.showPage("dashboardPage");
    UIService.showToast(`Willkommen zurück, ${result.user.name}.`);
  });
}

function handleLogout() {
  const confirmed = confirm("Möchtest du dich wirklich abmelden?");

  if (!confirmed) {
    return;
  }

  AuthService.logout();

  UIService.closeAllModals();
  UIService.closeMenu();

  UIService.setValue("loginEmail", "");
  UIService.setValue("loginPassword", "");

  showLoginView();

  UIService.showToast("Du wurdest abgemeldet.");
}

function handleAccountCreation() {
  const name = UIService.getValue("accountName");
  const email = UIService.getValue("accountEmail");
  const password = UIService.getValue("accountPassword");
  const role = UIService.getRawValue("accountRole");

  const result = AuthService.createAccount({
    name,
    email,
    password,
    role
  });

  UIService.showToast(result.message);

  if (!result.success) {
    return;
  }

  UIService.resetForm("accountForm");

  AuthService.renderAccounts();
  AuthService.refreshAssignableUserSelects();
}

function showLoginView() {
  UIService.showElement("loginView");
  UIService.hideElement("welcomeView");
  UIService.hideElement("appView");
}

function showWelcomeScreen(callback) {
  UIService.hideElement("loginView");
  UIService.showElement("welcomeView");
  UIService.hideElement("appView");

  setTimeout(() => {
    callback();
  }, 1800);
}

function showAppView() {
  UIService.hideElement("loginView");
  UIService.hideElement("welcomeView");
  UIService.showElement("appView");
}