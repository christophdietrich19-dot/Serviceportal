const AuthService = (() => {
  let currentUser = null;

  function login(email, password) {
    const accounts = StorageService.getAccounts();

    const user = accounts.find(account => {
      return account.email === email && account.password === password;
    });

    if (!user) {
      return {
        success: false,
        message: translate("toastLoginFailed", "Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen.")
      };
    }

    if (user.active === false) {
      return {
        success: false,
        message: getLanguage() === "en"
          ? "This account is currently inactive."
          : "Dieses Konto ist aktuell deaktiviert."
      };
    }

    currentUser = user;

    return {
      success: true,
      user
    };
  }

  function logout() {
    currentUser = null;
  }

  function getCurrentUser() {
    return currentUser;
  }

  function isLoggedIn() {
    return Boolean(currentUser);
  }

  function isAdmin() {
    return Boolean(currentUser && currentUser.role === "admin");
  }

  function getCurrentUserName() {
    return currentUser ? currentUser.name : translate("unknown", "Unbekannt");
  }

  function getRoleLabel(role) {
    const labels = {
      admin: translate("roleAdmin", "Admin"),
      employee: translate("roleEmployee", "Mitarbeiter")
    };

    return labels[role] || translate("roleEmployee", "Mitarbeiter");
  }

  function createAccount({ name, email, password, role }) {
    if (!isAdmin()) {
      return {
        success: false,
        message: translate("toastOnlyAdminsAccounts", "Nur Admins dürfen Mitarbeiterkonten anlegen.")
      };
    }

    if (!name || !email || !password) {
      return {
        success: false,
        message: translate("toastAccountMissing", "Bitte Name, E-Mail und Passwort ausfüllen.")
      };
    }

    const accounts = StorageService.getAccounts();

    const emailExists = accounts.some(account => {
      return account.email.toLowerCase() === email.toLowerCase();
    });

    if (emailExists) {
      return {
        success: false,
        message: translate("toastEmailExists", "Diese E-Mail ist bereits vergeben.")
      };
    }

    const account = StorageService.addAccount({
      name,
      email,
      password,
      role: role || "employee",
      active: true
    });

    return {
      success: true,
      account,
      message: translate("toastAccountCreated", "Mitarbeiterkonto wurde angelegt.")
    };
  }

  function getAssignableUsers() {
    return StorageService.getAccounts()
      .filter(account => account.active !== false)
      .map(account => {
        return {
          value: account.name,
          label: account.name
        };
      });
  }

  function updateUserDisplay() {
    if (!currentUser) {
      return;
    }

    UIService.setText("currentUserName", currentUser.name);
    UIService.setText("currentUserRole", getRoleLabel(currentUser.role));

    UIService.setText("menuUserName", currentUser.name);
    UIService.setText("menuUserRole", getRoleLabel(currentUser.role));

    const welcomeTitle = getLanguage() === "en"
      ? `Welcome back, ${currentUser.name}.`
      : `Willkommen zurück, ${currentUser.name}.`;

    UIService.setText("welcomeTitle", welcomeTitle);

    if (isAdmin()) {
      const welcomeText = getLanguage() === "en"
        ? "Dashboard, assignments, and scheduling are being prepared."
        : "Dashboard, Einsätze und Planung werden vorbereitet.";

      UIService.setText("welcomeText", welcomeText);
      UIService.showElement("teamAdminPanel");
      UIService.hideElement("teamAccessNotice");
      showAdminLinks();
    } else {
      const welcomeText = getLanguage() === "en"
        ? "Your assignments and reminders are being prepared."
        : "Deine Einsätze und Erinnerungen werden vorbereitet.";

      UIService.setText("welcomeText", welcomeText);
      UIService.hideElement("teamAdminPanel");
      UIService.showElement("teamAccessNotice");
      hideAdminLinks();
    }

    if (typeof I18nService !== "undefined") {
      I18nService.applyLanguage();

      UIService.setText("currentUserRole", getRoleLabel(currentUser.role));
      UIService.setText("menuUserRole", getRoleLabel(currentUser.role));
      UIService.setText("welcomeTitle", welcomeTitle);
    }
  }

  function showAdminLinks() {
    document.querySelectorAll(".admin-only").forEach(element => {
      element.classList.remove("hidden");
    });
  }

  function hideAdminLinks() {
    document.querySelectorAll(".admin-only").forEach(element => {
      element.classList.add("hidden");
    });
  }

  function renderAccounts() {
    const accountsList = UIService.getElement("accountsList");

    if (!accountsList) {
      return;
    }

    const accounts = StorageService.getAccounts();

    accountsList.innerHTML = "";

    if (accounts.length === 0) {
      accountsList.innerHTML = `<p class="empty">${translate("notSpecified", "Nicht angegeben")}</p>`;
      return;
    }

    const section = document.createElement("section");
    section.className = "accounts-overview";

    section.innerHTML = `
      <div class="accounts-overview-header">
        <div>
          <p class="eyebrow">${getLanguage() === "en" ? "Team Accounts" : "Mitarbeiterkonten"}</p>
          <h3>${getLanguage() === "en" ? "Created accounts" : "Angelegte Konten"}</h3>
        </div>

        <span>${accounts.length}</span>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "accounts-grid";

    accounts.forEach(account => {
      const accountStats = getAccountStats(account);
      const card = document.createElement("article");

      card.className = `account-card account-card-enhanced ${account.active === false ? "account-inactive" : ""}`;

      card.innerHTML = `
        <div class="account-card-top">
          <div>
            <strong>${ReportService.escapeHtml(account.name)}</strong>
            <p>${ReportService.escapeHtml(account.email)}</p>
          </div>

          <div class="account-badge-stack">
            <span class="badge ${account.role === "admin" ? "badge-gold" : ""}">
              ${getRoleLabel(account.role)}
            </span>

            <span class="badge ${account.active === false ? "badge-red" : "badge-green"}">
              ${account.active === false
                ? getLanguage() === "en" ? "Inactive" : "Inaktiv"
                : getLanguage() === "en" ? "Active" : "Aktiv"}
            </span>
          </div>
        </div>

        <div class="account-stats-mini">
          <div>
            <strong>${accountStats.open}</strong>
            <span>${getLanguage() === "en" ? "Open" : "Offen"}</span>
          </div>

          <div>
            <strong>${accountStats.progress}</strong>
            <span>${getLanguage() === "en" ? "Active" : "Laufend"}</span>
          </div>

          <div>
            <strong>${accountStats.done}</strong>
            <span>${getLanguage() === "en" ? "Done" : "Erledigt"}</span>
          </div>

          <div>
            <strong>${accountStats.urgent}</strong>
            <span>${getLanguage() === "en" ? "Urgent" : "Dringend"}</span>
          </div>
        </div>

        <div class="account-actions">
          <button class="action-button edit-button" type="button" data-account-action="profile" data-account-id="${account.id}">
            ${getLanguage() === "en" ? "Open profile" : "Profil öffnen"}
          </button>

          <button class="action-button report-button" type="button" data-account-action="assignments" data-account-id="${account.id}">
            ${getLanguage() === "en" ? "View assignments" : "Einsätze ansehen"}
          </button>

          <button class="action-button route-button" type="button" data-account-action="edit" data-account-id="${account.id}">
            ${getLanguage() === "en" ? "Edit" : "Bearbeiten"}
          </button>

          <button class="action-button mail-button" type="button" data-account-action="password" data-account-id="${account.id}">
            ${getLanguage() === "en" ? "Reset password" : "Passwort ändern"}
          </button>

          <button class="action-button ${account.active === false ? "done-button" : "delete-button"}" type="button" data-account-action="toggle" data-account-id="${account.id}">
            ${account.active === false
              ? getLanguage() === "en" ? "Activate" : "Aktivieren"
              : getLanguage() === "en" ? "Deactivate" : "Deaktivieren"}
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

    section.appendChild(grid);
    accountsList.appendChild(section);

    bindAccountCardEvents();
  }

  function bindAccountCardEvents() {
    const accountsList = UIService.getElement("accountsList");

    if (!accountsList || accountsList.dataset.bound === "true") {
      return;
    }

    accountsList.dataset.bound = "true";

    accountsList.addEventListener("click", event => {
      const button = event.target.closest("[data-account-action]");

      if (!button) {
        return;
      }

      const action = button.dataset.accountAction;
      const accountId = button.dataset.accountId;

      if (action === "profile") {
        openAccountDetail(accountId);
        return;
      }

      if (action === "assignments") {
        openAccountAssignments(accountId);
        return;
      }

      if (action === "edit") {
        openAccountEdit(accountId);
        return;
      }

      if (action === "password") {
        openPasswordReset(accountId);
        return;
      }

      if (action === "toggle") {
        toggleAccountStatus(accountId);
      }
    });
  }

  function openAccountDetail(accountId) {
    const account = findAccount(accountId);

    if (!account) {
      UIService.showToast(getLanguage() === "en" ? "Account was not found." : "Konto wurde nicht gefunden.");
      return;
    }

    ensureAccountDetailModal();

    const content = UIService.getElement("accountDetailContent");

    if (!content) {
      return;
    }

    content.innerHTML = createAccountDetailHtml(account);

    UIService.openModal("accountDetailModal");
  }

  function openAccountAssignments(accountId) {
    const account = findAccount(accountId);

    if (!account) {
      UIService.showToast(getLanguage() === "en" ? "Account was not found." : "Konto wurde nicht gefunden.");
      return;
    }

    ensureAccountDetailModal();

    const content = UIService.getElement("accountDetailContent");

    if (!content) {
      return;
    }

    content.innerHTML = createAssignmentsHtml(account);

    UIService.openModal("accountDetailModal");
  }

  function openAccountEdit(accountId) {
    const account = findAccount(accountId);

    if (!account) {
      UIService.showToast(getLanguage() === "en" ? "Account was not found." : "Konto wurde nicht gefunden.");
      return;
    }

    ensureAccountDetailModal();

    const content = UIService.getElement("accountDetailContent");

    if (!content) {
      return;
    }

    content.innerHTML = createAccountEditHtml(account);
    bindAccountEditForm(account.id);

    UIService.openModal("accountDetailModal");
  }

  function openPasswordReset(accountId) {
    const account = findAccount(accountId);

    if (!account) {
      UIService.showToast(getLanguage() === "en" ? "Account was not found." : "Konto wurde nicht gefunden.");
      return;
    }

    ensureAccountDetailModal();

    const content = UIService.getElement("accountDetailContent");

    if (!content) {
      return;
    }

    content.innerHTML = createPasswordResetHtml(account);
    bindPasswordResetForm(account.id);

    UIService.openModal("accountDetailModal");
  }

  function ensureAccountDetailModal() {
    if (UIService.getElement("accountDetailModal")) {
      return;
    }

    const modal = document.createElement("section");

    modal.id = "accountDetailModal";
    modal.className = "modal hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
      <div class="modal-card detail-card employee-profile-card">
        <div class="modal-header">
          <div>
            <p class="eyebrow">${getLanguage() === "en" ? "Team Management" : "Mitarbeiterverwaltung"}</p>
            <h2 id="accountDetailTitle">${getLanguage() === "en" ? "Account details" : "Kontodetails"}</h2>
          </div>

          <button id="closeAccountDetailButton" class="icon-button" type="button" aria-label="Schließen">×</button>
        </div>

        <div id="accountDetailContent"></div>
      </div>
    `;

    document.body.appendChild(modal);

    UIService.getElement("closeAccountDetailButton")?.addEventListener("click", () => {
      UIService.closeModal("accountDetailModal");
    });

    modal.addEventListener("click", event => {
      if (event.target === modal) {
        UIService.closeModal("accountDetailModal");
      }
    });
  }

  function createAccountDetailHtml(account) {
    const stats = getAccountStats(account);
    const assignedCustomers = getAssignedCustomersForAccount(account);

    return `
      ${createEmployeeHero(account)}

      <div class="employee-profile-stats">
        <div>
          <strong>${stats.open}</strong>
          <span>${getLanguage() === "en" ? "Open" : "Offen"}</span>
        </div>

        <div>
          <strong>${stats.progress}</strong>
          <span>${getLanguage() === "en" ? "In progress" : "In Bearbeitung"}</span>
        </div>

        <div>
          <strong>${stats.done}</strong>
          <span>${getLanguage() === "en" ? "Completed" : "Erledigt"}</span>
        </div>

        <div>
          <strong>${stats.urgent}</strong>
          <span>${getLanguage() === "en" ? "Urgent" : "Dringend"}</span>
        </div>
      </div>

      <div class="employee-management-actions">
        <button class="action-button report-button" type="button" data-account-action="assignments" data-account-id="${account.id}">
          ${getLanguage() === "en" ? "View assignments" : "Einsätze ansehen"}
        </button>

        <button class="action-button route-button" type="button" data-account-action="edit" data-account-id="${account.id}">
          ${getLanguage() === "en" ? "Edit account" : "Konto bearbeiten"}
        </button>

        <button class="action-button mail-button" type="button" data-account-action="password" data-account-id="${account.id}">
          ${getLanguage() === "en" ? "Reset password" : "Passwort ändern"}
        </button>
      </div>

      <div class="detail-section">
        <h3>${getLanguage() === "en" ? "Assigned service cases" : "Zugewiesene Servicefälle"}</h3>
        <div class="employee-assignment-list">
          ${createAssignmentsListHtml(assignedCustomers)}
        </div>
      </div>
    `;
  }

  function createAssignmentsHtml(account) {
    const assignedCustomers = getAssignedCustomersForAccount(account);

    return `
      ${createEmployeeHero(account)}

      <div class="detail-section">
        <h3>${getLanguage() === "en" ? "Assigned service cases" : "Zugewiesene Servicefälle"}</h3>
        <div class="employee-assignment-list">
          ${createAssignmentsListHtml(assignedCustomers)}
        </div>
      </div>
    `;
  }

  function createAccountEditHtml(account) {
    return `
      ${createEmployeeHero(account)}

      <div class="detail-section">
        <h3>${getLanguage() === "en" ? "Edit account" : "Konto bearbeiten"}</h3>

        <form id="accountEditForm" class="form account-edit-form">
          <input id="editAccountNameField" type="text" value="${ReportService.escapeHtml(account.name)}" placeholder="${getLanguage() === "en" ? "Name" : "Name"}" required />
          <input id="editAccountEmailField" type="email" value="${ReportService.escapeHtml(account.email)}" placeholder="${getLanguage() === "en" ? "Email" : "E-Mail"}" required />

          <select id="editAccountRoleField">
            <option value="employee" ${account.role === "employee" ? "selected" : ""}>${getLanguage() === "en" ? "Employee" : "Mitarbeiter"}</option>
            <option value="admin" ${account.role === "admin" ? "selected" : ""}>${getLanguage() === "en" ? "Administrator" : "Admin"}</option>
          </select>

          <button type="submit">${getLanguage() === "en" ? "Save changes" : "Änderungen speichern"}</button>
        </form>
      </div>
    `;
  }

  function createPasswordResetHtml(account) {
    return `
      ${createEmployeeHero(account)}

      <div class="detail-section">
        <h3>${getLanguage() === "en" ? "Change password" : "Passwort ändern"}</h3>

        <form id="accountPasswordForm" class="form account-edit-form">
          <input id="newAccountPasswordField" type="password" placeholder="${getLanguage() === "en" ? "New password" : "Neues Passwort"}" autocomplete="new-password" required />
          <button type="submit">${getLanguage() === "en" ? "Save new password" : "Neues Passwort speichern"}</button>
        </form>
      </div>
    `;
  }

  function createEmployeeHero(account) {
    return `
      <div class="employee-profile-hero">
        <div>
          <p class="eyebrow">${getRoleLabel(account.role)}</p>
          <h3>${ReportService.escapeHtml(account.name)}</h3>
          <p>${ReportService.escapeHtml(account.email)}</p>
        </div>

        <div class="employee-profile-badge ${account.active === false ? "inactive" : ""}">
          ${account.active === false
            ? getLanguage() === "en" ? "Inactive" : "Inaktiv"
            : getLanguage() === "en" ? "Active" : "Aktiv"}
        </div>
      </div>
    `;
  }

  function createAssignmentsListHtml(customers) {
    if (!customers || customers.length === 0) {
      return `<p class="empty">${getLanguage() === "en" ? "No service cases are currently assigned to this account." : "Diesem Konto sind aktuell keine Servicefälle zugewiesen."}</p>`;
    }

    return customers.map(customer => {
      return `
        <article class="employee-assignment-card">
          <div>
            <h4>${ReportService.escapeHtml(customer.name)}</h4>
            <p>${ReportService.escapeHtml(customer.city || translate("locationOpen", "Ort offen"))}</p>
            <p>${ReminderService.translateStoredServiceType(customer.serviceType)} · ${ReminderService.getStatusLabel(customer.status)}</p>
            <p>${getLanguage() === "en" ? "Next appointment" : "Nächster Termin"}: ${customer.nextDate ? ReminderService.formatDate(customer.nextDate) : translate("noDateOpen", "Noch offen")}</p>
          </div>

          <div class="badges">
            <span class="badge ${ReminderService.getPriorityBadgeClass(customer.priority)}">
              ${ReminderService.getPriorityLabel(customer.priority)}
            </span>
          </div>
        </article>
      `;
    }).join("");
  }

  function bindAccountEditForm(accountId) {
    const form = UIService.getElement("accountEditForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", event => {
      event.preventDefault();

      const account = findAccount(accountId);

      if (!account) {
        UIService.showToast(getLanguage() === "en" ? "Account was not found." : "Konto wurde nicht gefunden.");
        return;
      }

      const newName = UIService.getValue("editAccountNameField");
      const newEmail = UIService.getValue("editAccountEmailField");
      const newRole = UIService.getRawValue("editAccountRoleField");

      if (!newName || !newEmail) {
        UIService.showToast(getLanguage() === "en" ? "Please fill in name and email." : "Bitte Name und E-Mail ausfüllen.");
        return;
      }

      const emailExists = StorageService.getAccounts().some(item => {
        return item.id !== accountId && item.email.toLowerCase() === newEmail.toLowerCase();
      });

      if (emailExists) {
        UIService.showToast(translate("toastEmailExists", "Diese E-Mail ist bereits vergeben."));
        return;
      }

      StorageService.updateAccount(accountId, {
        name: newName,
        email: newEmail,
        role: newRole
      });

      StorageService.reassignCustomers(account.name, newName);

      if (currentUser && currentUser.id === accountId) {
        currentUser = {
          ...currentUser,
          name: newName,
          email: newEmail,
          role: newRole
        };

        updateUserDisplay();
      }

      renderAccounts();
      refreshAssignableUserSelects();

      if (typeof CustomerService !== "undefined") {
        CustomerService.renderAll();
      }

      UIService.closeModal("accountDetailModal");
      UIService.showToast(getLanguage() === "en" ? "Account has been updated." : "Konto wurde aktualisiert.");
    });
  }

  function bindPasswordResetForm(accountId) {
    const form = UIService.getElement("accountPasswordForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", event => {
      event.preventDefault();

      const newPassword = UIService.getValue("newAccountPasswordField");

      if (!newPassword) {
        UIService.showToast(getLanguage() === "en" ? "Please enter a new password." : "Bitte neues Passwort eintragen.");
        return;
      }

      StorageService.resetAccountPassword(accountId, newPassword);

      UIService.closeModal("accountDetailModal");
      UIService.showToast(getLanguage() === "en" ? "Password has been changed." : "Passwort wurde geändert.");
    });
  }

  function toggleAccountStatus(accountId) {
    const account = findAccount(accountId);

    if (!account) {
      UIService.showToast(getLanguage() === "en" ? "Account was not found." : "Konto wurde nicht gefunden.");
      return;
    }

    if (currentUser && currentUser.id === accountId) {
      UIService.showToast(getLanguage() === "en" ? "You cannot deactivate your own account." : "Das eigene Konto kann nicht deaktiviert werden.");
      return;
    }

    const shouldActivate = account.active === false;

    const confirmed = confirm(
      shouldActivate
        ? getLanguage() === "en" ? "Activate this account?" : "Dieses Konto aktivieren?"
        : getLanguage() === "en" ? "Deactivate this account?" : "Dieses Konto deaktivieren?"
    );

    if (!confirmed) {
      return;
    }

    if (shouldActivate) {
      StorageService.activateAccount(accountId);
    } else {
      StorageService.deactivateAccount(accountId);
    }

    renderAccounts();
    refreshAssignableUserSelects();

    UIService.showToast(
      shouldActivate
        ? getLanguage() === "en" ? "Account has been activated." : "Konto wurde aktiviert."
        : getLanguage() === "en" ? "Account has been deactivated." : "Konto wurde deaktiviert."
    );
  }

  function getAssignedCustomersForAccount(account) {
    if (!account) {
      return [];
    }

    if (account.role === "admin") {
      return StorageService.getCustomers();
    }

    return StorageService.getCustomers().filter(customer => {
      return customer.assignedTo === account.name;
    });
  }

  function getAccountStats(account) {
    const assignedCustomers = getAssignedCustomersForAccount(account);

    return {
      open: assignedCustomers.filter(customer => customer.status === "open").length,
      progress: assignedCustomers.filter(customer => customer.status === "progress").length,
      done: assignedCustomers.filter(customer => customer.status === "done").length,
      urgent: assignedCustomers.filter(customer => ReminderService.isUrgent(customer)).length
    };
  }

  function findAccount(accountId) {
    return StorageService.getAccounts().find(account => account.id === accountId) || null;
  }

  function refreshAssignableUserSelects() {
    const options = [
      {
        value: "",
        label: translate("optionNotAssigned", "Nicht zugewiesen")
      },
      ...getAssignableUsers()
    ];

    const assignedTo = UIService.getRawValue("assignedTo");
    const editAssignedTo = UIService.getRawValue("editAssignedTo");

    UIService.populateSelect("assignedTo", options, assignedTo);
    UIService.populateSelect("editAssignedTo", options, editAssignedTo);
  }

  function getLanguage() {
    if (typeof I18nService === "undefined") {
      return "de";
    }

    return I18nService.getLanguage();
  }

  function translate(key, fallback) {
    if (typeof I18nService === "undefined") {
      return fallback;
    }

    return I18nService.t(key);
  }

  return {
    login,
    logout,

    getCurrentUser,
    isLoggedIn,
    isAdmin,

    getCurrentUserName,
    getRoleLabel,

    createAccount,
    getAssignableUsers,

    updateUserDisplay,
    renderAccounts,
    refreshAssignableUserSelects
  };
})();