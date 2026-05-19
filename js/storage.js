const StorageService = (() => {
  const STORAGE_KEYS = {
    CUSTOMERS: "serviceportal_customers_v041",
    ACCOUNTS: "serviceportal_accounts_v041",
    THEME: "serviceportal_theme_v041"
  };

  function ensureDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      saveAccounts([
        {
          id: createId(),
          name: "Admin",
          email: "admin@demo.de",
          password: "admin123",
          role: "admin",
          createdAt: new Date().toISOString()
        }
      ]);
    }

    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      saveCustomers([]);
    }

    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      saveTheme("light");
    }
  }

  function getCustomers() {
    return readJson(STORAGE_KEYS.CUSTOMERS, []);
  }

  function saveCustomers(customers) {
    writeJson(STORAGE_KEYS.CUSTOMERS, customers);
  }

  function addCustomer(customer) {
    const customers = getCustomers();

    const newCustomer = {
      id: createId(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
      completedAt: null,
      ...customer
    };

    customers.unshift(newCustomer);
    saveCustomers(customers);

    return newCustomer;
  }

  function updateCustomer(customerId, updates) {
    const customers = getCustomers();

    const updatedCustomers = customers.map(customer => {
      if (customer.id !== customerId) {
        return customer;
      }

      return {
        ...customer,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });

    saveCustomers(updatedCustomers);
  }

  function deleteCustomer(customerId) {
    const customers = getCustomers();

    const filteredCustomers = customers.filter(customer => {
      return customer.id !== customerId;
    });

    saveCustomers(filteredCustomers);
  }

  function getAccounts() {
    return readJson(STORAGE_KEYS.ACCOUNTS, []);
  }

  function saveAccounts(accounts) {
    writeJson(STORAGE_KEYS.ACCOUNTS, accounts);
  }

  function addAccount(account) {
    const accounts = getAccounts();

    const newAccount = {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...account
    };

    accounts.push(newAccount);
    saveAccounts(accounts);

    return newAccount;
  }

  function deleteAccount(accountId) {
    const accounts = getAccounts();

    const filteredAccounts = accounts.filter(account => {
      return account.id !== accountId;
    });

    saveAccounts(filteredAccounts);
  }

  function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  }

  function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  function loadDemoData() {
    const demoCustomers = [
      {
        id: createId(),
        name: "Bowling Arena Leipzig",
        city: "Leipzig",
        address: "Musterstraße 12",
        phone: "+49 341 123456",
        email: "service@bowling-arena-leipzig.de",
        system: "Bowlingbahn",
        machineType: "Funk",
        laneCount: "12",
        maintenancePerLane: "2x jährlich",
        serviceType: "Wartung",
        priority: "high",
        assignedTo: "Max Schneider",
        status: "progress",
        nextDate: getFutureDate(1),
        reminderType: "Kunde anrufen",
        reminderDate: getToday(),
        note: "Regelmäßige Wartung. Bahn 7 soll besonders geprüft werden.",
        image: "",
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
        updatedAt: null,
        completedAt: null
      },
      {
        id: createId(),
        name: "Kegelcenter Kamenz",
        city: "Kamenz",
        address: "Bahnhofstraße 8",
        phone: "+49 3578 987654",
        email: "kontakt@kegelcenter-kamenz.de",
        system: "Kegelbahn",
        machineType: "Spellmann",
        laneCount: "8",
        maintenancePerLane: "150 € je Bahn",
        serviceType: "Reparatur",
        priority: "urgent",
        assignedTo: "Tom Berger",
        status: "open",
        nextDate: getToday(),
        reminderType: "Rückmeldung offen",
        reminderDate: getToday(),
        note: "Kunde meldet Störung an zwei Bahnen. Rückmeldung zeitnah erforderlich.",
        image: "",
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
        updatedAt: null,
        completedAt: null
      },
      {
        id: createId(),
        name: "Sportpark Bautzen",
        city: "Bautzen",
        address: "Am Sportforum 3",
        phone: "+49 3591 445566",
        email: "technik@sportpark-bautzen.de",
        system: "Bowling- und Kegelbahn",
        machineType: "SES",
        laneCount: "10",
        maintenancePerLane: "halbjährliche Kontrolle",
        serviceType: "Kontrolle",
        priority: "normal",
        assignedTo: "Max Schneider",
        status: "open",
        nextDate: getFutureDate(4),
        reminderType: "Termin bestätigen",
        reminderDate: getFutureDate(2),
        note: "Termin zur Sichtprüfung und Vorbereitung der nächsten Wartung.",
        image: "",
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
        updatedAt: null,
        completedAt: null
      },
      {
        id: createId(),
        name: "Freizeitzentrum Nord",
        city: "Dresden",
        address: "Industriestraße 22",
        phone: "+49 351 778899",
        email: "info@freizeitzentrum-nord.de",
        system: "Bowlingbahn",
        machineType: "Pauly",
        laneCount: "16",
        maintenancePerLane: "Monatswartung",
        serviceType: "Wartung",
        priority: "normal",
        assignedTo: "Tom Berger",
        status: "done",
        nextDate: getFutureDate(14),
        reminderType: "Wartung fällig",
        reminderDate: getFutureDate(12),
        note: "Wartung abgeschlossen. Keine offenen Punkte.",
        image: "",
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    ];

    const demoAccounts = [
      {
        id: createId(),
        name: "Admin",
        email: "admin@demo.de",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        id: createId(),
        name: "Max Schneider",
        email: "max.schneider@demo.de",
        password: "demo123",
        role: "employee",
        createdAt: new Date().toISOString()
      },
      {
        id: createId(),
        name: "Tom Berger",
        email: "tom.berger@demo.de",
        password: "demo123",
        role: "employee",
        createdAt: new Date().toISOString()
      }
    ];

    saveCustomers(demoCustomers);
    saveAccounts(demoAccounts);
  }

  function resetAllData() {
    saveCustomers([]);

    saveAccounts([
      {
        id: createId(),
        name: "Admin",
        email: "admin@demo.de",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString()
      }
    ]);
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      console.error("Speicherfehler:", error);
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function createId() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  function getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return date.toISOString().split("T")[0];
  }

  return {
    ensureDefaultData,

    getCustomers,
    saveCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,

    getAccounts,
    saveAccounts,
    addAccount,
    deleteAccount,

    getTheme,
    saveTheme,

    loadDemoData,
    resetAllData
  };
})();