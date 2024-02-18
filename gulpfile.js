const configPath = process.cwd() + '/extensionbuilder.json';
const extensionJSON = require("./Templates/Indd-PS-AI template/extension.json");


let gulp = require('gulp'),
    map = require('map-stream'),
    { v4: uuidv4 } = require('uuid'),
    shell = require('child_process'),
    fs = require('fs'),
    regedit = require('regedit'),
    os = require("os"),
    readlineSync = require('readline-sync'),
    extensionBuilderPackageJSON = require('./package.json'),

    extensionBuilderJSON = getExtensionConfig(),


    newExt = {
        'publisher': '', 'domain': '', 'destDir': '', 'projectName': '', 'bundleId': '', 'extensionId': '', 'sourceDir': '', 'baseDebuggingPort': ''
    },
   debugMode = '1';




/**
 * The function reads and returns an Extension Builder configuration object.
 * If the file is not on, it calls the create function.
 * @see createExtensionBuilderConfig
 * @return {object} - Extension Builder config.
 */
function getExtensionConfig() {
    if(!fs.existsSync(configPath)){
        createExtensionBuilderConfig({});
    }
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

/**
 * Checks the name of the extension. Checks whether it matches existing ones and does not contain unacceptable characters.
 * @see EXTENSION_create_test
 * @param name {string}
 * @returns {boolean}
 */
function extensionsNameIsOk(name) {
    let tempName = String(name);
    if (
        /[<>:"/\\|?*]/.test(tempName)
        || /(aux|con|nul|prn|com\d|lpt\d|null|error)/.test(tempName)
        || tempName === ''
    ) {
        console.log('Error: Input contains invalid characters!');
        return false;
    }
    for (let i = 0; i < extensionBuilderJSON.extensions.length; i++) {
        if (extensionBuilderJSON.extensions[i] === tempName) {
            console.log('Error: That extension name already exists!');
            return false;
        }
    }
    return true;
}

/**
 * "Create new" UI.
 *
 * Asks the user for the name of the new extension.
 * @returns {string} - extension name
 */
function getProjectName() {
    console.log('Enter a new extension name:');
    let name = String(readlineSync.prompt());
    if (extensionsNameIsOk(name)) {
        console.log(name);
        return name;
    }
    console.log('It is no valid name.');
    return getProjectName();
}

/**
 * Retrieves the base debugging port for a new extension
 *
 * @returns {number} The base debugging port within the range of 62000 to 65000 (inclusive)
 */
function getBaseDebuggingPort() {
    const min = 62000;
    const max = 65000;
    let message = 'Input Debugging Port number for new extension (' + min + '-' + max + '):';
    let debuggingPort = (readlineSync.questionInt(message));
    if (debuggingPort < max && debuggingPort > min ) {
        console.log(debuggingPort);
        return debuggingPort;
    }
    console.log('It is no valid number.');
    return getBaseDebuggingPort();
}



/**
 * Checks the paths in the configuration file.
 *
 * @param {function} done - The callback function to be called when the test is done.
 * @returns {done} - The callback function.
 */
function testExtensionBuilderConfig(done) {
    if(! fs.existsSync(configPath)) return done;
    console.log('\n*** Extension Builder Config Test ***\n');

    let extensionBuilderConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if(extensionBuilderConfig.paths.root !== process.cwd()){
        extensionBuilderConfig.paths.root = process.cwd();
        fs.writeFileSync(configPath, JSON.stringify(extensionBuilderConfig, null, 3).replace(/\\\\/gm,'/'), "utf-8");
    }
    if(!testFilePath(extensionBuilderConfig.paths.localExtensionsFolder)) console.log('!!! Set the correct path to the local extensions folder.' );
    if(!testFilePath(extensionBuilderConfig.paths.publicInstallerPath)) console.log('!!! Set the correct path to the public folder for extension installers.' );
    if(!testFilePath(extensionBuilderConfig.tools.adobeDebugConsole.path)) console.log('!!! Set the correct path to Adobe Debug Console (cefclient.exe).' );
    if(!testFilePath(extensionBuilderConfig.tools.zxp.ZXPSignCmdPath)) console.log('!!! Set the correct path to Adobe Sign Tool (ZXPSignCmd.exe from CEP Resources).' );
    if(!testFilePath(extensionBuilderConfig.tools.installerGenerator.path)) console.log('!!! Set the path correct to the installers generator - Inno Setup (ISCC.exe).' );
    if(!testFilePath(extensionBuilderConfig.tools.i18Editor.path)) console.log('!!! Set the path correct to the i18 Editor' );
    if(!testFilePath(extensionBuilderConfig.tools.adobeExtendScriptToolkit.path)) console.log('!!! Set the path correct to Adobe ExtendScript Toolkit CC.' );
    if(!testFilePath(extensionBuilderConfig.tools.convertToJsxbinScript.path)) console.log('!!! Set the path correct to the convertToJsxbinScript (jsxbin.jsx).' );

    console.log('\n');
    return done();
}

/**
 * Checks the path.
 * @param path {string}
 * @return {boolean}
 */
function testFilePath(path) {
    if(! fs.existsSync(path)){
        console.log('!!! Path is incorrect: ' + path);
        return false;
    }
    console.log('*** Path is ok: ' + path);
    return true;
}


/**
 * Checks if an environment configuration file exists, if not, creates one.
 * @param done
 * @returns {done}
 */
function createExtensionBuilderConfig(done) {
    if(! fs.existsSync(configPath)){
        let extensionBuilderConfig = {
            "publisherMetadata": {
                "organization": "company name",
                "commonName": "short company name",
                "countryCode": "EN",
                "stateOrProvince": "province",
                "certificatePassword": ""
            },
            "extensionBuilderVersion": extensionBuilderPackageJSON.version.split('.'),
            "paths": {
                "root": process.cwd(),
                "extensions": "Extensions/",
                "tools": "Tools/",

                "installers": "Installers",
                "templates": "Templates/",
                "ide": "VSCode/",

                "localExtensionsFolder": os.homedir() + "/AppData/Roaming/Adobe/CEP/extensions",
                "publicInstallerPath": ""
            },
            "extensions": [],
            "adobeCcVersions": [],
            "templates": [
                {
                    "name":  "Indesign/PhotoShop/Illustrator extension template",
                    "path": "Indd-PS-AI template/"
                }
            ],
            "tools": {
                "adobeDebugConsole": {
                    "path": "cefclient.exe"
                },
                "installerGenerator": {
                    "path": "C:/Program Files (x86)/Inno Setup 6/ISCC.exe"
                },
                "zxp": {
                    "ZXPSignCmdPath": "ZXPSignCmd.exe",
                    "unifiedPluginInstallerPathOnWindows": "C:/Program Files/Common Files/Adobe/Adobe Desktop Common/RemoteComponents/UPI/UnifiedPluginInstallerAgent/UnifiedPluginInstallerAgent.exe",
                    "unifiedPluginInstallerPathOnMacOs": "/Library/Application\\ Support/Adobe/Adobe\\ Desktop\\ Common/RemoteComponents/UPI/UnifiedPluginInstallerAgent/UnifiedPluginInstallerAgent.app/Contents/MacOS/UnifiedPluginInstallerAgent"
                },
                "i18Editor": {
                    "path": "C:/Program Files/JvMs Software/i18n-editor/i18n-editor.exe"
                },
                "adobeExtendScriptToolkit": {
                    "path": "C:/Program Files (x86)/Adobe/Adobe ExtendScript Toolkit CC/ExtendScript Toolkit.exe"
                },
                "convertToJsxbinScript": {
                    "path": process.cwd() + "/Tools/jsxbin.jsx"
                }

            }
        };
        fs.writeFileSync(configPath, JSON.stringify(extensionBuilderConfig, null, 3).replace(/\\\\/gm,'/'), "utf-8");
        console.log('The extensionbuilder.json has been created.')
    }
    return done();
}


/**
 * Retrieves the name of the product publisher.
 *
 * This function prompts the user to enter the name of the product publisher,
 * reads the input from the user, and validates the input before returning it.
 * If the input is a non-empty string containing non-word characters, it is considered valid.
 * Otherwise, an error message is displayed and the user is prompted again.
 *
 * @returns {string} The name of the product publisher.
 */
function getPublisherName() {
    console.log('Enter the name of the product publisher:');
    let publisherName = String(readlineSync.prompt());
    if (publisherName !== '' && /\W/.test(publisherName)) {
        console.log(publisherName);
        return publisherName;
    }
    console.log('It is no valid name.');
    return getPublisherName();
}

/**
 * Retrieves a valid domain name from the user.
 *
 * Prompts the user for a domain name for the new extension and validates it.
 *
 * @returns {String} The valid domain name entered by the user.
 */
function getDomain() {
    console.log('Enter the product domain:');
    let domain = String(readlineSync.prompt());
    if (domain !== '' && /[.]/.test(domain)) {
        console.log(domain);
        return domain;
    }
    console.log('It is no valid domain.');
    return getDomain();
}

/**
 * "Create new" UI.
 *
 * Displays a list of templates to choose from. Returns the index of the selected one or terminates the process.
 * @returns {Number} - template index.
 */
function chooseTemplate() {
    console.log('Choose the template from:');
    for (let i = 0; i < extensionBuilderJSON.templates.length; i++) {
        console.log((i + 1) + '. ' + extensionBuilderJSON.templates[i].name + '.');
    }
    console.log('0. Exit.');
    console.log('Input template number.');
    let templateNumber = String(readlineSync.prompt());
    if (templateNumber === '0') {
        console.log('Exiting.');
        process.exit(1);
    }
    if (Number(templateNumber) > extensionBuilderJSON.templates.length) {
        console.log('It is no valid choice.');
        return chooseTemplate();
    }
    return Number(templateNumber) - 1;
}

/**
 * "Create new" UI.
 *
 * Displays a set of questions to the user about the data needed to create a new extension.
 * @param done - anonymous callback for next function
 * @returns {done}
 */
function getData(done) {
    newExt.projectName = getProjectName();
    newExt.publisher = getPublisherName();
    newExt.domain = getDomain();
    const templateIndex = chooseTemplate();
    newExt.destDirName = newExt.projectName.toLowerCase();
    newExt.destDir = extensionBuilderJSON.paths.root + '/' + extensionBuilderJSON.paths.extensions + newExt.destDirName + '/';
    newExt.sourceDir = extensionBuilderJSON.paths.root + '/' + extensionBuilderJSON.paths.templates + extensionBuilderJSON.templates[templateIndex].path + "**/*";
    newExt.bundleId = uuidv4();
    newExt.extensionId = uuidv4();
    newExt.baseDebuggingPort = getBaseDebuggingPort();
    return done();
}

/**
 * Fast template test.
 * Returns test data allowing you to skip a set of data questions for the new extension.
 * @param done - anonymous callback for next function
 * @returns {done}
 */
function testData(done) {
    newExt.projectName = 'superExtension2';
    newExt.publisher = 'super-publisher';
    newExt.domain = 'super-publisher.com';
    const templateIndex = 0;
    newExt.destDirName = newExt.projectName.toLowerCase();
    newExt.destDir = extensionBuilderJSON.paths.root + '/' + extensionBuilderJSON.paths.extensions + newExt.destDirName + '/';
    newExt.sourceDir = extensionBuilderJSON.paths.root + '/' + extensionBuilderJSON.paths.templates + extensionBuilderJSON.templates[templateIndex].path + "**/*";
    newExt.baseDebuggingPort = Math.floor(Math.random() * 2000 + 62000);
    newExt.bundleId = uuidv4();
    newExt.extensionId = uuidv4();
    return done();
}

/**
 * "Create new" UI.
 *
 * Displays data for the new extension.
 * @param done - anonymous callback for next function
 * @returns {done}
 */
function showData(done) {
    console.log('**********');
    console.log('Template directory: ' + newExt.sourceDir);
    console.log('Destination directory: ' + newExt.destDir);
    console.log('Project name: ' + newExt.projectName);
    console.log('Publisher: ' + newExt.publisher);
    console.log('Domain: ' + newExt.domain);
    console.log('Extension Id: ' + newExt.extensionId);
    console.log('Bundle Id: ' + newExt.bundleId);
    console.log('**********');
    return done();
}

/**
 * Copies the files of the specified template to the new extension directory.
 * @returns {*}
 */
function filesCopying() {
    if (!fs.existsSync(newExt.destDir)) fs.mkdirSync(newExt.destDir);
    return gulp.src(newExt.sourceDir, {dot: true}).pipe(gulp.dest(newExt.destDir));
}

/**
 * Updates `manifest.xml` of the new extension.
 * @returns {*}
 */
function updateManifest() {
    return gulp.src(newExt.destDir + '01 source/CSXS/manifest.xml')
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            // panel name
            fileContents = fileContents.replace(/<Menu>template<\/Menu>/m, '<Menu>' + newExt.projectName + '</Menu>');
            // id and extension version
            fileContents = fileContents.replace(/<Extension Id="template" Version="\d+\.\d+\.\d+"/m, '<Extension Id="' + newExt.extensionId + '" Version="0.1.0"');
            fileContents = fileContents.replace(/<Extension Id="template"/m, '<Extension Id="' + newExt.extensionId + '"');
            fileContents = fileContents.replace(/ExtensionBundleId="com.template"/m, 'ExtensionBundleId="' + newExt.bundleId + '"');
            fileContents = fileContents.replace(/ExtensionBundleVersion="\d+\.\d+\.\d+"/m, ' ExtensionBundleVersion="0.1.0"');
            fileContents = fileContents.replace(/ExtensionBundleName="template"/m, 'ExtensionBundleName="' + newExt.projectName + '"');
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest(newExt.destDir + '01 source/CSXS/'));
}

/**
 * Updates `index.html` of the new extension.
 * @returns {*}
 */
function updateIndex() {
    return gulp.src(newExt.destDir + '01 source/index.html')
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            // Extension's panel title.
            fileContents = fileContents.replace(/<title>Template<\/title>/m, '<title>' + newExt.projectName + '</title>');
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest(newExt.destDir + '01 source/'));
}

/**
 * Updates `README.md` of the new extension.
 * @returns {*}
 */
function updateReadMe() {
    return gulp.src(newExt.destDir + 'README.md')
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            fileContents = fileContents.replace(/New Extension name/m, newExt.projectName);
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest(newExt.destDir));
}

/**
 * Updates `defaultConfig.js` of the new extension.
 * @returns {*}
 */
function updateDefaultConfig() {
    return gulp.src(newExt.destDir + '01 source/assets/panelCode/defaultConfig.js')
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            fileContents = fileContents.replace("'defaultConfigString'", JSON.stringify({
                "language": 0,
                "appName": newExt.projectName,
                "publisher": newExt.publisher,
                "domain": newExt.domain,
                "appLabelKey": newExt.extensionId,
                "appId": newExt.extensionId,
                "appVersion": "0.1.0",
                "appVersions": {
                    "current": {
                        "major": 0,
                        "minor": 1,
                        "patch": 0
                    },
                    "update": {
                        "major": 0,
                        "minor": 1,
                        "patch": 0
                    }
                },
                "folderForScriptsFilesShortcuts": newExt.projectName,
                "logFileName": newExt.projectName.toLowerCase() + '.log',
                "serverAddress": "",
                "helpFileRelativePaths": [
                    "/assets/help/help-en.html",
                    "/assets/help/help-pl.html"
                ],
                "selectedElements": [
                ],
                "rasterImageConfig": {
                    "format": "PNG",
                    "resolution": 200,
                    "transparency": true,
                    "qualityEnumeratorValue": 1701726313,
                    "colourSpaceEnumeratorValue": 1666336578,
                    "exportFormatEnumeratorValue": 1699761735,
                    "fileExtension": "png"
                }
            }, undefined, 3))

            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest(newExt.destDir + '01 source/assets/panelCode/'));
}


/**
 * Updates `help-pl.html` of the new extension.
 * @returns {*}
 */
function updateHelpFile() {
    return gulp.src([newExt.destDir + '01 source/assets/help/help-pl.html', newExt.destDir + '01 source/assets/help/help-en.html'])
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            // name
            fileContents = fileContents.replace(/##extensionName##/gm, newExt.projectName);
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest(newExt.destDir + '01 source/assets/help/'));
}

/**
 * Updates dictionaries i18n
 * @param done - anonymous callback for next function
 * @returns {done}
 */
function updateI18(done) {
    let languageFolders = ['en_GB', 'pl_PL'];
    languageFolders.map((folderName)=>{
        let vocabularyPath = newExt.destDir + '01 source/assets/i18n/' + folderName + '/translations.json';
        let fileContent = fs.readFileSync(vocabularyPath, 'utf8');
        let vocabulary = JSON.parse(fileContent);
        vocabulary.sui.show_about__extension_name = newExt.projectName;
        vocabulary.general.extension_name = newExt.projectName;
        vocabulary.sui.show_about__www = newExt.domain;
        fs.writeFileSync(vocabularyPath, JSON.stringify(vocabulary, null, 3));
    })
    return done();
}

/**
 * Updates package.json of the newly created extension.
 * @returns {*}
 */
function updatePackageJson() {
    return gulp.src(newExt.destDir + 'package.json')
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            // Nazwa projektu
            fileContents = fileContents.replace(/"name": "template",/m, '"name": "' + newExt.projectName + '",');
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest(newExt.destDir));
}

/**
 * Updates the configuration file of the newly created extension.
 * @param done - anonymous callback for next function
 * @returns {done}
 */
function updateExtensionJson(done) {
    let configJson = fs.readFileSync(newExt.destDir + 'extension.json', 'utf8');
    let config = JSON.parse(configJson);
    config.extensionName = newExt.projectName;
    config.extensionVersion = [0, 1, 0];
    config.installerData.installerAppId = '';
    config.panelFolder = newExt.destDir;
    config.panelName = newExt.projectName;
    config.publisher = newExt.publisher;
    config.extensionId = newExt.extensionId;
    config.targetEngine = newExt.destDirName + ".extension_Engine_Id";
    config.domain = newExt.domain;
    config.extensionFolder = newExt.projectName.toLowerCase();
    config.targetApps.forEach((element) => {
        element.debuggingPort = newExt.baseDebuggingPort++;
    })
    fs.writeFileSync(newExt.destDir + 'extension.json', JSON.stringify(config, null, 3));
    return done();
}

/**
 * Set variable for `setDebugMode`.
 * @see setDebugMode
 * @param done - anonymous callback for next function
 * @returns {done}
 */
function enableDebugMode(done){
    debugMode = '1';
    return done();
}

/**
 * Set variable for `setDebugMode`.
 * @see setDebugMode
 * @param done - anonymous callback for next function
 * @returns {done}
 */
function disableDebugMode(done){
    debugMode = '0';
    return done();
}

/**
 * Reads the versions of all installed Adobe applications from the system registry and writes them to environment.csxsList[].
 * @param done - anonymous callback for next function
 * @returns {done}
 */
function setDebugMode(done) {
    const adobeRootKey = 'HKCU\\Software\\Adobe';
    regedit.list(adobeRootKey, function (err, result) {
        for (let i = 0; i < result[adobeRootKey].keys.length; i++) {
            if (result[adobeRootKey].keys[i].split('.')[0] === 'CSXS') {
                let keyName = adobeRootKey + "\\" + result[adobeRootKey].keys[i];
                let debug = {};
                debug[keyName] = {'PlayerDebugMode': {value: debugMode,type: 'REG_SZ'}};
                regedit.putValue(debug, function (err) {});
            }
        }
    })
    return done();
}

/**
 * Npm initialisation in new extension.
 * @param done - anonymous callback for next function
 * @return {ChildProcessWithoutNullStreams|*}
 */
function initNewExtension(done) {
    console.log(newExt.destDir);
    shell.execSync('npm install', { cwd: newExt.destDir });
    return done();
}

/**
 * Opens new project in the specified IDE.
 * @param done
 * @return {ChildProcessWithoutNullStreams|*}
 */
function openInIde(done) {
    if(extensionBuilderJSON.paths.ide.indexOf('JetBrains') > 0) return shell.spawn(extensionBuilderJSON.paths.ide, [newExt.destDir]);
    if(extensionBuilderJSON.paths.ide.indexOf('vscode') > 0) shell.execSync(extensionBuilderJSON.paths.ide + ' -n --new-window "' + newExt.destDir) + '"';
    return done();
}

/**
 * Generating a certificate.
 * @param done - anonymous callback for next function
 * @return {done}
 */
function createSignature(done) {
    // set of commands
    const selfSignStrings = [];
    // path to the singing tool
    selfSignStrings.push(extensionBuilderJSON.tools.zxp.ZXPSignCmdPath);
    // main command
    selfSignStrings.push('-selfSignedCert');
    // country code
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.countryCode);
    // state
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.stateOrProvince);
    // company
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.organization);
    // common name
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.commonName);
    // password
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.certificatePassword);
    // target path to ZXPSignCMD
    selfSignStrings.push(process.cwd() + '/' + extensionBuilderJSON.paths.tools + '/habForExtension.p12');

    shell.execSync(selfSignStrings.join(' '));
    return done();
}


function upMajorVersionInExtensionBuilder(done) {
    const extensionFileContent = getExtensionConfig();
    extensionFileContent.extensionBuilderVersion[0]++;
    extensionFileContent.extensionBuilderVersion[1] = 0;
    extensionFileContent.extensionBuilderVersion[2] = 0;
    fs.writeFileSync(configPath, JSON.stringify(extensionFileContent, null, 3));
    extensionBuilderJSON = getExtensionConfig();
    return done();
}

function upMinorVersionInExtensionBuilder(done) {
    const extensionFileContent = getExtensionConfig();
    extensionFileContent.extensionBuilderVersion[1]++;
    extensionFileContent.extensionBuilderVersion[2] = 0;
    fs.writeFileSync(configPath, JSON.stringify(extensionFileContent, null, 3));
    extensionBuilderJSON = getExtensionConfig();    return done();
}

function upPatchVersionInExtensionBuilder(done) {
    const extensionFileContent = getExtensionConfig();
    extensionFileContent.extensionBuilderVersion[2]++;
    fs.writeFileSync(configPath, JSON.stringify(extensionFileContent, null, 3));
    extensionBuilderJSON = getExtensionConfig();    return done();
}

function updateVersionInReadMe() {
    return gulp.src('./README.md')
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            fileContents = fileContents.replace(/>Wersja \d+\.\d+\.\d+/m, '>Wersja ' + extensionBuilderJSON.extensionBuilderVersion.join('.'));
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest('./'));
}

function upVersionInPackage(done) {
    const packageFileContent = JSON.parse(fs.readFileSync( process.cwd() + '/package.json', "utf-8"));
    packageFileContent.version = extensionBuilderJSON.extensionBuilderVersion.join('.');
    fs.writeFileSync(process.cwd() + '/package.json', JSON.stringify(packageFileContent, null, 3));
    return done();
}



/**
 * @function EXTENSION_BUILDER_init
 */
gulp.task('EXTENSION_BUILDER_init',
    gulp.series(createExtensionBuilderConfig, testExtensionBuilderConfig)
);

/**
 * @function EXTENSION_BUILDER_create_signature
 */
gulp.task('EXTENSION_BUILDER_create_signature',
    gulp.series(createSignature)
);

/**
 * @function VERSION_UP_Major
 */
gulp.task('VERSION_UP_Major', gulp.series(
    upMajorVersionInExtensionBuilder, updateVersionInReadMe, upVersionInPackage
));

/**
 * @function VERSION_UP_Minor
 */
gulp.task('VERSION_UP_Minor', gulp.series(
    upMinorVersionInExtensionBuilder, updateVersionInReadMe, upVersionInPackage
));

/**
 * @function VERSION_UP_Patch
 */
gulp.task('VERSION_UP_Patch', gulp.series(
    upPatchVersionInExtensionBuilder, updateVersionInReadMe, upVersionInPackage
));

/**
 * @function EXTENSION_create_new
 */
gulp.task('EXTENSION_create_new',
    gulp.series(
        getData,
        showData,
        filesCopying,
        updateReadMe,
        updateManifest,
        updateI18,
        updateHelpFile,
        updateIndex,
        updateDefaultConfig,
        updatePackageJson,
        updateExtensionJson,
        initNewExtension,
        openInIde
    )
);
/**
 * @function EXTENSION_create_test
 * Quick extension test from template with default data.
 */
gulp.task('EXTENSION_create_test',
    gulp.series(
        testData,
        showData,
        filesCopying,
        updateReadMe,
        updateManifest,
        updateI18,
        updateHelpFile,
        updateIndex,
        updateDefaultConfig,
        updatePackageJson,
        updateExtensionJson,
        initNewExtension,
        openInIde
    )
);
/**
 * @function DEBUG_MODE_enable
 */
gulp.task('DEBUG_MODE_enable',
    gulp.series(enableDebugMode, setDebugMode)
);
/**
 * @function DEBUG_MODE_disable
 */
gulp.task('DEBUG_MODE_disable',
    gulp.series(disableDebugMode, setDebugMode)
);

/**
 * @function ExtendScript CONSOLE
 */
gulp.task('ExtendScript CONSOLE',
    (done) => {
        const path = '"'
            + extensionBuilderJSON.tools.adobeExtendScriptToolkit.path
            + '" "'
            + extensionJSON.targetApps[0].testFilePath
            + '"';
        shell.exec(path);

        return done()
    }
);
