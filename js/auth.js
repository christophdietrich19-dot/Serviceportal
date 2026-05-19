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
        message: "Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen."
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
    return currentUser ? currentUser.name : "Unbekannt";
  }

  function getRoleLabel(role) {
    const labels = {
      admin: "Admin",
      employee: "Mitarbeiter"
    };

    return labels[role] || "Mitarbeiter";
  }

  function createAccount({ name, email, password, role }) {
    if (!isAdmin()) {
      return {
        success: false,
        message: "Nur Admins dürfen Mitarbeiterkonten anlegen."
      };
    }

    if (!name || !email || !password) {
      return {
        success: false,
        message: "Bitte Name, E-Mail und Passwort ausfüllen."
      };
    }

    const accounts = StorageService.getAccounts();

    const emailExists = accounts.some(account => {
      return account.email.toLowerCase() === email.toLowerCase();
    });

    if (emailExists) {
      return {
        success: false,
        message: "Diese E-Mail ist bereits vergeben."
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
      message: "Mitarbeiterkonto wurde angelegt."
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

    UIService.setText("welcomeTitle", `Willkommen zurück, ${currentUser.name}.`);

    if (isAdmin()) {
      UIService.setText("welcomeText", "Dashboard, Einsätze und Planung werden vorbereitet.");
      UIService.showElement("teamAdminPanel");
      UIService.hideElement("teamAccessNotice");
      showAdminLinks();
    } else {
      UIService.setText("welcomeText", "Deine Einsätze und Erinnerungen werden vorbereitet.");
      UIService.hideElement("teamAdminPanel");
      UIService.showElement("teamAccessNotice");
      hideAdminLinks();
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
      accountsList.innerHTML = `<p class="empty">Noch keine Benutzerkonten angelegt.</p>`;
      return;
    }

    accounts.forEach(account => {
      const card = document.createElement("article");
      card.className = "account-card";

      card.innerHTML = `
        <strong>${ReportService.escapeHtml(account.name)}</strong>
        <p>${ReportService.escapeHtml(account.email)}</p>
        <p>Rolle: ${getRoleLabel(account.role)}</p>
      `;

      accountsList.appendChild(card);
    });
  }

  function refreshAssignableUserSelects() {
    const options = [
      {
        value: "",
        label: "Nicht zugewiesen"
      },
      ...getAssignableUsers()
    ];

    const assignedTo = UIService.getRawValue("assignedTo");
    const editAssignedTo = UIService.getRawValue("editAssignedTo");

    UIService.populateSelect("assignedTo", options, assignedTo);
    UIService.populateSelect("editAssignedTo", options, editAssignedTo);
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