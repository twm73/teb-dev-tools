function onLoaded() {
    saveToLog(['onLoaded', 2], 'DEBUG');

    if (window.__adobe_cep__) {
        updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
        // Update the color of the panel when the theme color of the product changed.
        csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
        loadJSX();
    }
    saveToLog(['onLoaded', 2], 'DEBUG');
    updateUI();
}
function changeCSS(cssFile) {
    document.getElementById("cssMode").setAttribute('href', cssFile);
}
/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 * Based on Adobe-CEP/CEP-Resources
 * https://github.com/Adobe-CEP/CEP-Resources
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {
    //Update the background color of the panel
    var panelBackgroundColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBackgroundColor);

    var styleId = "ppstyle";

    var appName = csInterface.hostEnvironment.appName;

    if(appName === "PHXS" || appName === "PPRO" || appName === "PRLD" || appName === "ILST") {
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // NOTE: Below theme related code are only suitable for Photoshop.                            //
        // If you want to achieve same effect on other products please make your own changes here.    //
        ////////////////////////////////////////////////////////////////////////////////////////////////

        addRule(styleId, "button, select, input[type=button], input[type=submit]", "border-radius:3px;");
        var gradientBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 40) + " , " + toHex(panelBackgroundColor, 10) + ");";
        var gradientDisabledBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, 15) + " , " + toHex(panelBackgroundColor, 5) + ");";
        var boxShadow = "-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);";
        var boxActiveShadow = "-webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);";

        var isPanelThemeLight = panelBackgroundColor.red > 127;
        var fontColor, disabledFontColor;
        var borderColor;
        var inputBackgroundColor;
        var gradientHighlightBg;
        if(isPanelThemeLight) {
            addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + fontColor + "; background-color:" + toHex(panelBackgroundColor) + ";");
            fontColor = "#000000;";
            disabledFontColor = "color:" + toHex(panelBackgroundColor, -70) + ";";
            borderColor = "border-color: " + toHex(panelBackgroundColor, -90) + ";";
            inputBackgroundColor = toHex(panelBackgroundColor, 54) + ";";
            gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -40) + " , " + toHex(panelBackgroundColor,-50) + ");";
        } else {
            fontColor = "#ffffff;";
            disabledFontColor = "color:" + toHex(panelBackgroundColor, 100) + ";";
            borderColor = "border-color: " + toHex(panelBackgroundColor, -45) + ";";
            inputBackgroundColor = toHex(panelBackgroundColor, -20) + ";";
            gradientHighlightBg = "background-image: -webkit-linear-gradient(top, " + toHex(panelBackgroundColor, -20) + " , " + toHex(panelBackgroundColor, -30) + ");";
        }

        //Update the default text style with pp values

        addRule(styleId, "label", "font-size:" + appSkinInfo.baseFontSize + "px" + "; vertical-align: 30%; color:" + fontColor + "; background-color:" + toHex(panelBackgroundColor) + ";");
        addRule(styleId, "button, select, input[type=text], input[type=button], input[type=submit]", borderColor);
        addRule(styleId, "button, select, input[type=button], input[type=submit]", gradientBg);
        addRule(styleId, "button, select, input[type=button], input[type=submit]", boxShadow);
        addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", gradientHighlightBg);
        addRule(styleId, "button:enabled:active, input[type=button]:enabled:active, input[type=submit]:enabled:active", boxActiveShadow);
        addRule(styleId, "[disabled]", gradientDisabledBg);
        addRule(styleId, "[disabled]", disabledFontColor);
        addRule(styleId, "input[type=text]", "padding:1px 3px;");
        addRule(styleId, "input[type=text]", "background-color: " + inputBackgroundColor + ";");
        addRule(styleId, "input[type=text]:focus", "background-color: #ffffff;");
        addRule(styleId, "input[type=text]:focus", "color: #000000;");

    } else {
        // For AI, ID and FL use old implementation
        addRule(styleId, ".default", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + reverseColor(panelBackgroundColor) + "; background-color:" + toHex(panelBackgroundColor, 20));
        addRule(styleId, "button", "border-color: " + toHex(panelBackgroundColor, -50));
    }
    switch (panelBackgroundColor.red) {
        case 50:
            changeCSS(csInterface.getSystemPath(SystemPath.EXTENSION) + "/assets/css/styles-dark.css");
            break;
        case 83:
            changeCSS(csInterface.getSystemPath(SystemPath.EXTENSION) + "/assets/css/styles-medium-dark.css");
            break;
        case 184:
            changeCSS(csInterface.getSystemPath(SystemPath.EXTENSION) + "/assets/css/styles-medium-light.css");
            break;
        case 240:
            changeCSS(csInterface.getSystemPath(SystemPath.EXTENSION) + "/assets/css/styles-light.css");
            break;

    }
}

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);

    if (stylesheet) {
        stylesheet = stylesheet.sheet;
        if( stylesheet.addRule ){
            stylesheet.addRule(selector, rule);
        } else if( stylesheet.insertRule ){
            stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
        }
    }
}


function reverseColor(color, delta) {
    return toHex({red:Math.abs(255-color.red), green:Math.abs(255-color.green), blue:Math.abs(255-color.blue)}, delta);
}

/**
 * Convert the Color object to string in hexadecimal format;
 */
function toHex(color, delta) {
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = computedValue.toString(16);
        return computedValue.length === 1 ? "0" + computedValue : computedValue;
    }
    return "#" + computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
}

function onAppThemeColorChanged(event) {
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    updateThemeWithAppSkinInfo(skinInfo);
}

function loadJSX() {
    var extensionRoot, appCodePath, languagesPath, appCode, fileContents;
    extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION);
    languagesPath = extensionRoot + '/assets/panelCode/dictionary.js';
    switch (getAppName()) {
        case 'IDSN':
            appCodePath = extensionRoot + '/assets/appCode/sources/API_InDesign.jsx';
            appCode = window.cep.fs.readFile(appCodePath);
            fileContents =
                appCode.data + "\r"
                + ' $.evalFile(new File("'+ extensionRoot +'/assets/appCode/libraries/IDSN_library.jsxbin"));'
                + ' $.evalFile(new File("'+ languagesPath +'"));';
            window.cep.fs.writeFile(extensionRoot + '/assets/appCode/API_InDesign_withPath.jsx', fileContents);
            csInterface.evalScript('$._ext.evalFile("' + extensionRoot + '/assets/appCode/API_InDesign_withPath.jsx")');
            break;
        case 'PHXS':
            appCodePath = extensionRoot + '/assets/appCode/sources/API_Photoshop.jsx';
            appCode = window.cep.fs.readFile(appCodePath);
            fileContents =
                appCode.data + "\r"
                + ' $.evalFile(new File("'+ extensionRoot +'/assets/appCode/libraries/PHXS_library.jsxbin"));'
                + ' $.evalFile(new File("'+ languagesPath +'"));';
            window.cep.fs.writeFile(extensionRoot + '/assets/appCode/API_Photoshop_withPath.jsx', fileContents);
            csInterface.evalScript('$._ext.evalFile("' + extensionRoot + '/assets/appCode/API_Photoshop_withPath.jsx")');
            break;
        case 'ILST':
            appCodePath = extensionRoot + '/assets/appCode/sources/API_Illustrator.jsx';
            appCode = window.cep.fs.readFile(appCodePath);
            fileContents =
                appCode.data + "\r"
                + ' $.evalFile(new File("'+ extensionRoot +'/assets/appCode/libraries/ILST_library.jsxbin"));'
                + ' $.evalFile(new File("'+ languagesPath +'"));';
            window.cep.fs.writeFile(extensionRoot + '/assets/appCode/API_Illustrator_withPath.jsx', fileContents);
            csInterface.evalScript('$._ext.evalFile("' + extensionRoot + '/assets/appCode/API_Illustrator_withPath.jsx")');
            break;

    }
}

function evalScript(script, callback) {
    csInterface.evalScript(script, callback);
}