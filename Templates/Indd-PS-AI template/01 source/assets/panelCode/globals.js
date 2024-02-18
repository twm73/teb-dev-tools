const csInterface = new CSInterface();
const extensionFolder = csInterface.getSystemPath(SystemPath.EXTENSION);
const extensionConfigPublisherFolder = csInterface.getSystemPath(SystemPath.USER_DATA)
    + "/" + defaultConfig.publisher;
const extensionConfigFolder = extensionConfigPublisherFolder + "/" + defaultConfig.appLabelKey;
const extensionConfigPath = extensionConfigFolder + "/config.json";
const extensionLogPath = extensionConfigFolder + "/" + defaultConfig.logFileName;
let updateTested = false;
let keyboardShortcutsIsInitialised = false;
let configPathInSessionObjectIsSet = false;