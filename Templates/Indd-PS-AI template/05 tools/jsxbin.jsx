#target estoolkit#dbg
//@include  "json2.jsx"
var configPath = '../extension.json';


/**
 * Script for batch conversion of ExtendScript files in JSX format to JSXBIN.
 */

var sourceFolderPath, sourceFolder, jsFiles, tempText,
    binJs, fileOut, extensionConfigFile, extensionConfig, appName, tempFile, fileContent;


extensionConfigFile = new File(configPath);

if(extensionConfigFile.exists) {
    extensionConfigFile.open("r", undefined, undefined);
    extensionConfig = JSON.parse(extensionConfigFile.read());
    extensionConfigFile.close();

    sourceFolderPath =
        extensionConfig.panelFolder +
        extensionConfig.projectPaths.destinationFolder + '/' +
        extensionConfig.extensionFolder +
        '/assets/appCode/libraries';

    sourceFolder = new Folder(sourceFolderPath);
    jsFiles = sourceFolder.getFiles('*.jsx');
    var codeStrings = [];
    for (var i = 0; i < jsFiles.length; i++) {
        tempFile = new File(jsFiles[i]);
        tempFile.open("r");
        codeStrings.push(
            {
                appName: jsFiles[i].name.split('_')[0],
                codeString: tempFile.read()
            }
        );
        tempFile.close();
        tempFile.remove();

    }

    for (var a = 0; a < extensionConfig.targetApps.length; a++) {
        fileContent = '';
        for (var c = 0; c < codeStrings.length; c++) {
            if (
                codeStrings[c].appName === extensionConfig.targetApps[a].appCodeName
                || codeStrings[c].appName === 'ALL'
            ) fileContent += codeStrings[c].codeString;
        }
        binJs = app.compile(fileContent);
        fileOut = File(sourceFolderPath + '/' + extensionConfig.targetApps[a].appCodeName + '_library.jsxbin');
        fileOut.open("w");
        fileOut.write(binJs);
        fileOut.close();
    }
}