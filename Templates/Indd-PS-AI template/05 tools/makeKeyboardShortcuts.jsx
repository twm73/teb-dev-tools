// noinspections ALL START
#target estoolkit#dbg
// noinspection END
//@include  "json2.jsx"

var configPath = 'C:\Data\OpenSource\extension-builder\Templates\Indd-PS-AI template/extension.json';

/**
 *  Utility file.
 *  It creates script files with calls to functions from API_InDesign.
 *  During the initialization of extension, files are copied to the Scripts panel in Indesign via the copyShortcatsScripts function.
 *  This allows you to assign them with keyboard shortcuts.
 *
 *  @see copyShortcatsScripts
 */

var tempText, binJs, fileOut, functionDefinitions, targetPath, outputPath, oldFiles, targetEngine, extensionConfigFile, extensionConfig;
extensionConfigFile = new File(configPath);

if(extensionConfigFile.exists) {

    extensionConfigFile.open("r", undefined, undefined);
    extensionConfig = JSON.parse(extensionConfigFile.read());
    extensionConfigFile.close();

    targetEngine = extensionConfig.extensionId;
    targetPath = extensionConfig.extensionName;
    outputPath = extensionConfig.panelFolder + extensionConfig.projectPaths.destinationFolder + '/' +  extensionConfig.extensionFolder + '/assets/';

    oldFiles = [];

    functionDefinitions = [
        {
            fileName: 'Clear all guides',
            call: '$._ext_IDSN.clearAllGuides();'
        }
    ];

    targetFolder = new Folder(outputPath + targetPath);
    if (targetFolder.exists) {
        oldFiles = oldFiles.concat(targetFolder.getFiles());
        for (var f = oldFiles.length - 1; f > -1; f--) {
            oldFiles[f].remove();
        }
    } else targetFolder.create();


    for (var d = 0; d < functionDefinitions.length; d++) {
        binJs = app.compile(functionDefinitions[d].call);
        tempText = "#targetengine '" + targetEngine + "'\n eval('" + String(binJs) + "')";
        fileOut = File((outputPath + targetPath + '/' + functionDefinitions[d].fileName + '.jsx').replace(' ', '%20'));
        fileOut.open("w");
        fileOut.write(tempText);
        fileOut.close();
    }
}