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

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  CustomerService.renderAll();
  AuthService.refreshAssignableUserSelects();

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

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

  UIService.getElement("loginLanguageButton")?.addEventListener("click", () => {
    handleLanguageToggle(false);
  });

  UIService.getElement("languageButton")?.addEventListener("click", () => {
    handleLanguageToggle(true);
  });

  UIService.getElement("languageButtonSettings")?.addEventListener("click", () => {
    handleLanguageToggle(true);
  });

  UIService.getElement("themeButton")?.addEventListener("click", () => {
    UIService.toggleTheme();

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }
  });

  UIService.getElement("themeButtonSettings")?.addEventListener("click", () => {
    UIService.toggleTheme();

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }
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

  UIService.getElement("closeUpdateButton")?.addEventListener("click", () => {
    UIService.closeModal("updateModal");
  });

  UIService.getElement("confirmUpdateButton")?.addEventListener("click", () => {
    UIService.closeModal("updateModal");
  });

  UIService.getElement("printReportButton")?.addEventListener("click", () => {
    window.print();
  });

  UIService.getElement("loadDemoDataButton")?.addEventListener("click", () => {
    const confirmed = confirm(getTranslation("confirmLoadDemo"));

    if (!confirmed) {
      return;
    }

    StorageService.loadDemoData();
    CustomerService.renderAll();

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }

    UIService.showToast(getTranslation("toastDemoLoaded"));
  });

  UIService.getElement("resetDataButton")?.addEventListener("click", () => {
    const confirmed = confirm(getTranslation("confirmResetDemo"));

    if (!confirmed) {
      return;
    }

    StorageService.resetAllData();

    CustomerService.renderAll();
    AuthService.renderAccounts();
    AuthService.refreshAssignableUserSelects();

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }

    UIService.showToast(getTranslation("toastDemoReset"));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      UIService.closeAllModals();
      UIService.closeMenu();
    }

    const loginView = UIService.getElement("loginView");
    const loginIsVisible = loginView && !loginView.classList.contains("hidden");

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

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }
  });

  UIService.getElement("statusFilter")?.addEventListener("change", () => {
    CustomerService.renderCustomers();

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }
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

      if (typeof I18nService !== "undefined") {
        I18nService.applyLanguage();
      }
    });
  });

  document.querySelectorAll("[data-page-target]").forEach(button => {
    button.addEventListener("click", () => {
      const page = button.dataset.pageTarget;

      if (!page) {
        return;
      }

      UIService.showPage(page);

      if (typeof I18nService !== "undefined") {
        I18nService.applyLanguage();
      }
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
    UIService.showToast(getTranslation("toastLoginFailed"));
    return;
  }

  AuthService.updateUserDisplay();

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  showWelcomeScreen(() => {
    showAppView();

    CustomerService.renderAll();
    UIService.showPage("dashboardPage");

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }

    UIService.showToast(getTranslation("toastWelcome", {
      name: result.user.name
    }));

    showUpdateModalAfterLogin();
  });
}

function handleLogout() {
  const confirmed = confirm(getTranslation("confirmLogout"));

  if (!confirmed) {
    return;
  }

  AuthService.logout();

  UIService.closeAllModals();
  UIService.closeMenu();

  UIService.setValue("loginEmail", "");
  UIService.setValue("loginPassword", "");

  showLoginView();

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  UIService.showToast(getTranslation("toastLoggedOut"));
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

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }
}

function handleLanguageToggle(refreshApp) {
  if (typeof I18nService === "undefined") {
    return;
  }

  I18nService.toggleLanguage();

  if (refreshApp) {
    CustomerService.renderAll();

    if (AuthService.isLoggedIn()) {
      AuthService.updateUserDisplay();
      AuthService.refreshAssignableUserSelects();
    }
  }

  I18nService.applyLanguage();
}

function showUpdateModalAfterLogin() {
  setTimeout(() => {
    if (AuthService.isLoggedIn()) {
      UIService.openModal("updateModal");

      if (typeof I18nService !== "undefined") {
        I18nService.applyLanguage();
      }
    }
  }, 400);
}

function showLoginView() {
  UIService.showElement("loginView");
  UIService.hideElement("welcomeView");
  UIService.hideElement("appView");

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }
}

function showWelcomeScreen(callback) {
  UIService.hideElement("loginView");
  UIService.showElement("welcomeView");
  UIService.hideElement("appView");

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  setTimeout(() => {
    callback();
  }, 1800);
}

function showAppView() {
  UIService.hideElement("loginView");
  UIService.hideElement("welcomeView");
  UIService.showElement("appView");

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }
}

function getTranslation(key, replacements = {}) {
  if (typeof I18nService === "undefined") {
    return key;
  }

  return I18nService.t(key, replacements);
}