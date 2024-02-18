/**
 * Refreshes the extension's UI based on data from the configuration object.
 *
 * @function updateUI
 * @returns {void}
 */
function updateUI() {
    csInterface.setPanelFlyoutMenu(getFlyoutMenu());
    csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", flyoutMenuActions);
    configPathInSessionObjectIsSet || setConfigPathInSessionObject();
    keyboardShortcutsIsInitialised || copyScriptsFilesForShortcuts();
    $('#app').empty();
    addGuiElements(uiConfig.guiElements, 'app');
    if(! updateTested){
        getVersion();
    }
    showStatus();
}


/**
 * Function for adding GUI elements.
 * @param {Array} elements - an array of GUI elements to be added.
 * @param {String} parentId - ID of the parent element where the elements will be added.
 */
function addGuiElements(elements, parentId) {
    for (let i = 0; i < elements.length; i++) {
        /**
         * Sprawdzenie, czy element jest zgodny z uruchomioną aplikacją.
         */
        if (elements[i].apps.join(' ').indexOf(csInterface.hostEnvironment.appName) !== -1) {
            switch (elements[i].type) {
                case 'switchablePanels':
                    addSwitchablePanels(elements[i], parentId);
                    break;
                case 'container':
                    addContainer(elements[i], parentId);
                    break;
                case 'line':
                    addLine(elements[i], parentId);
                    break;
                case 'textLabel':
                    addTextLabel(elements[i], parentId);
                    break;
                case 'dropDownList':
                    addDropDownList(elements[i], parentId);
                    break;
                case 'dropDownListItem':
                    break;
                case 'textButton':
                    addTextButton(elements[i], parentId);
                    break;
                case 'iconButton':
                    addIconButton(elements[i], parentId);
                    break;
            }
        }
    }
}


/**
 * Adds a {@link SwitchablePanels} element to the specified parent.
 *
 * @param {SwitchablePanels} elementConfig - The configuration object of the element.
 * @param {String} parentId - The ID of the parent to which the element should be added.
 *
 * @returns {void}
 */
function addSwitchablePanels(elementConfig, parentId) {
    if (elementConfig.children.length < 2) return;
    let config = getConfig();
    $('#' + parentId).append('<div id="' + elementConfig.name + '">');
    addCssClass(elementConfig.name, elementConfig.cssClass);
    /**
     * Filters the selected elements based on the given element name.
     *
     * @param {Array} config.selectedElements - The array of selected elements.
     * @param {Object} elementConfig - The element configuration object.
     * @param {string} elementConfig.name - The name of the element to filter.
     * @returns {Array} - The filtered array of selected elements with the matching element name.
     */
    let settings = config.selectedElements.filter((element) => {
        return element.name === elementConfig.name
    });
    let selected = 0;
    if (settings.length === 0) {
        config.selectedElements.unshift({
            'name': elementConfig.name,
            'selected': 0,
            'text': getTextFromVocabulary(elementConfig.children[0].text)
        });
        saveConfig(config);
    } else {
        selected = settings[0].selected;
    }
    /**
     * Container for buttons and a separate one for the panel
     */
    $('#' + elementConfig.name).append('<div id="' + elementConfig.name + 'Buttons">').append('<div id="' + elementConfig.name + 'Content">');
    addCssClass(elementConfig.name + 'Content', ['switchablePanelsContentContainer']);
    /**
     * Przyciski kontrolujące wybor panelu.
     */
    for (let i = 0; i < elementConfig.children.length; i++) {
        let buttonId = elementConfig.name + 'Button' + i;
        $('#' + elementConfig.name + 'Buttons').append($('<button>'
            + getTextFromVocabulary(elementConfig.children[i].text)
            + '</button>').attr('id', buttonId));
        if (selected === i) addCssClass(buttonId, elementConfig.cssButtonOnClass);
        else addCssClass(buttonId, elementConfig.cssButtonOffClass);
        $('#' + buttonId).click(() => {
            let config = getConfig();
            config.selectedElements.filter((element) => {
                return element.name === elementConfig.name
            })[0].selected = i;
            config.selectedElements.filter((element) => {
                return element.name === elementConfig.name
            })[0].text = $('#' + buttonId).text();
            persistConfig(config);
        });
        if (i === 0) addCssClass(buttonId, ['switchablePanelsLeftButton']);
        else if (i === elementConfig.children.length - 1) addCssClass(buttonId, ['switchablePanelsRightButton']);
        else addCssClass(buttonId, ['switchablePanelsMiddleButton']);
    }
    /**
     *  Adding child elements of the active panel.
     */
    addGuiElements([elementConfig.children[selected]], elementConfig.name + 'Content');
}

/**
 * Adds a {@link Container} element to the specified parent.
 * @param {Container} elementConfig - Object with the element configuration
 * @param {String} parentId - ID of the parent to which the element should be added
 */
function addContainer(elementConfig, parentId) {
    $('#' + parentId).append($('<div>').attr('id', elementConfig.name));
    addCssClass(elementConfig.name, elementConfig.cssClass);
    addGuiElements(elementConfig.children, elementConfig.name);
}

/**
 * Adds an element of type {@link Line} to the specified parent.
 *
 * @param {Line} elementConfig - The object containing the element configuration.
 * @param {String} parentId - The ID of the parent to which the element should be added.
 *
 * @return {void}
 */
function addLine(elementConfig, parentId) {
    $('#' + parentId).append($('<div>').attr('id', elementConfig.name));
    addCssClass(elementConfig.name, elementConfig.cssClass);
}

/**
 * Adds a {@link TextLabel} element to the specified parent.
 *
 * @param {TextLabel} elementConfig - The configuration object of the element.
 * @param {String} parentId - The ID of the parent to which the element should be added.
 *
 * @return {undefined}
 */
function addTextLabel(elementConfig, parentId) {
    $('#' + parentId).append(
        $('<p>').html(getTextFromVocabulary(elementConfig.text))
            .attr('id', elementConfig.name)
    );
    addCssClass(elementConfig.name, elementConfig.cssClass);
}

/**
 * Adds a button of type {@link IconButton} with an icon from the [Material Design](https://fonts.google.com/icons) set that triggers a specified action in ExtendScript.
 *
 * @param {IconButton} elementConfig - The configuration object for the element.
 * @param {String} parentId - The ID of the parent element to which the button should be added.
 */
function addIconButton(elementConfig, parentId) {
    let text = getTextFromVocabulary(elementConfig.toolTipText);
    $('#' + parentId).append(
        $('<button>').attr('id', elementConfig.name)
            .attr('title', text)
            .text(elementConfig.iconCode)
    );
    addCssClass(elementConfig.name, elementConfig.cssClass);
    $('#' + elementConfig.name)
        .click({script: elementConfig.adobeScript}, buttonRunAction)
        .mouseover(() => {
            $('#tooltip').text(text);
            document.getElementById("tooltip").style.visibility = "visible";
        })
        .mouseleave(() => {
            $('#tooltip').empty();
            document.getElementById("tooltip").style.visibility = "hidden";

        })
    ;
}

/**
 * Adds a {@link TextButton} with a text name that triggers an assigned action in ExtendScript.
 *
 * @param {TextButton} elementConfig - The object with the element configuration.
 * @param {String} parentId - The ID of the parent element where the button should be added.
 *
 * @return {undefined}
 */
function addTextButton(elementConfig, parentId) {
    let text = getTextFromVocabulary(elementConfig.toolTipText);
    $('#' + parentId).append(
        $('<button>').attr('id', elementConfig.name)
            .attr('title', text)
            .text(getTextFromVocabulary(elementConfig.text))
    );
    addCssClass(elementConfig.name, elementConfig.cssClass);
    $('#' + elementConfig.name)
        .click({script: elementConfig.adobeScript}, buttonRunAction)
        .mouseover(() => {
            $('#tooltip').text(text);
            document.getElementById("tooltip").style.visibility = "visible";
        })
        .mouseleave(() => {
            $('#tooltip').empty();
            document.getElementById("tooltip").style.visibility = "hidden";

        })
    ;
}

/**
 * Adds a dropdown list element of type {@link DropDownList} with a text name that triggers an assigned action in ExtendScript.
 *
 * @param {DropDownList} elementConfig - The object with element configuration.
 * @param {String} parentId - The ID of the parent to which the element should be added.
 */
function addDropDownList(elementConfig, parentId) {
    let config = getConfig();
    let settings = config.selectedElements.filter((element) => {
        return element.name === elementConfig.name
    });
    let selected = 0;
    if (settings.length === 0) {
        config.selectedElements.unshift({
            'name': elementConfig.name,
            'selected': 0,
            'text': getTextFromVocabulary(elementConfig.items[0].text)
        });
        saveConfig(config);
    } else {
        selected = settings[0].selected;
    }
    let items = elementConfig.items.map((el, index) => {
        return $('<option>')
            .attr('value', index)
            .attr('Selected', (index === selected))
            .text(getTextFromVocabulary(el.text));
    });
    let dropdownList = $('<select>').attr('id', elementConfig.name)
        .on('change', () => {
            var config = getConfig();
            config.selectedElements.filter((element) => {
                return element.name === elementConfig.name
            })[0].selected
                = $('#' + elementConfig.name).find('option:selected').index();

            config.selectedElements.filter((element) => {
                return element.name === elementConfig.name
            })[0].text
                = $('#' + elementConfig.name).find('option:selected').text();

            persistConfig(config);
        });
    $('#' + parentId).append(dropdownList.append(items));
    addCssClass(elementConfig.name, elementConfig.cssClass);
}

/**
 * Adds the passed CSS class names to the specified element.
 * @param {String} elementId - The id of the element.
 * @param {String[]} classArray - An array of class names.
 */
function addCssClass(elementId, classArray) {
    classArray.map(function (element) {
        $('#' + elementId).addClass(element);
    });
}

/**
 * Retrieves the specified text from the vocabulary in the current language.
 *
 * @param {String} textName - The textual label identifying the text in the vocabulary.
 * @returns {string} - The text from the vocabulary.
 */
function getTextFromVocabulary(textName) {
    return dictionary.languages[getConfig().language].panel_ui[textName] || '!!! ' + textName;
}

/**
 * Checks for version compatibility. Returns `false` if a newer version of the extension is available online.
 * @param {defaultConfig} config - The configuration object containing current and update versions.
 * @return {boolean} - Returns `true` if the current version is compatible with the update version, otherwise `false`.
 */
function extensionVersionCompatibility(config) {
    if (config.appVersions.current.major < config.appVersions.update.major) {
        return false;
    } else if (
        config.appVersions.current.major === config.appVersions.update.major
        && config.appVersions.current.minor < config.appVersions.update.minor
    ) {
        return false;
    } else if (
        config.appVersions.current.major === config.appVersions.update.major
        && config.appVersions.current.minor === config.appVersions.update.minor
        && config.appVersions.current.patch < config.appVersions.update.patch
    ) {
        return false;
    }
    return true;
}

/**
 * Checks if the extension version stored in the configuration file is different from the version fetched from the server.
 * If so, modifies it in config.appVersions.update and saves the configuration.
 * @param {string} versionObjectJsonString - The JSON string representation of the version object.
 * @return {void}
 */
function saveVersion(versionObjectJsonString) {
    let versionObject;
    console.log('saveVersion');
    try {
        versionObject = JSON.parse(versionObjectJsonString);
    } catch (e) {
        versionObject = {
            isValid: false
        };
        console.log('saveVersion Error!');
    }
    if (versionObject.isValid) {
        console.log(versionObjectJsonString);
        const config = getConfig();

        config.appVersions.update.major = versionObject.currentVersion.major;
        config.appVersions.update.minor = versionObject.currentVersion.minor;
        config.appVersions.update.patch = versionObject.currentVersion.patch;

        if (!extensionVersionCompatibility(config)) {
            console.log('save');
            saveConfig(config);
        }
    }
}

/**
 * Retrieves text content from the given URL through HTTP.
 * @param {string} url - The URL in the format "http://www..."
 * @param {function} callback - The callback function to handle the retrieved text content
 */
function loadFileFromUrl(url, callback) {
    const xhr = new XMLHttpRequest();
    console.log('loadFileFromUrl ' + url)
    xhr.callback = callback;
    xhr.onload = function () {
        console.log('loadFileFromUrl ok: ' + this.responseText);
        updateTested = true;
        this.callback(this.responseText);
    };
    xhr.onerror = function () {
        saveToLog(['loadFileFromUrl', url, this.statusText], 'FATAL');
        console.error('loadFileFromUrl Err: ' +  this.statusText);
    };

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    xhr.send(null);
}

/**
 * Returns the current version of the application from the server.
 * @returns {undefined}
 * @see loadFileFromUrl
 * @see saveVersion
 */
function getVersion() {
    const config = getConfig();
    if(config.serverAddress !== '') {
        loadFileFromUrl(config.serverAddress + "/download/version/" + config.appId + "/latest", saveVersion);
    }else {
        updateTested = true;
    }
}

/**
 * Displays the content of the status field.
 *
 * @returns {void}
 */
function showStatus() {
    const config = getConfig();
    $('#statusBar').empty();
    // version
    $('#statusBar').append('<div id="versionStatus">');
    if (extensionVersionCompatibility(config)) {
        $('#versionStatus').addClass('statusOk');
        $('#versionStatus').append('<p id="versionStatement">' + getTextFromVocabulary('status_bar__extension_version') +
            config.appVersions.current.major + '.' + config.appVersions.current.minor + '.' + config.appVersions.current.patch
            + '</p>');
    } else {
        $('#versionStatus').addClass('statusAlert');
        $('#versionStatus').append('<p id="versionStatement">' + getTextFromVocabulary('status_bar__update_available') +
            config.appVersions.update.major + '.' + config.appVersions.update.minor + '.' + config.appVersions.update.patch
            + '</p>');
    }
}