/**
 * Returns the API of the active application
 * @returns {Object} - The API object, default is InDesign API.
 */
function getApi() {
    switch (app.name) {
        case 'Adobe Illustrator':
            return $._ext_ILST;
        case 'Adobe Photoshop':
            return $._ext_PHXS;
    }
    return $._ext_IDSN;
}

/**
 * Returns the specified dialog option from the vocabulary.
 * Wrapper for `$._ext_IDSN.getTextFromVocabulary()`.
 *
 * @param {string} textName - The name of the dialog option.
 *
 * @returns {string} - The text of the specified dialog option from the vocabulary. If the dialog option is not found in the vocabulary, it returns a default string ('!!! ' + textName
 *).
 */
function getTextFromVocabulary(textName) {
    var api = getApi();
    return api.dictionary.languages[api.language].sui[textName]  || '!!! ' + textName;
}
/**
 * @memberof ExtendScript
 * Class for displaying and controlling a window with a single progress bar.
 * @param {String} dialogText - the title of the window
 * @param {String} progress1Text - the message displayed in the window
 * @param {Number} stop - the number of steps
 * @returns {Window} - the progress window object
 * @constructor
 */
function SingleProgressBar (dialogText, progress1Text, stop){
    var palette = new Window("palette", dialogText);
    palette.message = palette.add("statictext", undefined, progress1Text);
    palette.bar = palette.add ("progressbar", undefined, 0, stop);
    palette.bar.preferredSize = [300,20];
    palette.center();
    /**
     * Creates a new Text object.
     * @param {string} text - The text content of the text object.
     */
    palette.newText = function(text){
        palette.message.text = text;
        palette.update();
    };
    /**
     * Moves to the next step in the palette.
     * @returns {void}
     */
    palette.nextStep = function(step){
        palette.bar.value += step;
        palette.update();
    };
    /**
     * Ends the usage of the palette.
     *
     * @function
     * @name palette.end
     * @returns {void}
     */
    palette.end = function(){
        palette.bar.value = stop;
        $.sleep(50);
        palette.hide(); palette.close();
    };
    palette.show();
    return palette;
}


/**
 * Class defining a multi progress bar window with generic progress bars.
 *
 * @constructor MultiProgressBar
 *
 * @param {string} dialogTitle - The title displayed on the window's title bar.
 * @param {string} mainOrder - The message shown above the main progress bar.
 * @param {number} mainBarLength - The length of the main progress bar.
 */
function MultiProgressBar(dialogTitle, mainOrder, mainBarLength) {
    this.window = new Window("palette {'alignChildren': 'center'}", dialogTitle);
    this.window.customPanelData = {
        preferredBarSize: [300,20],
        mainBarLength: mainBarLength,
        mainBarStatus: 0,
        'panel': {
            'groups': {},
            'editText': {},
            'buttons': {},
            'texts': {},
            'checkboxs': {},
            'dropdownlists': {},
            'panels': [],
            "treeviews": {},
            "bars": [],
            "barsData": []
        }
    };
    this.lastBar = {value:5};


    /**
     * Adds a panel to the current component.
     * @param length
     * @param text
     */
    this.addPanel = function (length, text) {
        this.window.customPanelData.panel.panels.unshift(
            this.window.add("group {alignChildren: 'center', spacing: 10}")
        )
        if(arguments.length >0) this.getLastPanel().add('statictext', undefined, text);
        this.window.customPanelData.panel.bars.unshift(
            this.getLastPanel().add("progressbar", undefined, 0, length)
        );
        this.getLastBar().minValue = 0;
        this.getLastBar().preferredSize = this.window.customPanelData.preferredBarSize;
        this.updateUi();
    }

    this.getLastPanel = function () {
        return this.window.customPanelData.panel.panels[0];
    }
    /**
     * Adds a bar to the current instance.
     *
     * @param {number} length - The length of the bar to be added.
     * @returns {void}
     */
    this.addBar = function (length) {
        this.window.customPanelData.panel.bars.unshift(
            this.window.add("progressbar", undefined, 0, length)
        );
        this.getLastBar().minValue = 0;
        this.getLastBar().preferredSize = this.window.customPanelData.preferredBarSize;
        this.updateUi();
    }

    this.getLastBar = function () {
        return this.window.customPanelData.panel.bars[0];
    }
    /**
     * Re-rendering of the window, required after changes in the UI.
     */
    this.updateUi = function () {
        this.window.layout.layout(true);
        this.window.update();
    }
    this.nextStep = function (value) {
        this.getLastBar().value = this.getLastBar().value + (value||1);
        this.updateUi();
    }
    this.closeLastBar = function () {
        if(this.window.customPanelData.panel.bars.length >1){
            this.getLastBar().value = this.getLastBar().maxvalue;
            this.window.remove(this.getLastBar());
            this.window.customPanelData.panel.bars.shift();
            $.sleep(50);
            this.updateUi();
        }
    }
    /**
     * Window Initialization
     */
    this.init = function () {
        this.window.customPanelData.panel.texts.mainOrder = this.window.add("statictext", undefined, mainOrder);
        this.addBar(this.window.customPanelData.mainBarLength);
        this.updateUi();
        this.window.show();
    }
    this.closeWindow = function () {
        for (var i = 1; i < this.window.customPanelData.panel.bars.length; i++) {
            this.closeLastBar();
        }
        this.window.close()
    }
}


/**
 * Displays a dialog with an "About" message.
 *
 * @param {Object} config - The configuration object.
 */
function showAbout(config) {
    var errors, window, panel, nameGroup;
    window = new Window("dialog {'alignChildren': 'center', spacing: 8}", getTextFromVocabulary('show_about__dialog_title'));

    window.add("statictext", undefined, getTextFromVocabulary('show_about__extension_name') + ' ' + config.appVersion );
    panel = window.add(
        "panel {alignChildren: 'center', orientation: 'column', spacing: 2}"
    );

    panel.add("statictext", undefined, getTextFromVocabulary('show_about__copyright'));
    panel.add("statictext", undefined, getTextFromVocabulary('show_about__license'));
    window.add("statictext", undefined, getTextFromVocabulary('show_about__www'));
    window.add("statictext", undefined, ' ');

    window.defaultElement = window.add("button {text: '" + getTextFromVocabulary('show_about__close_button') + "'}");
    window.show();
}


/**
 * Displays a preferences dialog window and allows changing language settings.
 *
 * ExtendScript SUI
 *
 * @param {Object} config - The configuration object.
 * @returns {Object} - The updated configuration object if the "OK" button is clicked, otherwise the original configuration object.
 */

function preferencesDialog(config) {
    var window = new Window("dialog {'alignChildren': 'center'}", getTextFromVocabulary('preferences_dialog__dialog_title'));
    window.customPanelData = {
        'config': config,
        'languages': [],
        'listWidth': 290,
        'panelsWidth': 450,
        'appApi': getApi(),
        'panelReferences': {
            'groups': {},
            'editText': {},
            'buttons': {},
            'texts': {},
            'checkboxs': {},
            'dropdownlists': {},
            'panels': {}
        }

    };

    window.customPanelData.initData = function () {

        for (var i = 0; i < window.customPanelData.appApi.dictionary.languages.length; i++) {
            window.customPanelData.languages.push(window.customPanelData.appApi.dictionary.languages[i].general.language_name);
        }
    }

    window.customPanelData.addLanguageSettings = function () {

        window.customPanelData.panelReferences.panels.language = window.add(
            "panel {alignChildren: 'left', orientation: 'column', spacing: 10, text: '"
            + getTextFromVocabulary('preferences_dialog__language_panel_title')
            + "', margins: [10, 20, 30, 10]}"
        );
        window.customPanelData.panelReferences.groups.uiLanguage = window.customPanelData.panelReferences.panels.language.add("group {alignChildren: 'left', spacing: 3, orientation: 'row'}", [0, 0, window.customPanelData.panelsWidth, 20]);

        window.customPanelData.panelReferences.texts.uiLanguage = window.customPanelData.panelReferences.groups.uiLanguage.add("statictext", undefined, getTextFromVocabulary('preferences_dialog__language_interface'));
        window.customPanelData.panelReferences.dropdownlists.uiLanguage = window.customPanelData.panelReferences.groups.uiLanguage.add('dropdownlist', undefined, window.customPanelData.languages);
        window.customPanelData.panelReferences.dropdownlists.uiLanguage.selection = window.customPanelData.config.language;

        window.customPanelData.panelReferences.dropdownlists.uiLanguage.onChange = function () {
            window.customPanelData.config.language = window.customPanelData.panelReferences.dropdownlists.uiLanguage.selection.index;
            window.customPanelData.appApi.language = window.customPanelData.panelReferences.dropdownlists.uiLanguage.selection.index;
        }
    }


    /**
     * Group / ok and cancel buttons
     */
    window.customPanelData.addMainButtons = function () {
        window.customPanelData.panelReferences.groups.buttons = window.add("group {alignChildren: 'center', spacing: 3, orientation: 'row'}");
        window.defaultElement = window.customPanelData.panelReferences.groups.buttons.add("button {" + "enabled: false, text: '" + getTextFromVocabulary('preferences_dialog__button_ok') + "'}");
        window.cancelElement = window.customPanelData.panelReferences.groups.buttons.add("button {" + "text: '" + getTextFromVocabulary('preferences_dialog__cancel') + "'}");
    }

    window.customPanelData.updateUi = function () {
        window.customPanelData.appApi.language = window.customPanelData.config.language;
        window.customPanelData.addLanguageSettings();
        window.customPanelData.addMainButtons();
        window.defaultElement.enabled = true;
        window.layout.layout(true);
    }
    window.customPanelData.initData();
    window.customPanelData.updateUi();
    var test = window.show();
    // ok
    if (test === 1) {
        return window.customPanelData.config;
    }
    // cancel
    return config;
}
