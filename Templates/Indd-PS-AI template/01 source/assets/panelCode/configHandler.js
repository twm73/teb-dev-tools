/**
 * Retrieves the code of the application in which the extension is running.
 * The following application codes are returned:
 * - InCopy (AICY)
 * - InDesign (IDSN)
 * - Illustrator (ILST)
 * - Photoshop (PHXS)
 *
 * @return {string} The code of the application in which the extension is running.
 */
function getAppName() {
    return csInterface.hostEnvironment.appName;
}

/**
 * Saves the configuration object to a file.
 * @param {defaultConfig} config - The configuration object to be saved.
 */
function saveConfig(config) {
    console.log('saveConfig ' + extensionConfigPath)
    const res = window.cep.fs.writeFile(extensionConfigPath, JSON.stringify(config, null, 3), cep.encoding.UTF8);
    if (res.err !== 0) {
        saveToLog(['saveConfig', res.err], 'FATAL');
    }
}

/**
 * odczytuje obiekt konfiguracyjny i zwraca go w postaci JSONa.
 * @function sendConfig
 * @returns {string}
 */
function sendConfig() {return JSON.stringify(getConfig())}

/**
 * zapisuje obiekt konfiguracyjny w local storage.
 * odświerza layout panelu
 * @function persistConfig
 * @param {defaultConfig} config
 */
function persistConfig(config){
    saveConfig(config);
    updateUI();
}

/**
 * Zwiększa rozmiar fontu mnożąc przez zadany współczynik.
 * @function fontPLUS
 * @param {number} id
 * ID obiektu HTMLowego w DOM
 * @param {number} factor
 * współczynnik liczbowy, 1 = 100%
 */
function fontPLUS(id, factor) {
    const size_TEMP = $(id).css('fontSize').replace("px", "");
    $(id).css('fontSize', size_TEMP * factor);
}

function resetConfig() {
    saveConfig(defaultConfig);
    updateUI();
}

/**
 * Odczytuje z pliku obiekt konfiguracyjny, jeżeli wystąpi błąd tworzy nowy na domyslnych parametrach.
 * @function getConfig
 * @returns {defaultConfig} config
 * obiekt konfiguracyjny
 */
function getConfig() {
    /**
     * Domyślny obiekt konfiguracyjny.
     * @type config
     */
    const res = window.cep.fs.readFile(extensionConfigPath);
    if (res.err !== 0) {
        if (res.err === 3) {
            window.cep.fs.makedir(extensionConfigPublisherFolder);
            window.cep.fs.makedir(extensionConfigFolder);
        }
        saveToLog(['getConfig', extensionConfigPath, res.err], 'FATAL');
        saveConfig(defaultConfig);
        return defaultConfig;
    }
    try {
        config = JSON.parse(res.data);
    }catch (e) {
        saveToLog(['getConfig', 'JSON.parse', languages.language[0].configParseError], 'FATAL');
        saveConfig(defaultConfig);
        return defaultConfig;
    }
    if (
        Number(config.appVersion.split(".")[0]) < Number(defaultConfig.appVersion.split(".")[0]) ||
        Number(config.appVersion.split(".")[1]) < Number(defaultConfig.appVersion.split(".")[1])
    ) {
        saveConfig(defaultConfig);
        return defaultConfig;
    }
    return config;
}

/**
 * Zwraca config aktywnego modułu.
 * @return {module}
 */
function getActiveModuleConfig() {
    const config = getConfig();
    return getConfig().modules[config.selectedModule];
}