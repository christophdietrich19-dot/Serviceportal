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
      role: role || "employee"
    });

    return {
      success: true,
      account,
      message: translate("toastAccountCreated", "Mitarbeiterkonto wurde angelegt.")
    };
  }

  function getAssignableUsers() {
    return StorageService.getAccounts().map(account => {
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
        ? "Dashboard, jobs and planning are being prepared."
        : "Dashboard, Einsätze und Planung werden vorbereitet.";

      UIService.setText("welcomeText", welcomeText);
      UIService.showElement("teamAdminPanel");
      UIService.hideElement("teamAccessNotice");
      showAdminLinks();
    } else {
      const welcomeText = getLanguage() === "en"
        ? "Your jobs and reminders are being prepared."
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

    accounts.forEach(account => {
      const card = document.createElement("article");
      card.className = "account-card";

      card.innerHTML = `
        <strong>${ReportService.escapeHtml(account.name)}</strong>
        <p>${ReportService.escapeHtml(account.email)}</p>
        <p>${translate("roleLabel", "Rolle")}: ${getRoleLabel(account.role)}</p>
      `;

      accountsList.appendChild(card);
    });
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