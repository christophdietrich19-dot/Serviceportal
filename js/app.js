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

  configureDashboardStatCards();
  startDemoSession();
});

function startDemoSession() {
  StorageService.ensureDefaultData();

  const result = AuthService.login("admin@demo.de", "admin123");

  if (!result.success) {
    StorageService.resetAllData();

    const retryResult = AuthService.login("admin@demo.de", "admin123");

    if (!retryResult.success) {
      showLoginView();
      UIService.showToast(retryResult.message || getTranslation("toastLoginFailed"));
      return;
    }

    startDemoApp(retryResult.user);
    return;
  }

  startDemoApp(result.user);
}

function startDemoApp(user) {
  AuthService.updateUserDisplay();

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  configureDashboardStatCards();

  showWelcomeScreen(() => {
    showAppView();

    CustomerService.renderAll();
    UIService.showPage("dashboardPage");

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }

    configureDashboardStatCards();

    UIService.showToast(getTranslation("toastWelcome", {
      name: user.name
    }));

    showUpdateModalAfterLogin();
  });
}

function configureDashboardStatCards() {
  injectDashboardStatCardStyles();
  ensureDashboardStatPreviewModal();

  const cards = [
    {
      element: UIService.getElement("customerCount")?.closest(".stat-card"),
      type: "customers",
      page: "customersPage",
      labelDe: "Kunden und Servicefälle öffnen",
      labelEn: "Open customers and service cases"
    },
    {
      element: UIService.getElement("openCount")?.closest(".stat-card"),
      type: "open",
      page: "statusBoardPage",
      labelDe: "Statusboard öffnen",
      labelEn: "Open status board"
    },
    {
      element: UIService.getElement("dueCount")?.closest(".stat-card"),
      type: "due",
      page: "remindersPage",
      labelDe: "Fällige Erinnerungen öffnen",
      labelEn: "Open due reminders"
    },
    {
      element: UIService.getElement("urgentCount")?.closest(".stat-card"),
      type: "urgent",
      page: "remindersPage",
      labelDe: "Dringende Fälle öffnen",
      labelEn: "Open urgent cases"
    },
    {
      element: UIService.getElement("accountCount")?.closest(".stat-card"),
      type: "accounts",
      page: "teamPage",
      labelDe: "Mitarbeiterkonten öffnen",
      labelEn: "Open team accounts"
    }
  ];

  cards.forEach(cardConfig => {
    const card = cardConfig.element;

    if (!card) {
      return;
    }

    card.classList.add("dashboard-stat-card-link");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", getLanguageForDashboardCards() === "en" ? cardConfig.labelEn : cardConfig.labelDe);

    card.onclick = () => {
      openDashboardStatPreview(cardConfig);
    };

    if (card.dataset.keyboardBound === "true") {
      return;
    }

    card.dataset.keyboardBound = "true";

    card.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openDashboardStatPreview(cardConfig);
    });
  });
}

function injectDashboardStatCardStyles() {
  const styleId = "dashboardStatCardNavigationStyles";

  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement("style");
  style.id = styleId;

  style.textContent = `
    #dashboardPage .stat-card.dashboard-stat-card-link {
      cursor: pointer;
      user-select: none;
    }

    #dashboardPage .stat-card.dashboard-stat-card-link:hover,
    #dashboardPage .stat-card.dashboard-stat-card-link:focus {
      background: #ffffff;
      transform: translateY(-4px) scale(1.015);
      box-shadow: 0 22px 56px rgba(20, 30, 40, 0.13);
      border-color: rgba(216, 155, 61, 0.36);
    }

    body.dark #dashboardPage .stat-card.dashboard-stat-card-link:hover,
    body.dark #dashboardPage .stat-card.dashboard-stat-card-link:focus {
      background: #1f2d3d;
    }

    #dashboardPage .stat-card.dashboard-stat-card-link:focus {
      outline: none;
      box-shadow: 0 0 0 4px rgba(216, 155, 61, 0.16), 0 22px 56px rgba(20, 30, 40, 0.13);
    }

    .stat-preview-card {
      max-width: 720px;
    }

    .stat-preview-hero {
      background:
        radial-gradient(circle at top right, rgba(216, 155, 61, 0.14), transparent 40%),
        linear-gradient(135deg, rgba(148, 163, 184, 0.10), rgba(148, 163, 184, 0.04));
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 22px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 18px;
    }

    .stat-preview-hero h3 {
      margin: 6px 0;
      font-size: 30px;
      line-height: 1.15;
    }

    .stat-preview-hero p {
      margin: 0;
      color: var(--muted);
      line-height: 1.55;
    }

    .stat-preview-number {
      min-width: 86px;
      height: 86px;
      border-radius: 24px;
      background: rgba(216, 155, 61, 0.16);
      color: var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      font-weight: 900;
      line-height: 1;
    }

    .stat-preview-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
    }

    .stat-preview-item {
      background: rgba(148, 163, 184, 0.09);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
    }

    .stat-preview-item h4 {
      margin: 0 0 6px;
      font-size: 17px;
    }

    .stat-preview-item p {
      margin: 4px 0;
      color: var(--muted);
      line-height: 1.45;
    }

    .stat-preview-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 20px;
    }

    @media (max-width: 800px) {
      .stat-preview-hero,
      .stat-preview-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .stat-preview-number {
        width: 76px;
        height: 76px;
        min-width: 76px;
        font-size: 36px;
      }
    }
  `;

  document.head.appendChild(style);
}

function ensureDashboardStatPreviewModal() {
  if (UIService.getElement("dashboardStatPreviewModal")) {
    return;
  }

  const modal = document.createElement("section");

  modal.id = "dashboardStatPreviewModal";
  modal.className = "modal hidden";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  modal.innerHTML = `
    <div class="modal-card stat-preview-card">
      <div class="modal-header">
        <div>
          <p id="dashboardStatPreviewEyebrow" class="eyebrow">Dashboard</p>
          <h2 id="dashboardStatPreviewTitle">Übersicht</h2>
        </div>

        <button id="closeDashboardStatPreviewButton" class="icon-button" type="button" aria-label="Schließen">×</button>
      </div>

      <div id="dashboardStatPreviewContent"></div>
    </div>
  `;

  document.body.appendChild(modal);

  UIService.getElement("closeDashboardStatPreviewButton")?.addEventListener("click", () => {
    UIService.closeModal("dashboardStatPreviewModal");
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      UIService.closeModal("dashboardStatPreviewModal");
    }
  });
}

function openDashboardStatPreview(cardConfig) {
  ensureDashboardStatPreviewModal();

  const titleElement = UIService.getElement("dashboardStatPreviewTitle");
  const eyebrowElement = UIService.getElement("dashboardStatPreviewEyebrow");
  const contentElement = UIService.getElement("dashboardStatPreviewContent");

  if (!titleElement || !eyebrowElement || !contentElement) {
    return;
  }

  const preview = createDashboardStatPreviewData(cardConfig);

  eyebrowElement.textContent = languageText("Schnellübersicht", "Quick Overview");
  titleElement.textContent = preview.title;
  contentElement.innerHTML = preview.html;

  const actionButton = contentElement.querySelector("[data-stat-preview-target]");

  if (actionButton) {
    actionButton.addEventListener("click", () => {
      UIService.closeModal("dashboardStatPreviewModal");
      navigateToDashboardCardTarget(actionButton.dataset.statPreviewTarget);
    });
  }

  UIService.openModal("dashboardStatPreviewModal");
}

function createDashboardStatPreviewData(cardConfig) {
  const customers = StorageService.getCustomers();
  const accounts = StorageService.getAccounts();

  const openCustomers = customers.filter(customer => customer.status !== "done");
  const dueCustomers = customers.filter(customer => ReminderService.isReminderDue(customer));
  const urgentCustomers = customers.filter(customer => ReminderService.isUrgent(customer));

  if (cardConfig.type === "customers") {
    return createPreviewBlock({
      title: languageText("Kunden & Anlagen", "Customers & Systems"),
      subtitle: languageText("Gespeicherte Kunden und Servicefälle im Portal.", "Saved customers and service cases in the portal."),
      count: customers.length,
      list: customers.slice(0, 4),
      emptyText: languageText("Noch keine Kunden oder Servicefälle eingetragen.", "No customers or service cases have been added yet."),
      targetPage: "customersPage",
      buttonText: languageText("Zur Kundenübersicht", "Open customer overview"),
      itemType: "customer"
    });
  }

  if (cardConfig.type === "open") {
    return createPreviewBlock({
      title: languageText("Offene Fälle", "Open Cases"),
      subtitle: languageText("Aktive Servicefälle, die noch nicht abgeschlossen sind.", "Active service cases that have not been completed yet."),
      count: openCustomers.length,
      list: openCustomers.slice(0, 4),
      emptyText: languageText("Aktuell sind keine offenen Servicefälle vorhanden.", "There are currently no open service cases."),
      targetPage: "statusBoardPage",
      buttonText: languageText("Zum Statusboard", "Open status board"),
      itemType: "customer"
    });
  }

  if (cardConfig.type === "due") {
    return createPreviewBlock({
      title: languageText("Fällige Erinnerungen", "Due Reminders"),
      subtitle: languageText("Aufgaben, Rückmeldungen oder Termine, die jetzt Aufmerksamkeit brauchen.", "Tasks, follow-ups, or appointments that need attention now."),
      count: dueCustomers.length,
      list: dueCustomers.slice(0, 4),
      emptyText: languageText("Aktuell sind keine Erinnerungen fällig.", "There are currently no due reminders."),
      targetPage: "remindersPage",
      buttonText: languageText("Heute wichtig öffnen", "Open important items"),
      itemType: "customer"
    });
  }

  if (cardConfig.type === "urgent") {
    return createPreviewBlock({
      title: languageText("Dringende Fälle", "Urgent Cases"),
      subtitle: languageText("Servicefälle mit hoher Priorität oder dringendem Handlungsbedarf.", "Service cases with high priority or urgent action required."),
      count: urgentCustomers.length,
      list: urgentCustomers.slice(0, 4),
      emptyText: languageText("Aktuell sind keine dringenden Fälle vorhanden.", "There are currently no urgent cases."),
      targetPage: "remindersPage",
      buttonText: languageText("Heute wichtig öffnen", "Open important items"),
      itemType: "customer"
    });
  }

  return createPreviewBlock({
    title: languageText("Benutzerkonten", "User Accounts"),
    subtitle: languageText("Angelegte Zugänge für Admins und Mitarbeiter.", "Created accounts for administrators and employees."),
    count: accounts.length,
    list: accounts.slice(0, 4),
    emptyText: languageText("Noch keine Benutzerkonten vorhanden.", "No user accounts available yet."),
    targetPage: "teamPage",
    buttonText: languageText("Zur Mitarbeiterverwaltung", "Open team management"),
    itemType: "account"
  });
}

function createPreviewBlock({ title, subtitle, count, list, emptyText, targetPage, buttonText, itemType }) {
  const listHtml = list.length === 0
    ? `<p class="empty">${emptyText}</p>`
    : list.map(item => {
        if (itemType === "account") {
          return createAccountPreviewItem(item);
        }

        return createCustomerPreviewItem(item);
      }).join("");

  return {
    title,
    html: `
      <div class="stat-preview-hero">
        <div>
          <p class="eyebrow">${languageText("Dashboard Schnellzugriff", "Dashboard Shortcut")}</p>
          <h3>${title}</h3>
          <p>${subtitle}</p>
        </div>

        <div class="stat-preview-number">${count}</div>
      </div>

      <div class="stat-preview-list">
        ${listHtml}
      </div>

      <div class="stat-preview-actions">
        <button class="action-button report-button" type="button" data-stat-preview-target="${targetPage}">
          ${buttonText}
        </button>
      </div>
    `
  };
}

function createCustomerPreviewItem(customer) {
  return `
    <article class="stat-preview-item">
      <div>
        <h4>${ReportService.escapeHtml(customer.name)}</h4>
        <p>
          ${ReportService.escapeHtml(customer.city || languageText("Ort offen", "City not specified"))}
          · ${ReminderService.translateStoredServiceType(customer.serviceType) || languageText("Servicefall", "Service case")}
        </p>
        <p>
          ${languageText("Termin", "Appointment")}: 
          ${customer.nextDate ? ReminderService.formatDate(customer.nextDate) : languageText("Noch offen", "Not scheduled yet")}
        </p>
        <p>
          ${languageText("Zugewiesen an", "Assigned to")}: 
          ${ReportService.escapeHtml(customer.assignedTo || languageText("Nicht zugewiesen", "Not assigned"))}
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
    </article>
  `;
}

function createAccountPreviewItem(account) {
  return `
    <article class="stat-preview-item">
      <div>
        <h4>${ReportService.escapeHtml(account.name)}</h4>
        <p>${ReportService.escapeHtml(account.email)}</p>
        <p>${languageText("Rolle", "Role")}: ${AuthService.getRoleLabel(account.role)}</p>
      </div>

      <div class="badges">
        <span class="badge ${account.role === "admin" ? "badge-gold" : ""}">
          ${AuthService.getRoleLabel(account.role)}
        </span>

        <span class="badge ${account.active === false ? "badge-red" : "badge-green"}">
          ${account.active === false
            ? languageText("Inaktiv", "Inactive")
            : languageText("Aktiv", "Active")}
        </span>
      </div>
    </article>
  `;
}

function navigateToDashboardCardTarget(page) {
  if (!page) {
    return;
  }

  UIService.showPage(page);

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  configureDashboardStatCards();
}

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

    configureDashboardStatCards();
  });

  UIService.getElement("themeButtonSettings")?.addEventListener("click", () => {
    UIService.toggleTheme();

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }

    configureDashboardStatCards();
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

    configureDashboardStatCards();
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

    configureDashboardStatCards();
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

    configureDashboardStatCards();
  });

  UIService.getElement("statusFilter")?.addEventListener("change", () => {
    CustomerService.renderCustomers();

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }

    configureDashboardStatCards();
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

      configureDashboardStatCards();
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

      configureDashboardStatCards();
    });
  });
}

function bindForms() {
  UIService.getElement("loginButton")?.addEventListener("click", handleLogin);

  UIService.getElement("customerForm")?.addEventListener("submit", event => {
    event.preventDefault();

    CustomerService.createCustomerFromForm();
    configureDashboardStatCards();
  });

  UIService.getElement("editCustomerForm")?.addEventListener("submit", event => {
    event.preventDefault();

    CustomerService.saveEditedCustomer();
    configureDashboardStatCards();
  });

  UIService.getElement("accountForm")?.addEventListener("submit", event => {
    event.preventDefault();

    handleAccountCreation();
    configureDashboardStatCards();
  });
}

function handleLogin() {
  const email = UIService.getValue("loginEmail");
  const password = UIService.getValue("loginPassword");

  const result = AuthService.login(email, password);

  if (!result.success) {
    UIService.showToast(result.message || getTranslation("toastLoginFailed"));
    return;
  }

  AuthService.updateUserDisplay();

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  configureDashboardStatCards();

  showWelcomeScreen(() => {
    showAppView();

    CustomerService.renderAll();
    UIService.showPage("dashboardPage");

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();
    }

    configureDashboardStatCards();

    UIService.showToast(getTranslation("toastWelcome", {
      name: result.user.name
    }));

    showUpdateModalAfterLogin();
  });
}

function handleLogout() {
  const confirmed = confirm(getLanguageForDashboardCards() === "en"
    ? "Restart the demo session?"
    : "Demo Sitzung neu starten?"
  );

  if (!confirmed) {
    return;
  }

  AuthService.logout();
  UIService.closeAllModals();
  UIService.closeMenu();

  startDemoSession();
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

  configureDashboardStatCards();
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
  configureDashboardStatCards();
}

function showUpdateModalAfterLogin() {
  setTimeout(() => {
    if (AuthService.isLoggedIn()) {
      UIService.openModal("updateModal");

      if (typeof I18nService !== "undefined") {
        I18nService.applyLanguage();
      }

      configureDashboardStatCards();
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

  configureDashboardStatCards();
}

function showWelcomeScreen(callback) {
  UIService.hideElement("loginView");
  UIService.showElement("welcomeView");
  UIService.hideElement("appView");

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  configureDashboardStatCards();

  setTimeout(() => {
    callback();
  }, 900);
}

function showAppView() {
  UIService.hideElement("loginView");
  UIService.hideElement("welcomeView");
  UIService.showElement("appView");

  if (typeof I18nService !== "undefined") {
    I18nService.applyLanguage();
  }

  configureDashboardStatCards();
}

function getTranslation(key, replacements = {}) {
  if (typeof I18nService === "undefined") {
    return key;
  }

  return I18nService.t(key, replacements);
}

function getLanguageForDashboardCards() {
  if (typeof I18nService === "undefined") {
    return "de";
  }

  return I18nService.getLanguage();
}

function languageText(german, english) {
  return getLanguageForDashboardCards() === "en" ? english : german;
}