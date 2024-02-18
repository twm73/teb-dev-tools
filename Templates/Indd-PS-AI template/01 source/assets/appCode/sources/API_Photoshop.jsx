/**
 * A JavaScript object that provides utility methods for extending Adobe Photoshop's functionality.
 *
 * @namespace $._ext_PHXS
 */
$._ext_PHXS={
    configPath : "",
    logPath: "",
    extensionPath: "",
    dictionary:{
        languages:[]
    },
    language: 0,
    /**
     * Sets the `configPath` and `logPath` variables.
     * @param {String} configPath - Absolute path to the configuration file
     * @param {String} extensionPath - Absolute path to the extension folder file
     */
    setConfigPath : function (configPath, extensionPath) {
        this.configPath = configPath;
        this.extensionPath = extensionPath;
        var configFolder = this.configPath.slice(0, this.configPath.length-"config.json".length);
        var tempConfig = this.getAppConfig();
        this.logPath = configFolder + tempConfig.logFileName;
        this.language = tempConfig.language;
        this.setDictionary();
        this.saveToLog(['setConfigPath', 'configPath', this.configPath], 'DEBUG');
        this.saveToLog(['setConfigPath', 'logPath', this.logPath], 'DEBUG');
    },
    /**
     * Returns the absolute path to the configuration file.
     * @returns {string} - The absolute path to the configuration file.
     */
    getConfigPath : function () {
        return this.configPath;
    },
    /**
     * Returns an object with extension configuration.
     *
     * @returns {object} Return object with extension configuration.
     */
    getAppConfig : function (){
        if (this.configPath === "") return {};
        var tempFile, tempText;
        tempFile = new File(this.configPath);
        if(tempFile.exists){
            tempFile.open();
            tempText = tempFile.read();
            tempFile.close();
            return JSON.parse(tempText);
        }else  return {};
    },

    setDictionary : function (){
        if (this.configPath === "") return {};
        var tempFile, tempText;
        tempFile = new File(this.extensionPath + 'assets/panelCode/dictionary.json');
        if(tempFile.exists){
            tempFile.encoding = "UTF8";
            tempFile.open();
            tempText = tempFile.read();
            tempFile.close();
            this.dictionary = JSON.parse(tempText);
        }
    },

    /**
     * Saves the extension configuration.
     * @param {object} configObject - The configuration object to be saved.
     */
    saveAppConfig : function (configObject){
        if (this.configPath === "") return;
        var fileObj, tempText;
        if(! (configObject instanceof String)) {
            tempText = JSON.stringify(configObject, '', 3);
        }
        else {
            tempText = configObject;
        }

        fileObj = new File(this.configPath);
        if(fileObj.exists) {
            fileObj.encoding = "UTF8";
            fileObj.open("w", undefined, undefined);
            fileObj.write(tempText);
            fileObj.close();
        }
    },
    /**
     * Opens the help file in HTML format in the system's default browser.
     * @param {object} config - The configuration object.
     * @returns {string} - A JSON string representation of the appConfig object.
     */
    showHelpFile: function (config) {
        var appConfig, epub;
        if(arguments.length >0){appConfig = config;} else appConfig = this.getAppConfig();
        runExternalExecutiveFile(this.extensionPath + config.helpFileRelativePaths[this.language]);
        return JSON.stringify(appConfig);
    },
    /**
     * Saves the provided report messages to a log file in the Log4J format.
     *
     * @param {String[]} report - An array of messages to be written to the log file.
     * @param {String} [type] - The log level. Valid values are 'INFO', 'DEBUG', 'WARN', 'ERROR', 'FATAL'. Default value is 'DEBUG'.
     */
    saveToLog : function (report, type) {
        if (this.logPath === "") return;
        var fileObj, typeToFile;
        typeToFile = type || 'DEBUG';
        fileObj = new File(this.logPath);
        fileObj.encoding = "UTF8";
        fileObj.open("a", undefined, undefined);
        fileObj.write(getFormattedDate('logFile') + '\t' + typeToFile + '\t' + report.join('\t') + '\n');
        fileObj.close();
    },
    /**
     * Returns the specified dialog option from the vocabulary.
     *
     * @param {string} textName - The name of the dialog option.
     * @returns {string} - The value of the dialog option. If the option does not exist, it returns '!!! {textName}'.
     */
    getTextFromVocabulary: function (textName) {
        return dictionary.languages[this.language].sui[textName] || '!!! ' + textName;
    },
    /**
     * Copies generic scripts for handling keyboard shortcuts.
     * @param {Object} config - The configuration object.
     * @returns {string} - The JSON representation of the app configuration.
     */
    copyScriptsFilesForShortcuts : function (config) {
        var appConfig, extensionFolder;
        if(arguments.length >0){appConfig = config;}else appConfig = this.getAppConfig();
        extensionFolder = new File(this.configPath).path;
        copyShortcatsScripts(extensionFolder + "/assets/" + appConfig.folderForScriptsFilesShortcuts, appConfig.folderForScriptsFilesShortcuts);
        return JSON.stringify(appConfig);
    },

    // Side menu methods

    preferences : function (config) {
        var appConfig;
        if(arguments.length >0){appConfig = config;}else appConfig = this.getAppConfig();
        return JSON.stringify(preferencesDialog(appConfig));
    },
    about : function (config) {
        var appConfig;
        if(arguments.length >0){appConfig = config;}else appConfig = this.getAppConfig();
        showAbout(appConfig);
        return JSON.stringify(appConfig);
    },

    // Functions assigned to buttons

    runList : function (config){
        var appConfig;
        if(arguments.length >0){appConfig = config;}else appConfig = this.getAppConfig();
        for (var i = 0; i < appConfig.selectedElements.length; i++) {
            if(appConfig.selectedElements[i].name ==='toolsPanelNo2List1') {
                addTextLayer(appConfig.selectedElements[i].text, [0, 0], 30);
            }
        }
        return JSON.stringify(config);
    },
    flattenImage : function (config){
        var appConfig;
        if(arguments.length >0){appConfig = config;}else appConfig = this.getAppConfig();
        flattenAllLayers();
        return JSON.stringify(config);
    },
    createTestDocument : function (config){
        var appConfig;
        if(arguments.length >0){appConfig = config;}else appConfig = this.getAppConfig();
        createTestDocument();
        return JSON.stringify(config);
    },
    clearAllGuides : function (config){
        var appConfig;
        if(arguments.length >0){appConfig = config;}else appConfig = this.getAppConfig();
        clearAllGuides();
        return JSON.stringify(config);
    },

    addTestTextInPhotoshop : function (config){
        var appConfig;
        if(arguments.length >0){appConfig = config;}else appConfig = this.getAppConfig();
        addTextLayer('Test text', [0, 0], 30);
        return JSON.stringify(config);
    }

};

