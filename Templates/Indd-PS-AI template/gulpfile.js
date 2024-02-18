const extensionJsonPath = './extension.json';
let extensionJSON = require(extensionJsonPath);

const gulp = require('gulp'),
    map = require('map-stream'),
    del = require('del'),
    path = require('path'),
    os = require('os'),
    download = require("gulp-download"),

    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    inquirer = require('inquirer'),
    runSequence = require('run-sequence'),
    fs = require('fs'),
    shell = require('child_process'),

    projectJSON = require('./package.json'),

    extensionBuilderJSON = require('./../../extensionbuilder.json'),
    publicInstallerPath = extensionBuilderJSON.paths.publicInstallerPath,

    userHomeDir = os.homedir(),

    // Skrypt generowania wersji instalacyjnej pod Windows
    innoScriptsPath = extensionJSON.panelFolder + extensionJSON.projectPaths.toolsFolder,
    innoScript = extensionJSON.installerData.innoScriptConfigFile,

    // Skrypt do generowania skryptów pod skróty klawiaturowe
    makeShortcutsScripts = extensionJSON.panelFolder + extensionJSON.projectPaths.toolsFolder + extensionJSON.tools.makeShortcutsScriptFileName,
    winInstallerFileFullPath = extensionJSON.panelFolder + extensionJSON.projectPaths.installerFolder + '/' + extensionJSON.panelName + ' ' + extensionJSON.extensionVersion.join('.') + '.exe',
    installerZipFileInstallerFullPath = extensionJSON.panelFolder + extensionJSON.projectPaths.installerFolder + '/' + extensionJSON.panelName + ' ' + extensionJSON.extensionVersion.join('.') + '.7z',

    // build folder
    buildFolder = extensionJSON.panelFolder + extensionJSON.projectPaths.destinationFolder + '/' + extensionJSON.extensionFolder;


if(extensionJSON.panelFolder !== process.cwd().replace(/\\/mg, '/' ) + '/') {
    extensionJSON.panelFolder = process.cwd().replace(/\\/mg, '/' ) + '/';
    fs.writeFileSync(extensionJsonPath, JSON.stringify(extensionJSON, null, 3).replace(/\\\\/gm,'/'), "utf-8");
}

const userPath  = (process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")).replace(/\\/gm, '/');
const extensionDataFolder = userPath  + "/" + extensionJSON.publisher + "/" + extensionJSON.extensionId + "/";

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}


/**
 * Cleans build folder.
 * @returns {Promise<string[]> | *}
 */
function cleanBuildFolder() {
    return del([
        extensionJSON.projectPaths.destinationFolder + '/**/*'
    ], {force: true})
}

/**
 * Increments the major version in the extension repository configuration file.
 * @param done
 * @return {*}
 */
function upMajorVersionInExtension(done) {
    const extensionFileContent = JSON.parse(fs.readFileSync(extensionJSON.panelFolder + 'extension.json', "utf-8"));
    extensionFileContent.extensionVersion[0] ++;
    extensionFileContent.extensionVersion[1] = 0;
    extensionFileContent.extensionVersion[2] = 0;
    fs.writeFileSync(extensionJSON.panelFolder + 'extension.json', JSON.stringify(extensionFileContent, null, 3));
    return done();
}

/**
 * Increments the minor version in the extension repository configuration file.
 * @param done
 * @return {*}
 */
function upMinorVersionInExtension(done) {
    const extensionFileContent = JSON.parse(fs.readFileSync(extensionJSON.panelFolder + 'extension.json', "utf-8"));
    extensionFileContent.extensionVersion[1] ++;
    extensionFileContent.extensionVersion[2] = 0;
    fs.writeFileSync(extensionJSON.panelFolder + 'extension.json', JSON.stringify(extensionFileContent, null, 3));
    return done();
}

/**
 * Increments the patch version in the extension repository configuration file.
 * @param done
 * @return {*}
 */
function upPatchVersionInExtension(done) {
    const extensionFileContent = JSON.parse(fs.readFileSync(extensionJSON.panelFolder + 'extension.json', "utf-8"));
    extensionFileContent.extensionVersion[2] ++;
    fs.writeFileSync(extensionJSON.panelFolder + 'extension.json', JSON.stringify(extensionFileContent, null, 3));
    return done();
}

/**
 * Updates the extension version in package.json.
 * @param done
 * @return {*}
 */
function upVersionInPackage(done) {
    const packageFileContent = JSON.parse(fs.readFileSync(extensionJSON.panelFolder + 'package.json', "utf-8"));
    const extensionFileContent = JSON.parse(fs.readFileSync(extensionJSON.panelFolder + 'extension.json', "utf-8"));
    packageFileContent.version = extensionFileContent.extensionVersion.join('.');
    projectJSON.version = extensionFileContent.extensionVersion.join('.');
    fs.writeFileSync(extensionJSON.panelFolder + 'package.json', JSON.stringify(packageFileContent, null, 3));
    return done();
}

/**
 * Updates the extension version in extensionJSON.json.
 * @returns {*}
 */
function updateVersionInExtensionConfig() {
    return gulp.src(extensionJSON.projectPaths.configPath + '/' + extensionJSON.configFileName)
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            fileContents = fileContents.replace(/appVersion: "\d+\.\d+\.\d+"/m, 'appVersion: "' + projectJSON.version + '"');
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest(extensionJSON.projectPaths.configPath));
}


/**
 * Updates the extension version in the manifest file.
 * @returns {*}
 */
function updateVersionInManifest() {
    return gulp.src(extensionJSON.panelFolder + '01 source/CSXS/' + extensionJSON.manifestFileName)
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            fileContents = fileContents
                .replace(/ExtensionBundleVersion=["]\d+\.\d+\.\d+["]/m, 'ExtensionBundleVersion="' + projectJSON.version + '"')
                .replace(/ Version=["]\d+\.\d+\.\d+["]/mg, ' Version="' + projectJSON.version + '"');
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest(extensionJSON.panelFolder + '01 source/CSXS/'));
}


/**
 * Updates the extension version in readme file.
 * @returns {*}
 */
function updateVersionInReadMe() {
    return gulp.src('./README.md')
        .pipe(map(function (file, cb) {
            let fileContents = file.contents.toString();
            fileContents = fileContents.replace(/>Version \d+\.\d+\.\d+/m, '>Version ' + projectJSON.version);
            fileContents = fileContents.replace(/## \[Historia zmian]\(#Spis-treści\)/m, '## [Historia zmian](#Spis-treści)\n' + projectJSON.version + '\n1. \n' );
            file.contents = Buffer.from(fileContents);
            cb(null, file);
        }))
        .pipe(gulp.dest('./'));
}

/**
 * Updates Google Icons files in repository.
 * @param done
 * @return {*}
 */
function updateGoogleIcons(done) {
    let urls = [
        'https://raw.githubusercontent.com/google/material-design-icons/master/font/MaterialIcons-Regular.codepoints',
        'https://raw.githubusercontent.com/google/material-design-icons/8b39a2557577adfde1d5d4098ce9e8d2cdd7fbf1/font/MaterialIconsOutlined-Regular.codepoints',
        'https://raw.githubusercontent.com/google/material-design-icons/8b39a2557577adfde1d5d4098ce9e8d2cdd7fbf1/font/MaterialIconsRound-Regular.codepoints',
        'https://raw.githubusercontent.com/google/material-design-icons/8b39a2557577adfde1d5d4098ce9e8d2cdd7fbf1/font/MaterialIconsTwoTone-Regular.codepoints',
        'https://github.com/google/material-design-icons/raw/8b39a2557577adfde1d5d4098ce9e8d2cdd7fbf1/font/MaterialIcons-Regular.ttf',
        'https://github.com/google/material-design-icons/raw/8b39a2557577adfde1d5d4098ce9e8d2cdd7fbf1/font/MaterialIconsOutlined-Regular.otf',
        'https://github.com/google/material-design-icons/raw/8b39a2557577adfde1d5d4098ce9e8d2cdd7fbf1/font/MaterialIconsRound-Regular.otf',
        'https://github.com/google/material-design-icons/raw/8b39a2557577adfde1d5d4098ce9e8d2cdd7fbf1/font/MaterialIconsTwoTone-Regular.otf',
        'https://raw.githubusercontent.com/google/material-design-icons/8b39a2557577adfde1d5d4098ce9e8d2cdd7fbf1/font/README.md'
    ];
    urls.map(url => {
        download(url).pipe(gulp.dest(extensionJSON.panelFolder + '/01 source/assets/iconfont'));
    })
    return done();
}


/**
 * Clears the test extension's target location in the local Adobe CC extensions folder.
 * @returns {Promise<string[]> | *}
 */
function cleanTestFolder() {
    return del([
            extensionBuilderJSON.paths.localExtensionsFolder + '/' + extensionJSON.extensionFolder + "/**/*",
            extensionBuilderJSON.paths.localExtensionsFolder + '/' + extensionJSON.extensionFolder
        ], {force: true}
    )

}

/**
 * Copies the source files to the build folder.
 * @returns {*}
 */
function copyToBuild() {
    return gulp.src(extensionJSON.panelFolder + extensionJSON.projectPaths.sourceFolder + "/**/*", {dot: true})
        .pipe(gulp.dest(buildFolder));
}

/**
 * Converts i18n dictionaries to the file with ExtendScript variable.
 * This is performance optimization.
 * @param done
 * @returns {*}
 */
function convertDictionaryInBuild(done) {
    let dictionaryFileString = 'var dictionary = ';
    let dictionary = {languages: []};
    const sourcePath = extensionJSON.panelFolder + extensionJSON.projectPaths.sourceFolder + "/" + extensionJSON.projectPaths.i18nDictionaries;
    let paths = getFolders(sourcePath);
    if (paths.length === 0) return done();
    dictionary.languages = paths.map((folder) => {
        return JSON.parse(fs.readFileSync(sourcePath + '/' + folder + '/translations.json', "utf-8"));
    })
    dictionaryFileString += JSON.stringify(dictionary, null, 3) + ';';
    fs.writeFileSync(buildFolder + '/' + extensionJSON.projectPaths.dictionaryPath, dictionaryFileString);
    fs.writeFileSync(buildFolder + '/' + extensionJSON.projectPaths.dictionaryPath.replace('.js', '.json'), JSON.stringify(dictionary, null, 3));
    del([buildFolder + '/' + extensionJSON.projectPaths.i18nDictionaries], {force: true});
    return done();
}


/**
 * Copies the test version of the extension to the Adobe extensions directory on the local computer.
 * @returns {*}
 */
function copyBuildToTest() {
    return gulp.src(extensionJSON.panelFolder + extensionJSON.projectPaths.destinationFolder + "/**/*", {dot: true})
        .pipe(gulp.dest(extensionBuilderJSON.paths.localExtensionsFolder));
}


/**
 * Generates scripts containing logic for invoking the application keyboard shortcuts.
 * @param done
 * @returns {*}
 */
function makeShortcuts(done) {
    shell.execSync(
        '"' + extensionBuilderJSON.tools.adobeExtendScriptToolkit.path
        + '" -cmd "'
        + extensionJSON.panelFolder
        + extensionJSON.projectPaths.toolsFolder
        + '/'
        + extensionJSON.tools.makeShortcutsScriptFileName
        + '"'
        , function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            done(err);
        }
    )
    return done()
}

/**
 * Updates the extension configuration file path for the keyboard shortcut generator.
 * @see makeShortcuts
 * @returns {*}
 */
function updatePathInMakeKeyboardShortcuts() {
    return gulp.src(
        extensionJSON.panelFolder +
        extensionJSON.projectPaths.toolsFolder +
        '/' +
        extensionJSON.tools.makeShortcutsScriptFileName
    ).pipe(
        map(function (file, cb) {
            let fileContents = file.contents.toString();
            fileContents = fileContents.replace(
                /var configPath = '[^']+';/m,
                'var configPath = \'' +
                extensionJSON.panelFolder + 'extension.json' +
                '\';'
            );
            file.contents = Buffer.from(fileContents);
            cb(null, file);

        })
    ).pipe(gulp.dest(
        extensionJSON.panelFolder +
        extensionJSON.projectPaths.toolsFolder +
        '/'
    ));
}


/**
 * Updates the extension configuration file path for the jsxbin converter.
 * @see jsxbin
 * @returns {*}
 */
function updatePathInJsxbin() {
    return gulp.src(
        extensionJSON.panelFolder +
        extensionJSON.projectPaths.toolsFolder +
        '/' +
        extensionJSON.tools.jsxBinFileName
    ).pipe(
        map(function (file, cb) {
            let fileContents = file.contents.toString();
            fileContents = fileContents.replace(
                /var configPath = '[^']+';/m,
                'var configPath = \'' +
                extensionJSON.panelFolder + 'extension.json' +
                '\';'
            );
            file.contents = Buffer.from(fileContents);
            cb(null, file);

        })
    ).pipe(gulp.dest(
        extensionJSON.panelFolder +
        extensionJSON.projectPaths.toolsFolder +
        '/'
    ));
}

/**
 * Converts jsx files to jsxbin format.
 * @param done
 * @returns {*}
 */
function jsxbin(done) {
    shell.execSync(
        '"' +
        extensionBuilderJSON.tools.adobeExtendScriptToolkit.path +
        '" -cmd "' +
        extensionJSON.panelFolder +
        extensionJSON.projectPaths.toolsFolder +
        '/' +
        extensionJSON.tools.jsxBinFileName +
        '"',
        function (err, stdout, stderr) {
            done(err);
        }
    )
    return done();
}

/**
 * Sets the debugging ports in .debug file.
 * @param done
 * @returns {*}
 */
function setDebuggingPorts(done) {
    let fileContents =
        '<?xml version="1.0" encoding="UTF-8"?> \n' +
        '<ExtensionList>\n' +
        '    <Extension Id="' + extensionJSON.extensionId + '">\n' +
        '        <HostList>\n';

    for (let i = 0; i < extensionJSON.targetApps.length; i++) {
        fileContents += '            <Host Name="'
            + extensionJSON.targetApps[i].appCodeName
            + '" Port="'
            + extensionJSON.targetApps[i].debuggingPort
            + '"/>\n'
    }
    fileContents +=
        '\t\t</HostList>\n' +
        '    </Extension>\n' +
        '</ExtensionList>'
    ;

    fs.writeFileSync(buildFolder + '/.debug', fileContents);
    return done();
}

/**
 * Opens dialogs editor in i18n standard.
 * Otwiera edytor komunikatów.
 * @param done
 * @return {*}
 */
function openI18Editor(done) {
    if (extensionBuilderJSON.paths.i18Editor !== '') shell.spawn(extensionBuilderJSON.tools.i18Editor.path, [
        extensionJSON.panelFolder + extensionJSON.projectPaths.sourceFolder + '/' + extensionJSON.projectPaths.i18nDictionaries
    ]);
    return done();
}


/**
 * Creates new ExtendScript test files with references to all libraries that form the extension context.
 * @param done
 * @returns {*}
 */
function makeExtendScriptTestFiles(done) {
    let fileContents = '';
    const libFiles = fs.readdirSync(extensionJSON.panelFolder + extensionJSON.projectPaths.appLibraries);
    let configJson = fs.readFileSync(extensionJSON.panelFolder + 'extension.json', 'utf8');
    let config = JSON.parse(configJson);
    for (let i = 0; i < config.targetApps.length; i++) {
        config.targetApps[i].testFilePath =
            extensionJSON.panelFolder
            + extensionJSON.projectPaths.testsFolder
            + '/_' + config.targetApps[i].appName + 'Test.jsx';
        fileContents = '#target ' + config.targetApps[i].targetEngine + '\n';


        for (let j = 0; j < libFiles.length; j++) {
            if (
                libFiles[j].split('_')[0] === config.targetApps[i].appCodeName
                || libFiles[j].split('_')[0] === 'ALL'
            ) {
                fileContents += '//@include  "'
                    + extensionJSON.panelFolder
                    + extensionJSON.projectPaths.sourceFolder
                    + '/assets/appCode/libraries/'
                    + libFiles[j] + '"\n';
            }
        }
        fileContents += '//@include  "'
            + extensionJSON.panelFolder
            + extensionJSON.projectPaths.configPath + '/'
            + extensionJSON.configFileName + '"\n';

        fileContents += '$._ext_IDSN  = { dictionary:  getDictionary("' + extensionJSON.panelFolder + extensionJSON.projectPaths.sourceFolder + '/' + extensionJSON.projectPaths.i18nDictionaries + '")};\n';
        fileContents += 'function getTextFromVocabulary (textName) {return $._ext_IDSN.dictionary.languages[defaul1tConfig.language].sui[textName] || \'!!! \' + textName;}\n';

        fs.writeFileSync(config.targetApps[i].testFilePath, fileContents);
    }
    fs.writeFileSync(extensionJSON.panelFolder + 'extension.json', JSON.stringify(config, null, 3));
    return done();
}

/**
 * Creates certificate.
 * @param done
 * @return {*}
 */
function createCertificate(done) {
    const selfSignStrings = [];
    // ścieżka do narzędzia
    selfSignStrings.push('"' + extensionBuilderJSON.tools.zxp.ZXPSignCmdPath + '"');
    // komenda
    selfSignStrings.push('-selfSignedCert');
    // kod kraju
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.countryCode);
    // region/województwo
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.stateOrProvince);
    // firma
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.organization);
    // nazwa skrócona
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.commonName);
    // hasło
    selfSignStrings.push(extensionBuilderJSON.publisherMetadata.certificatePassword);
    // ścieżka docelowa
    selfSignStrings.push(
        '"' + process.cwd() + '/' + extensionJSON.projectPaths.destinationFolder
        + '/' + extensionJSON.projectPaths.certificateName + '"'
    );

    shell.execSync(selfSignStrings.join(' '));
    return done();
}

/**
 * Creates a ZXP package with the extension.
 * @param done
 * @return {*}
 */
function makeZxp(done) {
    let zxpStrings = [];
    let fileName = 'MultiTool ' + extensionJSON.extensionVersion.join('.');
    zxpStrings.push('"' + extensionBuilderJSON.tools.zxp.ZXPSignCmdPath + '" -sign');

    // source files path
    zxpStrings.push(
        '"' +
        extensionJSON.panelFolder + extensionJSON.projectPaths.destinationFolder
        + '/' + extensionJSON.extensionFolder
        + '"'
    );
    // target location
    zxpStrings.push(
        '"' +
        extensionJSON.panelFolder + extensionJSON.projectPaths.installerFolder + '/' + fileName + '.zxp'
        + '"'
    );
    // path to certificate
    zxpStrings.push(
        '"' +
        process.cwd() + '/' + extensionJSON.projectPaths.destinationFolder
        + '/' + extensionJSON.projectPaths.certificateName
        + '"'
    );
    // password to certificate
    zxpStrings.push(
        extensionBuilderJSON.publisherMetadata.certificatePassword
    );
    // timestamp data source
    zxpStrings.push(
        '-tsa http://timestamp.digicert.com/'
    );

    shell.execSync(zxpStrings.join(' '));

    return done();
}

function openExtensionDataFolder(done) {
    shell.exec('start "" "' +
        extensionDataFolder
        + '"');
    return done();
}

function openExtensionLog(done) {
    shell.exec('start "" "' +
        extensionDataFolder + extensionJSON.extensionName + '.log'
        + '"');
    return done();
}

function openExtensionConfig(done) {
    shell.exec('start "" "' +
        extensionDataFolder + extensionJSON.extensionName + '.json'
        + '"');
    return done();
}

gulp.task(
    /**
     * @function QUICK_TEST_on_installed_aps
     * Quick test of the extension on the local installed Adobe CC package.
     */
    'QUICK_TEST_on_installed_aps', gulp.series(
    cleanBuildFolder, copyToBuild, convertDictionaryInBuild, setDebuggingPorts,
    updatePathInMakeKeyboardShortcuts, makeShortcuts,
    updatePathInJsxbin, jsxbin,
    cleanTestFolder, copyBuildToTest
));

gulp.task(
    /**
     * @function BUILD_test
     * Test build with temporary files.
     */
    'BUILD_test', gulp.series(
    cleanBuildFolder, copyToBuild, convertDictionaryInBuild, setDebuggingPorts,
    updatePathInMakeKeyboardShortcuts, makeShortcuts,
    updatePathInJsxbin, jsxbin,
    copyBuildToTest
));

gulp.task(
    /**
     * @function BUILD_zxp
     * Production build with ZPX build.
     */
    'BUILD_zxp', gulp.series(
    updateVersionInReadMe, updateVersionInManifest, updateVersionInExtensionConfig,
    cleanBuildFolder, copyToBuild, convertDictionaryInBuild,
    updatePathInMakeKeyboardShortcuts, makeShortcuts,
    updatePathInJsxbin, jsxbin,
    copyBuildToTest,
    createCertificate,
    makeZxp,
    cleanBuildFolder
));

gulp.task(
    /**
     * @function ICONS_update
     * Updates Google Icons files in repository.
     */
    'ICONS_update', gulp.series( updateGoogleIcons
));

gulp.task(
    /**
     * @function VERSION_UP_Major
     * Increments the major version in the extension repository configuration file.
     */
    'VERSION_UP_Major', gulp.series(
    upMajorVersionInExtension, upVersionInPackage, updateVersionInReadMe, updateVersionInManifest, updateVersionInExtensionConfig
));

gulp.task(
    /**
     * @function VERSION_UP_Minor
     * Increments the minor version in the extension repository configuration file.
     */
    'VERSION_UP_Minor', gulp.series(
    upMinorVersionInExtension, upVersionInPackage, updateVersionInReadMe, updateVersionInManifest, updateVersionInExtensionConfig
));

gulp.task(
    /**
     * @function VERSION_UP_Patch
     * Increments the patch version in the extension repository configuration file.
     */
    'VERSION_UP_Patch', gulp.series(
    upPatchVersionInExtension, upVersionInPackage, updateVersionInReadMe, updateVersionInManifest, updateVersionInExtensionConfig
));

gulp.task(
    /**
     * Debugging console for Indesign.
     * @function DEBUGGING_CONSOLE_Indesign
     */
    'DEBUGGING_CONSOLE_Indesign',
    (done) => {
        const path = extensionBuilderJSON.tools.adobeDebugConsole.path;
        const parameters =
            ['--url=localhost:' + (
                extensionJSON.targetApps.filter((el) => {
                        return el.appName === 'Indesign';
                    }
                )[0].debuggingPort
            )];
        shell.spawn(path, parameters);
        return done()
    }
);

gulp.task(
    /**
     * Debugging console for Photoshop.
     * @function DEBUGGING_CONSOLE_Photoshop
     */
    'DEBUGGING_CONSOLE_Photoshop',
    (done) => {
        const path = extensionBuilderJSON.tools.adobeDebugConsole.path;
        const parameters =
            ['--url=localhost:' + (
                extensionJSON.targetApps.filter((el) => {
                        return el.appName === 'PhotoShop';
                    }
                )[0].debuggingPort
            )];
        shell.spawn(path, parameters);

        return done()
    }
);
gulp.task(
    /**
     * Debugging console for Illustrator.
     * @function DEBUGGING_CONSOLE_Illustrator
     */
    'DEBUGGING_CONSOLE_Illustrator',
    (done) => {
        const path = extensionBuilderJSON.tools.adobeDebugConsole.path;
        const parameters =
            ['--url=localhost:' + (
                extensionJSON.targetApps.filter((el) => {
                        return el.appName === 'Illustrator';
                    }
                )[0].debuggingPort
            )];
        shell.spawn(path, parameters);
        return done()
    }
);

gulp.task(
    /**
     * Creates test `ExtendScript` files for each application.
     * @see makeExtendScriptTestFiles
     * @function ExtendScript_CONSOLE_initialize_test_files
     */
    'ExtendScript_CONSOLE_initialize_test_files', gulp.series(
        makeExtendScriptTestFiles
    ));

gulp.task(
    /**
     * Test script
     * @function ExtendScript_CONSOLE
     */
    'ExtendScript_CONSOLE',
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


gulp.task(
    /**
     * Dialog editor.
     * @function 'i18 edit'
     */
    'i18_edit', openI18Editor);

gulp.task(
    /**
     * ExtensionDataFolder.
     * @function 'SHOW_data_folder'
     */
    'SHOW_extension_data_folder', openExtensionDataFolder);

gulp.task(
    /**
     * ExtensionDataFolder.
     * @function 'SHOW_extension_config'
     */
    'SHOW_extension_config', openExtensionConfig);

gulp.task(
    /**
     * ExtensionDataFolder.
     * @function 'SHOW_extension_log'
     */
    'SHOW_extension_log', openExtensionLog);