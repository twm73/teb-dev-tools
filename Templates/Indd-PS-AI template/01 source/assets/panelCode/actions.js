/**
 * Saves the given report to a log file in Log4J format.
 *
 * @param {String[]} report - Array of messages to be logged
 * @param {String} [type] - Log level, options are 'INFO', 'DEBUG', 'WARN', 'ERROR', 'FATAL', default is 'DEBUG'
 * @return {void}
 */
function saveToLog(report, type) {
    let extScript = '$._ext_' + getAppName() +  '.saveToLog([' + report.join('\t') + ', ' + (type || 'DEBUG') +  '])';
    evalScript(extScript, function (res) {  if (res !== 'EvalScript error.'){
        persistConfig(
            JSON.parse(res)
        );}
    });
}
/**
 * Executes the function assigned to the button in the ExtendScript API.
 * @async
 * @function buttonRunAction
 * @param {object} parameters - The name of the ExtendScript function.
 * @return {void}
 */
function buttonRunAction(parameters) {
    let extScript = '$._ext_' + getAppName() + '.' + parameters.data.script + '(' + sendConfig() + ')';
    evalScript(extScript, function (res) {
        if (res !== 'EvalScript error.'){
            persistConfig(JSON.parse(res));
        }
        else {
            saveToLog(['buttonRunAction', extScript, parameters.data.script , res], 'FATAL');
        }
    });
}

/**
 * A generic function that allows invoking methods of the $._ext_ object.
 *
 * @param {string} script - The name of the method to invoke on the $._ext_ object.
 */
function runAction(script) {
    let extScript = '$._ext_' + getAppName() + '.' + script + '(' + sendConfig() + ')';
    evalScript(extScript, function (res) {
        if (res !== 'EvalScript error.'){
            persistConfig(JSON.parse(res));
        }
        else {
            saveToLog(['runAction', script, res], 'FATAL');
        }
    });
}

/**
 * Executes actions for the flyout menu of the extension.
 *
 * @param {object} parameters - An object containing the {string} res.data.menuId label with the name of the function.
 * @return {void}
 */
function flyoutMenuActions(parameters) {
    switch (parameters.data.menuId) {
        case "resetConfig":
            resetConfig();
            break;
        default:
            console.log('runAction');
            runAction(parameters.data.menuId);

    }
}
/**
 * Sets the absolute path to the extension's configuration file in the session object using the specified API.
 *
 * @return {void}
 */
function setConfigPathInSessionObject(){
    let extScript = '$._ext_' + getAppName() +  '.setConfigPath(' +
        '"' + extensionConfigPath + '"' +
        ', "' + extensionFolder + '/"'
        + ')';
    evalScript(extScript, function (res) {
        if (res === 'EvalScript error.'){
            saveToLog(['setConfigPath', extScript], 'FATAL');
        }else {
            configPathInSessionObjectIsSet = true;
        }
    });
}

/**
 * Copies the script files necessary for keyboard shortcuts to the destination location.
 *
 * @return {void}
 */
function copyScriptsFilesForShortcuts(){
    let extScript;
    extScript = '$._ext_' + getAppName() +  '.copyScriptsFilesForShortcuts()';
    evalScript(extScript, function (res) {
        if (res === 'EvalScript error.'){
            saveToLog(['copyScriptsFilesForShortcuts', res], 'FATAL');
        }
    });
    keyboardShortcutsIsInitialised = true;
}
