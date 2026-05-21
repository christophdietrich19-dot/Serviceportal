const I18nService = (() => {
  const STORAGE_KEY = "serviceportal_language_v042";

  const translations = {
    de: {
      appTitle: "Serviceportal v0.4.2",
      prototype: "Interner Prototyp",
      navigation: "Navigation",
      presentationVersion: "v0.4.2 Präsentationsstand",

      loginSubtitle: "Service, Wartung und Einsatzplanung übersichtlich verwalten.",
      loginButton: "Einloggen",
      demoHint: "Demo-Zugang für Testzwecke\nE-Mail: admin@demo.de\nPasswort: admin123",

      welcomeEyebrow: "Serviceportal",
      welcomeTitle: "Willkommen zurück.",
      welcomeText: "Das Serviceportal wird vorbereitet.",

      navDashboard: "Dashboard",
      navTechnician: "Meine Einsätze",
      navCalendar: "Kalender & Planung",
      navImportant: "Heute wichtig",
      navCustomers: "Kunden & Servicefälle",
      navNewCustomer: "Neuer Kunde / Servicefall",
      navStatusBoard: "Statusboard",
      navReports: "Serviceberichte",
      navTeam: "Mitarbeiter",
      navSettings: "Portal Einstellungen",
      navHelp: "Hilfe & Support",

      loggedInAs: "Angemeldet als",
      roleLabel: "Rolle",
      userLabel: "Benutzer",

      topSubtitle: "Service · Wartung · Einsatzplanung",
      languageButton: "English",
      themeButton: "Hell / Dunkel",
      themeButtonLong: "Hell / Dunkel wechseln",
      logoutButton: "Abmelden",

      dashboardEyebrow: "Dashboard",
      dashboardHeadline: "Aktuelle Einsätze, Erinnerungen und Servicefälle auf einen Blick.",
      dashboardMessageDefault: "Hier werden die wichtigsten Aufgaben und offenen Punkte angezeigt.",
      dashboardNoOpenItems: "Aktuell sind keine fälligen Erinnerungen oder dringenden Fälle vorhanden.",
      dashboardImportantMessage: "Heute wichtig: {due} Erinnerung(en) und {urgent} dringende Fälle prüfen.",
      portalBadge: "Service · Wartung · Planung",

      statCustomers: "Kunden",
      statCustomersSub: "Gespeicherte Kunden & Anlagen",
      statOpen: "Offene Fälle",
      statOpenSub: "Aktive Servicefälle",
      statDue: "Fällige Erinnerungen",
      statDueSub: "Anstehende Aufgaben",
      statUrgent: "Dringende Fälle",
      statUrgentSub: "Priorität hoch",
      statAccounts: "Benutzerkonten",
      statAccountsSub: "Angelegte Zugänge",

      importantEyebrow: "Heute wichtig",
      importantHeadline: "Fällige Erinnerungen und dringende Fälle",
      importantEmpty: "Aktuell sind keine Erinnerungen oder dringenden Fälle fällig.",

      quickEyebrow: "Schnellzugriff",
      quickHeadline: "Häufig genutzte Bereiche",
      quickTechnician: "Meine Einsätze öffnen",
      quickCalendar: "Kalender & Planung öffnen",
      quickNewCustomer: "Neuen Kunden / Servicefall anlegen",
      quickStatusBoard: "Statusboard öffnen",
      quickCustomers: "Kunden & Servicefälle anzeigen",
      quickReports: "Serviceberichte ansehen",

      backDashboard: "← Zurück zum Dashboard",

      technicianEyebrow: "Technikeransicht",
      technicianHeadline: "Meine Einsätze",
      technicianIntro: "Hier werden zugewiesene offene Servicefälle und kommende Termine angezeigt.",
      technicianBadge: "Mobile Einsatzansicht",
      technicianTodayEyebrow: "Heute",
      technicianRouteHeadline: "Heutige Route",
      technicianRouteEmpty: "Heute sind keine Einsätze geplant.",
      technicianUpcomingEyebrow: "Kommende Einsätze",
      technicianUpcomingHeadline: "Nächste Termine",
      technicianUpcomingEmpty: "Aktuell sind keine offenen Einsätze zugewiesen.",

      technicianOpen: "Offen",
      technicianOpenSub: "Einsätze",
      technicianProgress: "In Bearbeitung",
      technicianProgressSub: "Einsätze",
      technicianUrgent: "Dringend",
      technicianUrgentSub: "Einsätze",
      technicianDone: "Erledigt",
      technicianDoneSub: "Einsätze",

      calendarEyebrow: "Kalender & Planung",
      calendarHeadline: "Einsatzplanung",
      calendarLoading: "Kalender wird geladen.",
      calendarNoEntries: "Keine Termine vorhanden.",

      customersEyebrow: "Kunden & Servicefälle",
      customersHeadline: "Kunden und Termine",
      customersEmpty: "Noch keine Kunden oder Servicefälle eingetragen.",
      customersNoResults: "Keine passenden Kunden oder Servicefälle gefunden.",

      newCustomerEyebrow: "Neuer Kunde / Servicefall",
      newCustomerHeadline: "Kunde oder Servicefall hinzufügen",
      saveCustomerButton: "Kunde / Servicefall speichern",

      statusBoardEyebrow: "Statusboard",
      statusBoardHeadline: "Servicefälle nach Bearbeitungsstand",
      boardOpen: "Offen",
      boardProgress: "In Bearbeitung",
      boardDone: "Erledigt",
      boardEmpty: "Keine Servicefälle in dieser Spalte.",

      reportsEyebrow: "Serviceberichte",
      reportsHeadline: "Serviceberichte und erledigte Fälle",
      reportsEmpty: "Noch keine Serviceberichte vorhanden.",
      reportsNoCompleted: "Noch keine erledigten Servicefälle vorhanden.",

      teamEyebrow: "Mitarbeiter",
      teamHeadline: "Mitarbeiterkonto anlegen",
      createAccountButton: "Konto anlegen",
      teamRestrictedEyebrow: "Zugriff eingeschränkt",
      teamRestrictedHeadline: "Mitarbeiterverwaltung",
      teamRestrictedText: "Dieser Bereich ist nur für Admins sichtbar.",

      settingsEyebrow: "Portal Einstellungen",
      settingsHeadline: "Projektinformation",
      settingsVersion: "Aktueller Stand: Präsentationsprototyp v0.4.2",
      settingsInfo: "Die Daten werden aktuell lokal im Browser gespeichert. Für den produktiven Einsatz wären Datenbank, Benutzerrechte und weitere Sicherheitsfunktionen sinnvoll.",
      settingsDeveloper: "Entwicklung: Christoph Dietrich",
      loadDemoButton: "Demo-Daten laden",
      resetDemoButton: "Demo zurücksetzen",

      helpEyebrow: "Hilfe & Support",
      helpHeadline: "Support & Weiterentwicklung",
      helpText: "Interner Prototyp zur besseren Übersicht von Service, Wartung und Einsatzplanung.",

      detailEyebrow: "Kundenakte",
      detailHeadline: "Kundendetails",

      editEyebrow: "Eintrag bearbeiten",
      editHeadline: "Kundendaten ändern",
      saveChangesButton: "Änderungen speichern",

      reportEyebrow: "Servicebericht",
      reportHeadline: "Berichtsvorschau",
      printReportButton: "Bericht drucken / als PDF speichern",

      mobileStart: "Start",
      mobileTasks: "Einsätze",
      mobilePlanning: "Planung",
      mobileCustomers: "Kunden",

      placeholderLoginEmail: "E-Mail",
      placeholderLoginPassword: "Passwort",
      placeholderSearch: "Kunde, Ort, Adresse, Mitarbeiter, Maschinentyp oder Erinnerung suchen...",
      placeholderCustomerName: "Kundenname, z. B. Bowling Arena Leipzig",
      placeholderCity: "Ort, z. B. Leipzig",
      placeholderAddress: "Adresse",
      placeholderPhone: "Telefonnummer",
      placeholderEmail: "E-Mail",
      placeholderLaneCount: "Bahnanzahl, z. B. 8",
      placeholderMaintenance: "Wartung pro Bahn, z. B. 2x jährlich oder 150 €",
      placeholderNote: "Notiz zum Servicefall, zur Wartung oder zur nächsten Rückmeldung",
      placeholderEditNote: "Notiz",
      placeholderAccountName: "Vorname und Nachname",
      placeholderAccountPassword: "Passwort",

      fileBoxText: "Bild zur Reparatur oder Wartung anhängen",

      optionAllStatus: "Alle Status",
      optionOpen: "Offen",
      optionProgress: "In Bearbeitung",
      optionDone: "Erledigt",
      optionNotAssigned: "Nicht zugewiesen",
      optionNoMachine: "Maschinentyp / Hersteller nicht angegeben",
      optionNoReminder: "Keine Erinnerung",

      systemBowling: "Bowlingbahn",
      systemSkittles: "Kegelbahn",
      systemBoth: "Bowling- und Kegelbahn",

      serviceMaintenance: "Wartung",
      serviceRepair: "Reparatur",
      serviceCallback: "Rückruf",
      serviceOffer: "Angebot",
      serviceInspection: "Kontrolle",

      priorityNormalOption: "Priorität: Normal",
      priorityHighOption: "Priorität: Hoch",
      priorityUrgentOption: "Priorität: Dringend",

      reminderCall: "Kunde anrufen",
      reminderEmail: "E-Mail schreiben",
      reminderMaintenance: "Wartung fällig",
      reminderFeedback: "Rückmeldung offen",
      reminderConfirm: "Termin bestätigen",

      roleAdmin: "Admin",
      roleEmployee: "Mitarbeiter",

      statusOpen: "Offen",
      statusProgress: "In Bearbeitung",
      statusDone: "Erledigt",

      priorityNormal: "Normal",
      priorityHigh: "Hoch",
      priorityUrgent: "Dringend",

      actionOpenFile: "Akte öffnen",
      actionOpen: "Öffnen",
      actionReport: "Servicebericht",
      actionReportShort: "Bericht",
      actionEdit: "Bearbeiten",
      actionDone: "Als erledigt markieren",
      actionDelete: "Löschen",
      actionCall: "Anrufen",
      actionEmail: "E-Mail",
      actionRoute: "Route",

      labelCustomer: "Kunde",
      labelCity: "Ort",
      labelAddress: "Adresse",
      labelPhone: "Telefon",
      labelEmail: "E-Mail",
      labelSystem: "Anlage",
      labelMachineType: "Maschinentyp",
      labelLanes: "Bahnanzahl",
      labelMaintenancePerLane: "Wartung pro Bahn",
      labelServiceType: "Serviceart",
      labelStatus: "Status",
      labelPriority: "Priorität",
      labelAssignedTo: "Zugewiesen an",
      labelNextDate: "Nächster Termin",
      labelCreatedBy: "Erstellt von",
      labelCreatedAt: "Erstellt am",
      labelUpdatedAt: "Bearbeitet am",
      labelCompletedAt: "Erledigt am",
      labelReportCreatedAt: "Bericht erstellt am",
      labelTechnician: "Techniker",
      labelAppointment: "Termin",
      labelNote: "Notiz",
      labelServiceHistory: "Serviceverlauf",
      labelImageDocumentation: "Bild / Dokumentation",
      labelReminder: "Erinnerung",
      labelWorkNotes: "Notiz / durchgeführte Arbeiten",
      labelSignatureEmployee: "Unterschrift Mitarbeiter",
      labelSignatureCustomer: "Unterschrift Kunde",

      notSpecified: "Nicht angegeben",
      unknown: "Unbekannt",
      notAssigned: "Nicht zugewiesen",
      noNote: "Keine Notiz vorhanden.",
      noReminder: "Keine Erinnerung",
      noDateOpen: "Noch offen",
      locationOpen: "Ort offen",
      addressOpen: "Adresse offen",
      serviceCase: "Servicefall",
      entryCreated: "Eintrag angelegt",
      entryEdited: "Eintrag bearbeitet",
      caseCompleted: "Servicefall erledigt",
      editedBy: "Bearbeitet von",
      completedBy: "Erledigt von",

      reminderOverdue: "{type} ist seit {days} Tag(en) überfällig.",
      reminderToday: "{type} ist heute fällig.",
      reminderSoon: "{type} in {days} Tag(en).",
      reminderDate: "{type} am {date}.",

      toastLanguageGerman: "Sprache: Deutsch",
      toastLanguageEnglish: "Language: English",
      toastDark: "Dunkler Modus aktiviert.",
      toastLight: "Heller Modus aktiviert.",
      toastLoginFailed: "Login fehlgeschlagen. Bitte E-Mail und Passwort prüfen.",
      toastWelcome: "Willkommen zurück, {name}.",
      toastLoggedOut: "Du wurdest abgemeldet.",
      toastDemoLoaded: "Demo-Daten wurden geladen.",
      toastDemoReset: "Demo-Daten wurden zurückgesetzt.",
      toastCustomerSaved: "Kunde / Servicefall wurde gespeichert.",
      toastCustomerMissing: "Bitte mindestens einen Kundennamen eintragen.",
      toastCustomerNotFound: "Servicefall wurde nicht gefunden.",
      toastChangesSaved: "Änderungen wurden gespeichert.",
      toastCaseDone: "Servicefall wurde als erledigt markiert.",
      toastOnlyAdminsDelete: "Nur Admins dürfen Einträge löschen.",
      toastDeleted: "Eintrag wurde gelöscht.",
      toastAccountCreated: "Mitarbeiterkonto wurde angelegt.",
      toastOnlyAdminsAccounts: "Nur Admins dürfen Mitarbeiterkonten anlegen.",
      toastAccountMissing: "Bitte Name, E-Mail und Passwort ausfüllen.",
      toastEmailExists: "Diese E-Mail ist bereits vergeben.",
      toastStatusChanged: "Status geändert: {status}",

      confirmLogout: "Möchtest du dich wirklich abmelden?",
      confirmLoadDemo: "Demo-Daten laden? Bestehende Demo-Daten werden ersetzt.",
      confirmResetDemo: "Alle Kunden und Demo-Daten wirklich löschen?",
      confirmDelete: "Soll dieser Servicefall wirklich gelöscht werden?"
    },

    en: {
      appTitle: "Service Portal v0.4.2",
      prototype: "Internal Prototype",
      navigation: "Navigation",
      presentationVersion: "v0.4.2 Presentation Build",

      loginSubtitle: "Manage service, maintenance and field planning in one clear overview.",
      loginButton: "Log in",
      demoHint: "Demo access for testing\nEmail: admin@demo.de\nPassword: admin123",

      welcomeEyebrow: "Service Portal",
      welcomeTitle: "Welcome back.",
      welcomeText: "The service portal is being prepared.",

      navDashboard: "Dashboard",
      navTechnician: "My Jobs",
      navCalendar: "Calendar & Planning",
      navImportant: "Important Today",
      navCustomers: "Customers & Service Cases",
      navNewCustomer: "New Customer / Service Case",
      navStatusBoard: "Status Board",
      navReports: "Service Reports",
      navTeam: "Team",
      navSettings: "Portal Settings",
      navHelp: "Help & Support",

      loggedInAs: "Signed in as",
      roleLabel: "Role",
      userLabel: "User",

      topSubtitle: "Service · Maintenance · Field Planning",
      languageButton: "Deutsch",
      themeButton: "Light / Dark",
      themeButtonLong: "Switch light / dark mode",
      logoutButton: "Log out",

      dashboardEyebrow: "Dashboard",
      dashboardHeadline: "Current jobs, reminders and service cases at a glance.",
      dashboardMessageDefault: "The most important tasks and open items are shown here.",
      dashboardNoOpenItems: "There are currently no due reminders or urgent cases.",
      dashboardImportantMessage: "Important today: check {due} reminder(s) and {urgent} urgent case(s).",
      portalBadge: "Service · Maintenance · Planning",

      statCustomers: "Customers",
      statCustomersSub: "Saved customers & systems",
      statOpen: "Open Cases",
      statOpenSub: "Active service cases",
      statDue: "Due Reminders",
      statDueSub: "Upcoming tasks",
      statUrgent: "Urgent Cases",
      statUrgentSub: "High priority",
      statAccounts: "User Accounts",
      statAccountsSub: "Created logins",

      importantEyebrow: "Important Today",
      importantHeadline: "Due reminders and urgent cases",
      importantEmpty: "There are currently no due reminders or urgent cases.",

      quickEyebrow: "Quick Access",
      quickHeadline: "Frequently used areas",
      quickTechnician: "Open my jobs",
      quickCalendar: "Open calendar & planning",
      quickNewCustomer: "Create new customer / service case",
      quickStatusBoard: "Open status board",
      quickCustomers: "Show customers & service cases",
      quickReports: "View service reports",

      backDashboard: "← Back to dashboard",

      technicianEyebrow: "Technician View",
      technicianHeadline: "My Jobs",
      technicianIntro: "Assigned open service cases and upcoming appointments are shown here.",
      technicianBadge: "Mobile field view",
      technicianTodayEyebrow: "Today",
      technicianRouteHeadline: "Today's Route",
      technicianRouteEmpty: "No jobs are planned for today.",
      technicianUpcomingEyebrow: "Upcoming Jobs",
      technicianUpcomingHeadline: "Next Appointments",
      technicianUpcomingEmpty: "There are currently no open jobs assigned to you.",

      technicianOpen: "Open",
      technicianOpenSub: "Jobs",
      technicianProgress: "In Progress",
      technicianProgressSub: "Jobs",
      technicianUrgent: "Urgent",
      technicianUrgentSub: "Jobs",
      technicianDone: "Done",
      technicianDoneSub: "Jobs",

      calendarEyebrow: "Calendar & Planning",
      calendarHeadline: "Field Planning",
      calendarLoading: "Calendar is loading.",
      calendarNoEntries: "No appointments scheduled.",

      customersEyebrow: "Customers & Service Cases",
      customersHeadline: "Customers and Appointments",
      customersEmpty: "No customers or service cases have been added yet.",
      customersNoResults: "No matching customers or service cases found.",

      newCustomerEyebrow: "New Customer / Service Case",
      newCustomerHeadline: "Add customer or service case",
      saveCustomerButton: "Save customer / service case",

      statusBoardEyebrow: "Status Board",
      statusBoardHeadline: "Service cases by processing status",
      boardOpen: "Open",
      boardProgress: "In Progress",
      boardDone: "Done",
      boardEmpty: "No service cases in this column.",

      reportsEyebrow: "Service Reports",
      reportsHeadline: "Service reports and completed cases",
      reportsEmpty: "No service reports available yet.",
      reportsNoCompleted: "No completed service cases available yet.",

      teamEyebrow: "Team",
      teamHeadline: "Create team account",
      createAccountButton: "Create account",
      teamRestrictedEyebrow: "Access Restricted",
      teamRestrictedHeadline: "Team Management",
      teamRestrictedText: "This area is only visible to admins.",

      settingsEyebrow: "Portal Settings",
      settingsHeadline: "Project Information",
      settingsVersion: "Current status: presentation prototype v0.4.2",
      settingsInfo: "Data is currently stored locally in the browser. For production use, a database, user permissions and additional security functions would be recommended.",
      settingsDeveloper: "Development: Christoph Dietrich",
      loadDemoButton: "Load demo data",
      resetDemoButton: "Reset demo",

      helpEyebrow: "Help & Support",
      helpHeadline: "Support & Development",
      helpText: "Internal prototype for a better overview of service, maintenance and field planning.",

      detailEyebrow: "Customer File",
      detailHeadline: "Customer Details",

      editEyebrow: "Edit Entry",
      editHeadline: "Edit Customer Data",
      saveChangesButton: "Save changes",

      reportEyebrow: "Service Report",
      reportHeadline: "Report Preview",
      printReportButton: "Print report / save as PDF",

      mobileStart: "Start",
      mobileTasks: "Jobs",
      mobilePlanning: "Planning",
      mobileCustomers: "Customers",

      placeholderLoginEmail: "Email",
      placeholderLoginPassword: "Password",
      placeholderSearch: "Search by customer, city, address, technician, machine type or reminder...",
      placeholderCustomerName: "Customer name, e.g. Bowling Arena Leipzig",
      placeholderCity: "City, e.g. Leipzig",
      placeholderAddress: "Address",
      placeholderPhone: "Phone number",
      placeholderEmail: "Email",
      placeholderLaneCount: "Number of lanes, e.g. 8",
      placeholderMaintenance: "Maintenance per lane, e.g. twice a year or €150",
      placeholderNote: "Note about the service case, maintenance or next follow-up",
      placeholderEditNote: "Note",
      placeholderAccountName: "First and last name",
      placeholderAccountPassword: "Password",

      fileBoxText: "Attach an image for repair or maintenance",

      optionAllStatus: "All statuses",
      optionOpen: "Open",
      optionProgress: "In Progress",
      optionDone: "Done",
      optionNotAssigned: "Not assigned",
      optionNoMachine: "Machine type / manufacturer not specified",
      optionNoReminder: "No reminder",

      systemBowling: "Bowling system",
      systemSkittles: "Skittles system",
      systemBoth: "Bowling and skittles system",

      serviceMaintenance: "Maintenance",
      serviceRepair: "Repair",
      serviceCallback: "Callback",
      serviceOffer: "Offer",
      serviceInspection: "Inspection",

      priorityNormalOption: "Priority: Normal",
      priorityHighOption: "Priority: High",
      priorityUrgentOption: "Priority: Urgent",

      reminderCall: "Call customer",
      reminderEmail: "Send email",
      reminderMaintenance: "Maintenance due",
      reminderFeedback: "Feedback pending",
      reminderConfirm: "Confirm appointment",

      roleAdmin: "Admin",
      roleEmployee: "Employee",

      statusOpen: "Open",
      statusProgress: "In Progress",
      statusDone: "Done",

      priorityNormal: "Normal",
      priorityHigh: "High",
      priorityUrgent: "Urgent",

      actionOpenFile: "Open file",
      actionOpen: "Open",
      actionReport: "Service report",
      actionReportShort: "Report",
      actionEdit: "Edit",
      actionDone: "Mark as done",
      actionDelete: "Delete",
      actionCall: "Call",
      actionEmail: "Email",
      actionRoute: "Route",

      labelCustomer: "Customer",
      labelCity: "City",
      labelAddress: "Address",
      labelPhone: "Phone",
      labelEmail: "Email",
      labelSystem: "System",
      labelMachineType: "Machine type",
      labelLanes: "Number of lanes",
      labelMaintenancePerLane: "Maintenance per lane",
      labelServiceType: "Service type",
      labelStatus: "Status",
      labelPriority: "Priority",
      labelAssignedTo: "Assigned to",
      labelNextDate: "Next appointment",
      labelCreatedBy: "Created by",
      labelCreatedAt: "Created at",
      labelUpdatedAt: "Updated at",
      labelCompletedAt: "Completed at",
      labelReportCreatedAt: "Report created at",
      labelTechnician: "Technician",
      labelAppointment: "Appointment",
      labelNote: "Note",
      labelServiceHistory: "Service history",
      labelImageDocumentation: "Image / documentation",
      labelReminder: "Reminder",
      labelWorkNotes: "Notes / completed work",
      labelSignatureEmployee: "Employee signature",
      labelSignatureCustomer: "Customer signature",

      notSpecified: "Not specified",
      unknown: "Unknown",
      notAssigned: "Not assigned",
      noNote: "No note available.",
      noReminder: "No reminder",
      noDateOpen: "Still open",
      locationOpen: "City open",
      addressOpen: "Address open",
      serviceCase: "Service case",
      entryCreated: "Entry created",
      entryEdited: "Entry edited",
      caseCompleted: "Service case completed",
      editedBy: "Edited by",
      completedBy: "Completed by",

      reminderOverdue: "{type} is overdue by {days} day(s).",
      reminderToday: "{type} is due today.",
      reminderSoon: "{type} in {days} day(s).",
      reminderDate: "{type} on {date}.",

      toastLanguageGerman: "Language: German",
      toastLanguageEnglish: "Language: English",
      toastDark: "Dark mode enabled.",
      toastLight: "Light mode enabled.",
      toastLoginFailed: "Login failed. Please check email and password.",
      toastWelcome: "Welcome back, {name}.",
      toastLoggedOut: "You have been logged out.",
      toastDemoLoaded: "Demo data has been loaded.",
      toastDemoReset: "Demo data has been reset.",
      toastCustomerSaved: "Customer / service case has been saved.",
      toastCustomerMissing: "Please enter at least a customer name.",
      toastCustomerNotFound: "Service case was not found.",
      toastChangesSaved: "Changes have been saved.",
      toastCaseDone: "Service case has been marked as done.",
      toastOnlyAdminsDelete: "Only admins are allowed to delete entries.",
      toastDeleted: "Entry has been deleted.",
      toastAccountCreated: "Team account has been created.",
      toastOnlyAdminsAccounts: "Only admins are allowed to create team accounts.",
      toastAccountMissing: "Please fill in name, email and password.",
      toastEmailExists: "This email address is already in use.",
      toastStatusChanged: "Status changed: {status}",

      confirmLogout: "Do you really want to log out?",
      confirmLoadDemo: "Load demo data? Existing demo data will be replaced.",
      confirmResetDemo: "Do you really want to delete all customers and demo data?",
      confirmDelete: "Do you really want to delete this service case?"
    }
  };

  function getLanguage() {
    return localStorage.getItem(STORAGE_KEY) || "de";
  }

  function setLanguage(language) {
    const safeLanguage = translations[language] ? language : "de";
    localStorage.setItem(STORAGE_KEY, safeLanguage);
    applyLanguage();
  }

  function toggleLanguage() {
    const nextLanguage = getLanguage() === "de" ? "en" : "de";
    setLanguage(nextLanguage);

    if (typeof UIService !== "undefined") {
      UIService.showToast(nextLanguage === "de" ? t("toastLanguageGerman") : t("toastLanguageEnglish"));
    }
  }

  function t(key, replacements = {}) {
    const language = getLanguage();
    let text = translations[language]?.[key] || translations.de[key] || key;

    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replaceAll(`{${placeholder}}`, value);
    });

    return text;
  }

  function applyLanguage() {
    document.documentElement.lang = getLanguage();
    document.title = t("appTitle");

    updateLogin();
    updateWelcome();
    updateNavigation();
    updateTopbar();
    updateDashboard();
    updatePages();
    updateForms();
    updateMobileNavigation();
  }

  function updateLogin() {
    setText("#loginView .eyebrow", t("prototype"));
    setText("#loginView h1", t("appTitle"));
    setText("#loginView .subtitle", t("loginSubtitle"));
    setText("#loginButton", t("loginButton"));
    setText("#loginView .hint", t("demoHint"));
  }

  function updateWelcome() {
    setText("#welcomeView .eyebrow", t("welcomeEyebrow"));
    setText("#welcomeTitle", t("welcomeTitle"));
    setText("#welcomeText", t("welcomeText"));
  }

  function updateNavigation() {
    const navItems = [
      ["dashboardPage", "navDashboard"],
      ["technicianPage", "navTechnician"],
      ["calendarPage", "navCalendar"],
      ["remindersPage", "navImportant"],
      ["customersPage", "navCustomers"],
      ["newCustomerPage", "navNewCustomer"],
      ["statusBoardPage", "navStatusBoard"],
      ["reportsPage", "navReports"],
      ["teamPage", "navTeam"],
      ["settingsPage", "navSettings"]
    ];

    navItems.forEach(([pageId, key]) => {
      document.querySelectorAll(`.menu-link[data-page="${pageId}"]`).forEach(button => {
        button.textContent = t(key);
      });
    });

    setText("#helpMenuButton", t("navHelp"));
    setText("#sideMenu .side-menu-header .eyebrow", "Serviceportal");
    setText("#sideMenu .side-menu-header h2", t("navigation"));
    setText(".side-menu-footer p", t("loggedInAs"));
    setText(".app-version", t("presentationVersion"));
  }

  function updateTopbar() {
    setText(".topbar .eyebrow", t("prototype"));
    setText(".topbar h1", t("appTitle"));
    setText(".topbar .subtitle", t("topSubtitle"));
    setText("#languageButton", t("languageButton"));
    setText("#languageButtonSettings", t("languageButton"));
    setText("#themeButton", t("themeButton"));
    setText("#themeButtonSettings", t("themeButtonLong"));
    setText("#logoutButton", t("logoutButton"));
  }

  function updateDashboard() {
    setText("#dashboardPage .hero-panel .eyebrow", t("dashboardEyebrow"));
    setText("#dashboardGreeting", t("dashboardHeadline"));
    setText("#dashboardPage .portal-badge", t("portalBadge"));

    setDashboardStat(0, "statCustomers", "statCustomersSub");
    setDashboardStat(1, "statOpen", "statOpenSub");
    setDashboardStat(2, "statDue", "statDueSub");
    setDashboardStat(3, "statUrgent", "statUrgentSub");
    setDashboardStat(4, "statAccounts", "statAccountsSub");

    setPanelHeader("#dashboardPage .important-dashboard-panel", "importantEyebrow", "importantHeadline");
    setPanelHeader("#dashboardPage .dashboard-grid article:nth-child(2)", "quickEyebrow", "quickHeadline");

    const quickButtons = document.querySelectorAll("#dashboardPage .quick-actions-column button");
    const quickKeys = [
      "quickTechnician",
      "quickCalendar",
      "quickNewCustomer",
      "quickStatusBoard",
      "quickCustomers",
      "quickReports"
    ];

    quickButtons.forEach((button, index) => {
      if (quickKeys[index]) {
        button.textContent = t(quickKeys[index]);
      }
    });
  }

  function setDashboardStat(index, titleKey, subtitleKey) {
    const card = document.querySelectorAll("#dashboardPage .stat-card")[index];

    if (!card) {
      return;
    }

    const title = card.querySelector("p");
    const subtitle = card.querySelector("span");

    if (title) {
      title.textContent = t(titleKey);
    }

    if (subtitle) {
      subtitle.textContent = t(subtitleKey);
    }
  }

  function updatePages() {
    document.querySelectorAll(".back-button").forEach(button => {
      button.textContent = t("backDashboard");
    });

    setText("#technicianPage .technician-hero .eyebrow", t("technicianEyebrow"));
    setText("#technicianPage .technician-hero h2", t("technicianHeadline"));
    setText("#technicianIntro", t("technicianIntro"));
    setText("#technicianPage .technician-badge", t("technicianBadge"));

    setTechnicianStat(0, "technicianOpen", "technicianOpenSub");
    setTechnicianStat(1, "technicianProgress", "technicianProgressSub");
    setTechnicianStat(2, "technicianUrgent", "technicianUrgentSub");
    setTechnicianStat(3, "technicianDone", "technicianDoneSub");

    const technicianPanels = document.querySelectorAll("#technicianPage .panel");

    if (technicianPanels[0]) {
      setPanelHeaderElement(technicianPanels[0], "technicianTodayEyebrow", "technicianRouteHeadline");
    }

    if (technicianPanels[1]) {
      setPanelHeaderElement(technicianPanels[1], "technicianUpcomingEyebrow", "technicianUpcomingHeadline");
    }

    setPanelHeader("#calendarPage .panel", "calendarEyebrow", "calendarHeadline");
    setPanelHeader("#remindersPage .panel", "importantEyebrow", "importantHeadline");
    setPanelHeader("#customersPage .panel", "customersEyebrow", "customersHeadline");
    setPanelHeader("#newCustomerPage .panel", "newCustomerEyebrow", "newCustomerHeadline");
    setPanelHeader("#statusBoardPage .panel", "statusBoardEyebrow", "statusBoardHeadline");
    setPanelHeader("#reportsPage .panel", "reportsEyebrow", "reportsHeadline");
    setPanelHeader("#teamAdminPanel", "teamEyebrow", "teamHeadline");
    setPanelHeader("#teamAccessNotice", "teamRestrictedEyebrow", "teamRestrictedHeadline");
    setPanelHeader("#settingsPage .panel", "settingsEyebrow", "settingsHeadline");

    setText("#teamAccessNotice .muted-text", t("teamRestrictedText"));

    const settingsTexts = document.querySelectorAll("#settingsPage .panel > .muted-text");

    if (settingsTexts[0]) {
      settingsTexts[0].textContent = t("settingsVersion");
    }

    if (settingsTexts[1]) {
      settingsTexts[1].textContent = t("settingsInfo");
    }

    if (settingsTexts[2]) {
      settingsTexts[2].textContent = t("settingsDeveloper");
    }

    setText("#helpModal .eyebrow", t("helpEyebrow"));
    setText("#helpModal h2", t("helpHeadline"));
    setText("#helpModal .help-content p:nth-of-type(2)", t("helpText"));

    setText("#customerDetailModal .eyebrow", t("detailEyebrow"));
    setText("#customerDetailModal h2", t("detailHeadline"));

    setText("#editCustomerModal .eyebrow", t("editEyebrow"));
    setText("#editCustomerModal h2", t("editHeadline"));

    setText("#reportModal .eyebrow", t("reportEyebrow"));
    setText("#reportModal h2", t("reportHeadline"));

    setText("#loadDemoDataButton", t("loadDemoButton"));
    setText("#resetDataButton", t("resetDemoButton"));
    setText("#printReportButton", t("printReportButton"));
  }

  function setTechnicianStat(index, titleKey, subtitleKey) {
    const card = document.querySelectorAll("#technicianPage .stat-card")[index];

    if (!card) {
      return;
    }

    const title = card.querySelector("p");
    const subtitle = card.querySelector("span");

    if (title) {
      title.textContent = t(titleKey);
    }

    if (subtitle) {
      subtitle.textContent = t(subtitleKey);
    }
  }

  function setPanelHeader(selector, eyebrowKey, headlineKey) {
    const panel = document.querySelector(selector);

    if (!panel) {
      return;
    }

    setPanelHeaderElement(panel, eyebrowKey, headlineKey);
  }

  function setPanelHeaderElement(panel, eyebrowKey, headlineKey) {
    const eyebrow = panel.querySelector(".panel-header .eyebrow");
    const headline = panel.querySelector(".panel-header h2");

    if (eyebrow) {
      eyebrow.textContent = t(eyebrowKey);
    }

    if (headline) {
      headline.textContent = t(headlineKey);
    }
  }

  function updateForms() {
    setPlaceholder("loginEmail", "placeholderLoginEmail");
    setPlaceholder("loginPassword", "placeholderLoginPassword");
    setPlaceholder("customerSearch", "placeholderSearch");

    setPlaceholder("customerName", "placeholderCustomerName");
    setPlaceholder("customerCity", "placeholderCity");
    setPlaceholder("customerAddress", "placeholderAddress");
    setPlaceholder("customerPhone", "placeholderPhone");
    setPlaceholder("customerEmail", "placeholderEmail");
    setPlaceholder("laneCount", "placeholderLaneCount");
    setPlaceholder("maintenancePerLane", "placeholderMaintenance");
    setPlaceholder("note", "placeholderNote");

    setPlaceholder("editCustomerName", "placeholderCustomerName");
    setPlaceholder("editCustomerCity", "placeholderCity");
    setPlaceholder("editCustomerAddress", "placeholderAddress");
    setPlaceholder("editCustomerPhone", "placeholderPhone");
    setPlaceholder("editCustomerEmail", "placeholderEmail");
    setPlaceholder("editLaneCount", "placeholderLaneCount");
    setPlaceholder("editMaintenancePerLane", "placeholderMaintenance");
    setPlaceholder("editNote", "placeholderEditNote");

    setPlaceholder("accountName", "placeholderAccountName");
    setPlaceholder("accountEmail", "placeholderEmail");
    setPlaceholder("accountPassword", "placeholderAccountPassword");

    setText("#fileBoxText", t("fileBoxText"));

    setText("#customerForm button[type='submit']", t("saveCustomerButton"));
    setText("#editCustomerForm button[type='submit']", t("saveChangesButton"));
    setText("#accountForm button[type='submit']", t("createAccountButton"));

    updateSelectTexts();
  }

  function updateSelectTexts() {
    updateOptionText("statusFilter", 0, "optionAllStatus");
    updateOptionText("statusFilter", 1, "optionOpen");
    updateOptionText("statusFilter", 2, "optionProgress");
    updateOptionText("statusFilter", 3, "optionDone");

    updateSystemSelect("customerSystem");
    updateSystemSelect("editCustomerSystem");

    updateOptionText("machineType", 0, "optionNoMachine");
    updateOptionText("editMachineType", 0, "optionNoMachine");

    updateServiceSelect("serviceType");
    updateServiceSelect("editServiceType");

    updatePrioritySelect("priority");
    updatePrioritySelect("editPriority");

    updateOptionText("assignedTo", 0, "optionNotAssigned");
    updateOptionText("editAssignedTo", 0, "optionNotAssigned");

    updateStatusSelect("status");
    updateStatusSelect("editStatus");

    updateReminderSelect("reminderType");
    updateReminderSelect("editReminderType");

    updateAccountRoleSelect();
  }

  function updateSystemSelect(selectId) {
    updateOptionText(selectId, 0, "systemBowling");
    updateOptionText(selectId, 1, "systemSkittles");
    updateOptionText(selectId, 2, "systemBoth");
  }

  function updateServiceSelect(selectId) {
    updateOptionText(selectId, 0, "serviceMaintenance");
    updateOptionText(selectId, 1, "serviceRepair");
    updateOptionText(selectId, 2, "serviceCallback");
    updateOptionText(selectId, 3, "serviceOffer");
    updateOptionText(selectId, 4, "serviceInspection");
  }

  function updatePrioritySelect(selectId) {
    updateOptionText(selectId, 0, "priorityNormalOption");
    updateOptionText(selectId, 1, "priorityHighOption");
    updateOptionText(selectId, 2, "priorityUrgentOption");
  }

  function updateStatusSelect(selectId) {
    updateOptionText(selectId, 0, "optionOpen");
    updateOptionText(selectId, 1, "optionProgress");
    updateOptionText(selectId, 2, "optionDone");
  }

  function updateReminderSelect(selectId) {
    updateOptionText(selectId, 0, "optionNoReminder");
    updateOptionText(selectId, 1, "reminderCall");
    updateOptionText(selectId, 2, "reminderEmail");
    updateOptionText(selectId, 3, "reminderMaintenance");
    updateOptionText(selectId, 4, "reminderFeedback");
    updateOptionText(selectId, 5, "reminderConfirm");
  }

  function updateAccountRoleSelect() {
    updateOptionText("accountRole", 0, "roleEmployee");
    updateOptionText("accountRole", 1, "roleAdmin");
  }

  function updateMobileNavigation() {
    const labels = document.querySelectorAll(".mobile-nav-button small");

    const keys = [
      "mobileStart",
      "mobileTasks",
      "mobilePlanning",
      "mobileCustomers"
    ];

    labels.forEach((label, index) => {
      if (keys[index]) {
        label.textContent = t(keys[index]);
      }
    });
  }

  function setPlaceholder(id, key) {
    const element = document.getElementById(id);

    if (element) {
      element.placeholder = t(key);
    }
  }

  function updateOptionText(selectId, optionIndex, key) {
    const select = document.getElementById(selectId);

    if (!select || !select.options[optionIndex]) {
      return;
    }

    select.options[optionIndex].textContent = t(key);
  }

  function setText(selector, text) {
    const element = document.querySelector(selector);

    if (element) {
      element.textContent = text;
    }
  }

  return {
    getLanguage,
    setLanguage,
    toggleLanguage,
    applyLanguage,
    t
  };
})();