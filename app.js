const STORAGE_KEY = "controle-empresas-taxi:v5";
const DEFAULT_KM_RATE = 1.5;

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});
const numberFormatter = new Intl.NumberFormat("pt-BR");

const configs = {
  levo: {
    title: "Levo",
    screenTitle: "Controle de Taxi",
    personField: "collaborator",
    statusField: "situation",
    valueField: "value",
    columns: [
      { key: "registration", label: "Matrícula", type: "text" },
      { key: "date", label: "Data", type: "date" },
      { key: "cc", label: "CC", type: "text" },
      { key: "collaborator", label: "Colaborador", type: "text" },
      { key: "description", label: "Descrição da viagem", type: "text" },
      { key: "authorizer", label: "Autorizador", type: "text" },
      { key: "value", label: "Valor do frete", type: "money", sensitive: true },
      { key: "kmStart", label: "KM saída", type: "number", sensitive: true },
      { key: "kmEnd", label: "KM chegada", type: "number", readonly: true, sensitive: true },
      { key: "situation", label: "Situação", type: "select", options: ["CONCLUÍDO", "AUTORIZADOR", "PENDENTE"] },
      { key: "km", label: "KM", type: "number", sensitive: true },
    ],
  },
  bomSabor: {
    title: "Bom Sabor",
    screenTitle: "Bom Sabor",
    personField: "collaborator",
    valueField: "value",
    columns: [
      { key: "date", label: "Data", type: "date" },
      { key: "collaborator", label: "Colaborador", type: "text" },
      { key: "description", label: "Descrição", type: "text" },
      { key: "value", label: "Valor", type: "money" },
    ],
  },
  encubatorio: {
    title: "Encubatório",
    screenTitle: "Encubatório",
    personField: "collaborator",
    valueField: "value",
    columns: [
      { key: "date", label: "Data", type: "date" },
      { key: "collaborator", label: "Colaborador", type: "text" },
      { key: "description", label: "Descrição", type: "text" },
      { key: "value", label: "Valor", type: "money" },
    ],
  },
  viagensClientes: {
    title: "Viagens de Clientes",
    screenTitle: "Viagens de Clientes",
    personField: "collaborator",
    personLabel: "Cliente",
    peopleLabel: "Clientes",
    valueField: "value",
    columns: [
      { key: "date", label: "Data", type: "date" },
      { key: "collaborator", label: "Clientes", type: "text" },
      { key: "description", label: "Descrição", type: "text" },
      { key: "value", label: "Valor", type: "money" },
    ],
  },
  taxista: {
    title: "Taxista",
    screenTitle: "Taxista",
    personField: "collaborator",
    valueField: "value",
    columns: [
      { key: "date", label: "Data", type: "date" },
      { key: "collaborator", label: "Taxista", type: "text" },
      { key: "description", label: "Descrição", type: "text" },
      { key: "value", label: "Valor", type: "money" },
    ],
  },
};

const sampleData = {
  levo: [
    ["5119", "2026-06-01", "62", "Wesley Gimenes Ribeiro", "Ida e volta hospital", "Angélica", 104071, 104111, "CONCLUÍDO"],
    ["15031", "2026-06-02", "", "Vinícius Tavares Pereira", "Ida e volta hospital", "Íris", 105074, 105114, "CONCLUÍDO"],
    ["6777", "2026-06-03", "", "Bruno Fernandes Lopes", "Levei em Esperança Nova", "Angélica", 105197, 105359, "CONCLUÍDO"],
    ["15271", "2026-06-03", "577", "Carlos Daniel", "Levei p casa", "Brenda", 105412, 105432, "CONCLUÍDO"],
    ["17158", "2026-06-04", "", "Yasmim da Silva Azevedo", "Ida e volta hospital", "Íris", 105501, 105541, "CONCLUÍDO"],
    ["16654", "2026-06-04", "", "Nicoly Becher", "Ida e volta hospital", "Íris", 105673, 105713, "CONCLUÍDO"],
    ["15638", "2026-06-05", "", "Emirda Josefina Perez Carrillo", "Ida e volta hospital", "Íris", 105913, 105953, "AUTORIZADOR"],
    ["11867", "2026-06-05", "", "Sandro Junior Lopez dos Santos", "Levei p casa", "Newton", 105978, 105998, "AUTORIZADOR"],
    ["16923", "2026-06-06", "", "Elizeu Sousa de Oliveira", "Ida e volta Mirante", "Marciel", 0, 0, "PENDENTE"],
    ["6890", "2026-06-06", "", "Mauro Cesar Ribeiro dos Santos", "Ida e volta Pérola passando por Altônia", "Erasmo", 0, 0, "PENDENTE"],
  ].map(([registration, date, cc, collaborator, description, authorizer, kmStart, kmEnd, situation]) =>
    withId(calculateLevo({ registration, date, cc, collaborator, description, authorizer, kmStart, kmEnd, situation }, DEFAULT_KM_RATE))
  ),
  bomSabor: [
    withId({ date: "2026-06-03", collaborator: "João", description: "Entrega local", value: 120 }),
    withId({ date: "2026-06-05", collaborator: "Maria", description: "Compra de materiais", value: 85.5 }),
  ],
  encubatorio: [
    withId({ date: "2026-06-04", collaborator: "Carlos", description: "Serviço externo", value: 210 }),
  ],
  viagensClientes: [
    withId({ date: "2026-06-05", collaborator: "Plusval", description: "Viagem de cliente", value: 19530 }),
  ],
  taxista: [],
};

const state = {
  activeTab: "levo",
  data: { levo: [], bomSabor: [], encubatorio: [], viagensClientes: [], taxista: [] },
  editingId: null,
  filters: { search: "", person: "", status: "", archiveMonth: "", start: "", end: "" },
  hiddenColumns: { levo: [] },
  kmRate: DEFAULT_KM_RATE,
  sort: { key: "date", direction: "asc" },
};

const elements = {
  averageValue: document.querySelector("#averageValue"),
  appShell: document.querySelector("#appShell"),
  cancelEditButton: document.querySelector("#cancelEditButton"),
  clearFiltersButton: document.querySelector("#clearFiltersButton"),
  coverScreen: document.querySelector("#coverScreen"),
  emptyTable: document.querySelector("#emptyTable"),
  endFilter: document.querySelector("#endFilter"),
  enterAppButton: document.querySelector("#enterAppButton"),
  exportButton: document.querySelector("#exportButton"),
  formFields: document.querySelector("#formFields"),
  formTitle: document.querySelector("#formTitle"),
  kmRateInput: document.querySelector("#kmRateInput"),
  levoTotalHeader: document.querySelector("#levoTotalHeader"),
  monthFilter: document.querySelector("#monthFilter"),
  newRecordButton: document.querySelector("#newRecordButton"),
  pdfButton: document.querySelector("#pdfButton"),
  peopleSummaryLabel: document.querySelector("#peopleSummaryLabel"),
  personFilter: document.querySelector("#personFilter"),
  personFilterLabel: document.querySelector("#personFilterLabel"),
  ratePanel: document.querySelector("#ratePanel"),
  recordForm: document.querySelector("#recordForm"),
  recordsTable: document.querySelector("#recordsTable"),
  resultCount: document.querySelector("#resultCount"),
  saveButton: document.querySelector("#saveButton"),
  screenTitle: document.querySelector("#screenTitle"),
  searchInput: document.querySelector("#searchInput"),
  startFilter: document.querySelector("#startFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  statusFilterWrap: document.querySelector("#statusFilterWrap"),
  tableHead: document.querySelector("#tableHead"),
  tableTitle: document.querySelector("#tableTitle"),
  totalPeople: document.querySelector("#totalPeople"),
  totalRecords: document.querySelector("#totalRecords"),
  totalValue: document.querySelector("#totalValue"),
  whatsappButton: document.querySelector("#whatsappButton"),
};

function withId(record) {
  return { ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
}

function calculateLevo(record, rate = state.kmRate) {
  const kmStart = Number(record.kmStart || 0);
  const previousKmEnd = Number(record.kmEnd || 0);
  const informedKm = record.km === "" || record.km === undefined ? Math.max(0, previousKmEnd - kmStart) : Number(record.km || 0);
  const kmEnd = kmStart + informedKm;
  const value = record.value === "" || record.value === undefined ? informedKm * rate : parseDecimal(record.value);
  return { ...record, km: informedKm, kmEnd, value };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
    state.data = { ...sampleData, ...state.data };
    state.filters = { search: "", person: "", status: "", archiveMonth: "", start: "", end: "", ...state.filters };
    state.hiddenColumns = { levo: [], ...state.hiddenColumns };
    state.editingId = null;
    return;
  }
  state.data = sampleData;
  saveState();
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      activeTab: state.activeTab,
      data: state.data,
      filters: state.filters,
      hiddenColumns: state.hiddenColumns,
      kmRate: state.kmRate,
      sort: state.sort,
    })
  );
}

function bindEvents() {
  elements.enterAppButton.addEventListener("click", enterApp);
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });
  elements.recordForm.addEventListener("submit", saveFromForm);
  elements.newRecordButton.addEventListener("click", startNewRecord);
  elements.cancelEditButton.addEventListener("click", startNewRecord);
  elements.clearFiltersButton.addEventListener("click", clearFilters);
  elements.exportButton.addEventListener("click", exportCsv);
  elements.pdfButton.addEventListener("click", exportPdf);
  elements.whatsappButton.addEventListener("click", shareWhatsApp);
  elements.searchInput.addEventListener("input", (event) => updateFilter("search", event.target.value));
  elements.personFilter.addEventListener("change", (event) => updateFilter("person", event.target.value));
  elements.statusFilter.addEventListener("change", (event) => updateFilter("status", event.target.value));
  elements.monthFilter.addEventListener("input", (event) => updateFilter("archiveMonth", event.target.value));
  elements.startFilter.addEventListener("input", (event) => updateFilter("start", event.target.value));
  elements.endFilter.addEventListener("input", (event) => updateFilter("end", event.target.value));
  elements.kmRateInput.addEventListener("input", updateKmRate);
}

function enterApp() {
  elements.coverScreen.classList.add("is-hidden");
  elements.appShell.classList.remove("is-hidden");
}

function setActiveTab(tabKey) {
  state.activeTab = tabKey;
  state.editingId = null;
  state.filters = { search: "", person: "", status: "", archiveMonth: "", start: "", end: "" };
  state.sort = { key: "date", direction: "asc" };
  saveState();
  render();
  startNewRecord();
}

function updateKmRate(event) {
  state.kmRate = parseDecimal(event.target.value);
  state.data.levo = state.data.levo.map((record) => {
    const kmStart = Number(record.kmStart || 0);
    const km = record.km === "" || record.km === undefined ? Math.max(0, Number(record.kmEnd || 0) - kmStart) : Number(record.km || 0);
    return calculateLevo({ ...record, km, value: km * state.kmRate });
  });
  saveState();
  renderTable();
  renderSummary();
}

function updateFilter(key, value) {
  state.filters[key] = value;
  saveState();
  renderTable();
  renderSummary();
}

function getConfig() {
  return configs[state.activeTab];
}

function getRecords() {
  return state.data[state.activeTab];
}

function saveFromForm(event) {
  event.preventDefault();
  const config = getConfig();
  let record = {};

  config.columns.forEach((column) => {
    const input = document.querySelector(`[name="${column.key}"]`);
    if (!input || column.readonly) return;
    record[column.key] = column.type === "number" || column.type === "money" ? parseDecimal(input.value) : input.value.trim();
  });

  if (state.activeTab === "levo") {
    record = calculateLevo(record);
  }

  const records = getRecords();
  if (state.editingId) {
    const current = records.find((item) => item.id === state.editingId);
    Object.assign(current, record);
  } else {
    records.push(withId(record));
  }

  saveState();
  startNewRecord();
  render();
}

function editRecord(id) {
  const record = getRecords().find((item) => item.id === id);
  if (!record) return;

  state.editingId = id;
  elements.formTitle.textContent = `Editar ${getConfig().title}`;
  elements.saveButton.textContent = "Atualizar registro";
  getConfig().columns.forEach((column) => {
    const input = document.querySelector(`[name="${column.key}"]`);
    if (!input) return;
    input.value = record[column.key] ?? "";
  });
}

function deleteRecord(id) {
  const confirmed = window.confirm("Excluir este registro?");
  if (!confirmed) return;

  state.data[state.activeTab] = getRecords().filter((record) => record.id !== id);
  if (state.editingId === id) state.editingId = null;
  saveState();
  render();
  startNewRecord();
}

function startNewRecord() {
  state.editingId = null;
  elements.recordForm.reset();
  elements.formTitle.textContent = `Novo registro - ${getConfig().title}`;
  elements.saveButton.textContent = "Salvar registro";
  const dateInput = document.querySelector('[name="date"]');
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
  const situationInput = document.querySelector('[name="situation"]');
  if (situationInput) situationInput.value = "CONCLUÍDO";
}

function clearFilters() {
  state.filters = { search: "", person: "", status: "", archiveMonth: "", start: "", end: "" };
  elements.searchInput.value = "";
  elements.personFilter.value = "";
  elements.statusFilter.value = "";
  elements.monthFilter.value = "";
  elements.startFilter.value = "";
  elements.endFilter.value = "";
  saveState();
  render();
}

function getFilteredRecords() {
  const config = getConfig();
  const search = normalize(state.filters.search);
  return getRecords().filter((record) => {
    const content = normalize(config.columns.map((column) => record[column.key]).join(" "));
    const personValue = record[config.personField] || "";
    const statusValue = config.statusField ? record[config.statusField] || "" : "";
    const matchesSearch = !search || content.includes(search);
    const matchesPerson = !state.filters.person || personValue === state.filters.person;
    const matchesStatus = !state.filters.status || statusValue === state.filters.status;
    const matchesArchiveMonth = !state.filters.archiveMonth || getArchiveMonth(record.date) === state.filters.archiveMonth;
    const matchesStart = !state.filters.start || record.date >= state.filters.start;
    const matchesEnd = !state.filters.end || record.date <= state.filters.end;
    return matchesSearch && matchesPerson && matchesStatus && matchesArchiveMonth && matchesStart && matchesEnd;
  });
}

function getSortedRecords() {
  const records = [...getFilteredRecords()];
  const direction = state.sort.direction === "asc" ? 1 : -1;
  records.sort((a, b) => {
    const aValue = typeof a[state.sort.key] === "number" ? a[state.sort.key] : normalize(a[state.sort.key]);
    const bValue = typeof b[state.sort.key] === "number" ? b[state.sort.key] : normalize(b[state.sort.key]);
    if (aValue > bValue) return direction;
    if (aValue < bValue) return -direction;
    return 0;
  });
  return records;
}

function render() {
  const config = getConfig();
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });
  elements.screenTitle.textContent = config.screenTitle;
  elements.tableTitle.textContent = config.title;
  elements.peopleSummaryLabel.textContent = config.peopleLabel || "Colaboradores";
  elements.personFilterLabel.textContent = config.personLabel || "Colaborador";
  elements.ratePanel.classList.toggle("hidden", state.activeTab !== "levo");
  elements.statusFilterWrap.classList.toggle("hidden", state.activeTab !== "levo");
  elements.kmRateInput.value = state.kmRate;
  renderForm();
  renderFilters();
  renderTableHead();
  renderTable();
  renderSummary();
}

function renderForm() {
  elements.formFields.innerHTML = "";
  getConfig().columns.forEach((column) => {
    const label = document.createElement("label");
    label.className = "field";
    label.textContent = column.label;
    const input = createInput(column);
    input.name = column.key;
    input.readOnly = Boolean(column.readonly);
    if (column.key === "description") input.placeholder = "Detalhes do lançamento";
    label.append(input);
    elements.formFields.append(label);
  });
  bindLevoAutoFields();
}

function createInput(column) {
  if (column.type === "select") {
    const select = document.createElement("select");
    column.options.forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      select.append(option);
    });
    return select;
  }

  const input = document.createElement("input");
  input.type = column.type === "money" || column.type === "number" ? "text" : column.type;
  if (column.type === "money" || column.type === "number") {
    input.inputMode = "decimal";
    input.pattern = "[0-9]*[,.]?[0-9]*";
  }
  return input;
}

function bindLevoAutoFields() {
  if (state.activeTab !== "levo") return;

  const kmStartInput = document.querySelector('[name="kmStart"]');
  const kmInput = document.querySelector('[name="km"]');
  const kmEndInput = document.querySelector('[name="kmEnd"]');
  const valueInput = document.querySelector('[name="value"]');
  if (!kmStartInput || !kmInput || !kmEndInput || !valueInput) return;

    const updateFromKm = () => {
    const kmStart = parseDecimal(kmStartInput.value);
    const km = parseDecimal(kmInput.value);
    kmEndInput.value = kmStart + km;
    valueInput.value = (km * state.kmRate).toFixed(2);
  };

  kmStartInput.addEventListener("input", updateFromKm);
  kmInput.addEventListener("input", updateFromKm);
}

function renderFilters() {
  const config = getConfig();
  const people = [...new Set(getRecords().map((record) => record[config.personField]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
  elements.personFilter.innerHTML = `<option value="">Todos</option>`;
  people.forEach((person) => elements.personFilter.append(new Option(person, person)));
  elements.personFilter.value = state.filters.person;

  elements.statusFilter.innerHTML = `<option value="">Todas</option>`;
  if (config.statusField) {
    [...new Set(getRecords().map((record) => record[config.statusField]).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .forEach((status) => elements.statusFilter.append(new Option(status, status)));
  }
  elements.statusFilter.value = state.filters.status;
  elements.searchInput.value = state.filters.search;
  elements.monthFilter.value = state.filters.archiveMonth;
  elements.startFilter.value = state.filters.start;
  elements.endFilter.value = state.filters.end;
}

function renderTableHead() {
  const cells = getConfig().columns
    .map((column) => {
      const hidden = isColumnHidden(column.key);
      const eyeButton = isSensitiveColumn(column)
        ? `<button class="eye-toggle${hidden ? " is-off" : ""}" type="button" data-toggle-column="${column.key}" title="${
            hidden ? "Mostrar coluna" : "Ocultar coluna"
          }">${hidden ? "◌" : "👁"}</button>`
        : "";
      return `<th><div class="th-content"><button class="sort-button" type="button" data-sort="${column.key}">${escapeHtml(
        column.label
      )}</button>${eyeButton}</div></th>`;
    })
    .join("");
  elements.tableHead.innerHTML = `<tr>${cells}<th>Ações</th></tr>`;
  elements.tableHead.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      state.sort = {
        key,
        direction: state.sort.key === key && state.sort.direction === "asc" ? "desc" : "asc",
      };
      saveState();
      renderTable();
    });
  });
  elements.tableHead.querySelectorAll("[data-toggle-column]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleColumnVisibility(button.dataset.toggleColumn);
    });
  });
}

function toggleColumnVisibility(columnKey) {
  const hidden = new Set(state.hiddenColumns[state.activeTab] || []);
  hidden.has(columnKey) ? hidden.delete(columnKey) : hidden.add(columnKey);
  state.hiddenColumns[state.activeTab] = [...hidden];
  saveState();
  renderTableHead();
  renderTable();
  renderSummary();
}

function renderTable() {
  const config = getConfig();
  const records = getSortedRecords();
  elements.recordsTable.innerHTML = "";
  elements.emptyTable.classList.toggle("show", records.length === 0);
  elements.resultCount.textContent = `${numberFormatter.format(records.length)} registro${records.length === 1 ? "" : "s"}`;

  records.forEach((record) => {
    const row = document.createElement("tr");
    if (config.statusField) {
      row.className = getStatusClass(record[config.statusField]);
    }
    row.innerHTML = `${config.columns.map((column) => tableCell(record, column)).join("")}
      <td class="actions-cell">
        <button class="table-button" type="button" data-action="edit" data-id="${record.id}">Editar</button>
        <button class="table-button danger" type="button" data-action="delete" data-id="${record.id}">Excluir</button>
      </td>`;
    elements.recordsTable.append(row);
  });

  elements.recordsTable.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      button.dataset.action === "edit" ? editRecord(button.dataset.id) : deleteRecord(button.dataset.id);
    });
  });
}

function tableCell(record, column) {
  if (isColumnHidden(column.key)) {
    return `<td class="masked-cell">••••</td>`;
  }
  let value = record[column.key];
  if (column.type === "date") value = formatDate(value);
  if (column.type === "money") value = moneyFormatter.format(Number(value || 0));
  if (column.key === "situation") return `<td><span class="status-pill">${escapeHtml(value || "-")}</span></td>`;
  const className = column.type === "money" || column.key === "km" ? " class=\"money-cell\"" : "";
  return `<td${className}>${escapeHtml(value || value === 0 ? value : "-")}</td>`;
}

function isSensitiveColumn(column) {
  return state.activeTab === "levo" && Boolean(column.sensitive);
}

function isColumnHidden(columnKey) {
  return (state.hiddenColumns[state.activeTab] || []).includes(columnKey);
}

function getReportColumns(config) {
  return config.columns.filter((column) => !isColumnHidden(column.key));
}

function getStatusClass(status) {
  const normalized = normalize(status);
  if (normalized.includes("concluido")) return "status-concluido";
  if (normalized.includes("pendente")) return "status-pendente";
  if (normalized.includes("autorizador")) return "status-autorizador";
  return "";
}

function renderSummary() {
  const config = getConfig();
  const records = getFilteredRecords();
  const total = records.reduce((sum, record) => sum + Number(record[config.valueField] || 0), 0);
  const people = new Set(records.map((record) => record[config.personField]).filter(Boolean));
  const valueHidden = isColumnHidden(config.valueField);
  elements.totalRecords.textContent = numberFormatter.format(records.length);
  elements.totalPeople.textContent = numberFormatter.format(people.size);
  elements.totalValue.textContent = valueHidden ? "Oculto" : moneyFormatter.format(total);
  elements.averageValue.textContent = valueHidden ? "Oculto" : moneyFormatter.format(records.length ? total / records.length : 0);
  elements.levoTotalHeader.textContent = valueHidden ? "Oculto" : moneyFormatter.format(total);
}

function exportCsv() {
  const config = getConfig();
  const columns = getReportColumns(config);
  const header = columns.map((column) => column.label);
  const rows = getSortedRecords().map((record) => columns.map((column) => displayValue(record, column, false)));
  const csv = [header, ...rows].map((line) => line.map(csvCell).join(";")).join("\n");
  downloadBlob(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }), `${config.title}_${getArchiveSuffix()}_registros.csv`);
}

function exportPdf() {
  downloadBlob(createPdfBlob(), getPdfFilename());
}

async function shareWhatsApp() {
  const pdfBlob = createPdfBlob();
  const pdfFile = new File([pdfBlob], getPdfFilename(), { type: "application/pdf" });
  const message = buildShareMessage();

  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        title: getConfig().title,
        text: message,
        files: [pdfFile],
      });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  downloadBlob(pdfBlob, getPdfFilename());
  window.open(`https://wa.me/?text=${encodeURIComponent(`${message}\n\nPDF baixado no aparelho. Anexe o arquivo baixado nesta conversa.`)}`, "_blank", "noopener");
}

function createPdfBlob() {
  return new Blob([createPdf(buildReportLines())], { type: "application/pdf" });
}

function getPdfFilename() {
  return `${getConfig().title}_${getArchiveSuffix()}_registros.pdf`;
}

function buildShareMessage() {
  const config = getConfig();
  const records = getSortedRecords();
  const total = records.reduce((sum, record) => sum + Number(record[config.valueField] || 0), 0);
  const valueHidden = isColumnHidden(config.valueField);
  const lines = records
    .slice(0, 8)
    .map((record) =>
      valueHidden
        ? `${formatDate(record.date)} - ${record[config.personField] || "-"}`
        : `${formatDate(record.date)} - ${record[config.personField] || "-"} - ${moneyFormatter.format(Number(record[config.valueField] || 0))}`
    )
    .join("\n");
  const more = records.length > 8 ? `\n...e mais ${records.length - 8} registro(s).` : "";
  const archiveText = state.filters.archiveMonth ? `\nMês: ${formatArchiveMonth(state.filters.archiveMonth)}` : "";
  const totalText = valueHidden ? "Oculto" : moneyFormatter.format(total);
  return `${config.title}${archiveText}\nRegistros: ${records.length}\nTotal: ${totalText}\n\n${lines || "Nenhum registro encontrado."}${more}`;
}

function buildReportLines() {
  const config = getConfig();
  const records = getSortedRecords();
  const total = records.reduce((sum, record) => sum + Number(record[config.valueField] || 0), 0);
  const valueHidden = isColumnHidden(config.valueField);
  const lines = [
    config.title,
    `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
    `Registros: ${records.length}`,
    `Total: ${valueHidden ? "Oculto" : moneyFormatter.format(total)}`,
    state.filters.archiveMonth ? `Mês arquivado: ${formatArchiveMonth(state.filters.archiveMonth)}` : "Mês arquivado: Todos",
    state.activeTab === "levo" ? `Valor do KM: ${moneyFormatter.format(state.kmRate)}` : "",
    "",
  ].filter((line) => line !== "");
  const reportColumns = getReportColumns(config);
  const widths = getPdfWidths(config);
  const header = reportColumns.map((column) => fitCell(column.label, widths[column.key])).join(" | ");
  const separator = reportColumns.map((column) => "-".repeat(widths[column.key])).join("-+-");

  lines.push(separator, header, separator);

  records.forEach((record) => {
    lines.push(
      reportColumns
        .map((column) => fitCell(displayValue(record, column, true) || "-", widths[column.key]))
        .join(" | ")
    );
  });
  lines.push(separator);
  if (!records.length) lines.push("Nenhum registro encontrado para os filtros atuais.");
  return lines;
}

function getPdfWidths(config) {
  if (state.activeTab === "levo") {
    return {
      registration: 9,
      date: 10,
      cc: 5,
      collaborator: 24,
      description: 28,
      authorizer: 13,
      value: 12,
      kmStart: 9,
      kmEnd: 9,
      situation: 11,
      km: 5,
    };
  }

  return config.columns.reduce((widths, column) => {
    const defaults = { date: 10, collaborator: 24, description: 44, value: 12 };
    widths[column.key] = defaults[column.key] || 16;
    return widths;
  }, {});
}

function fitCell(value, width) {
  const text = toWinAnsi(String(value ?? "").replace(/\s+/g, " ").trim());
  if (text.length > width) return `${text.slice(0, Math.max(0, width - 1))}.`;
  return text.padEnd(width, " ");
}

function displayValue(record, column, moneyAsText) {
  const value = record[column.key];
  if (column.type === "date") return formatDate(value);
  if (column.type === "money") return moneyAsText ? moneyFormatter.format(Number(value || 0)) : Number(value || 0).toFixed(2).replace(".", ",");
  return value ?? "";
}

function createPdf(lines) {
  const objects = [];
  const pages = [];
  const pageLines = 51;
  for (let index = 0; index < lines.length; index += pageLines) pages.push(lines.slice(index, index + pageLines));
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>");
  const pageRefs = [];
  pages.forEach((linesForPage) => {
    const content = ["BT", "0.4 w", "2 Tr", "/F1 8 Tf", "10 TL", "24 560 Td", ...linesForPage.map((line) => `(${pdfEscape(line)}) Tj T*`), "ET"].join("\n");
    const contentId = objects.length + 1;
    objects.push(`<< /Length ${toWinAnsi(content).length} >>\nstream\n${content}\nendstream`);
    const pageId = objects.length + 1;
    pageRefs.push(pageId);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);
  });
  objects[1] = `<< /Type /Pages /Kids [${pageRefs.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(toWinAnsi(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = toWinAnsi(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => (pdf += `${String(offset).padStart(10, "0")} 00000 n \n`));
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Uint8Array.from(toWinAnsi(pdf), (char) => char.charCodeAt(0));
}

function wrapText(text, maxLength) {
  const words = String(text).split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function parseDecimal(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  let normalized = String(value ?? "")
    .trim()
    .replace(/\s/g, "");
  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");

  if (hasComma && hasDot) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = normalized.replace(",", ".");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = String(value).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function getArchiveMonth(dateValue) {
  return String(dateValue || "").slice(0, 7);
}

function formatArchiveMonth(monthValue) {
  if (!monthValue) return "Todos";
  const [year, month] = monthValue.split("-");
  return `${month}/${year}`;
}

function getArchiveSuffix() {
  return state.filters.archiveMonth || "todos_os_meses";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return entities[char];
  });
}

function toWinAnsi(value) {
  return String(value).replace(/\u00a0/g, " ").replace(/[^\x00-\xff]/g, (char) =>
    char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x00-\xff]/g, "?")
  );
}

function pdfEscape(value) {
  return toWinAnsi(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

loadState();
bindEvents();
render();
startNewRecord();
