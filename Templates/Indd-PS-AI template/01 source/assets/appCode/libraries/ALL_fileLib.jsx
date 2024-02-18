/**
 * Creates a Folder object based on the path. If it didn't exist before, creates a new one.
 * @param path - path where new folder should be
 * @returns {Folder} folder - returns a Folder object or null
 */
function checkFolder(path) {
    var newFolder;
    if (arguments.length ===0)return null;
    if (arguments.length ===1) newFolder = new Folder(path);
    if (! newFolder.exists ){newFolder.create();}
    if (! newFolder.exists ){return null;}else {return newFolder;}
}
/**
 * Writes text to a file
 * @param {String} filePath - target path
 * @param {String} textToSave - text to be saved
 */
function saveTextToFile(filePath, textToSave){
    var fileObj = new File(filePath);
    fileObj.encoding = "UTF8";
    fileObj.open("w", undefined, undefined);
    fileObj.writeln(textToSave);
    fileObj.close();
}

/**
 * Copies script files from extension folder to scripts panel in Indesign
 * @param sourcePath - source path
 * @param scriptsFolderName - path to scripts panel
 */
function copyShortcatsScripts(sourcePath, scriptsFolderName){
    var destinationPath, sourceFiles;
    destinationPath = app.scriptPreferences.scriptsFolder + "/" + scriptsFolderName + "/";
    if(checkFolder(destinationPath)!== null){
        sourceFiles = new Folder(sourcePath).getFiles();
        for (var i = 0; i < sourceFiles.length; i++) {
            sourceFiles[i].copy(
                destinationPath + sourceFiles[i].name
            );
        }
    }
}

/**
 * Deletes all subfolders and files in the specified folder.
 * @param folder {Folder} - reference to the folder object
 */
function clearFolder(folder) {
    var allFiles;
    if(folder.exists){
        allFiles = folder.getFiles();
        for (var i = allFiles.length-1; i >= 0; i--) {
            if(allFiles[i].constructor.name === "Folder") clearFolder(allFiles[i]);
            allFiles[i].remove();
        }
    }
}

/**
 * The function getAllFolders(myFolder) receives a Folder object as a parameter and returns an array containing the provided folder and all its subfolders.
 *
 * @param myFolder {Folder}
 * @returns {[{Folder}]}
 */
function getAllFolders(myFolder){
    var startFolder, filesList;
    var foldersList = [];
    if (myFolder instanceof Folder){startFolder = myFolder;}
    else {
        startFolder = new Folder(myFolder);
        if (! startFolder.exists){return foldersList;}
    }
    foldersList.push(startFolder);
    filesList = startFolder.getFiles();
    for (var x = 0; x < filesList.length; x++) {
        if (filesList[x] instanceof Folder){
            var foldersTEMP = getAllFolders(filesList[x]);
            for (var y = 0; y < foldersTEMP.length; y++) {
                foldersList.push(foldersTEMP[y]);
            }
        }
    }
    return foldersList;
}
 /**
 * Returns an array of files according to a given mask, e.g., "*.jpg, *.png", from the given directory and all its subdirectories
 * @param {String|Folder} myFolder source directory
 * @param {String} myMask file mask e.g., "*.jpg, *.png"
 * @returns {Array} fileList
 *
 */
function getAllFiles(myFolder, myMask){
    var fileList = [], myFolders = [];
    myFolders = getAllFolders(myFolder);

    for (var x = 0; x < myFolders.length; x++) {
        var filesList_TEMP = myFolders[x].getFiles(myMask);
        for (var y = 0; y < filesList_TEMP.length; y++) {
            fileList.push(filesList_TEMP[y]);
        }
    }
    return fileList;
}
/**
 * This function readTextFromFile(path) reads and returns the content of a file at a given absolute path. If the file cannot be read successfully, it returns an empty string.
 * @param path {String} - the absolute path to the file
 * @returns {String} - the content of the file or an empty String, if nothing was read successfully
 */
function readTextFromFile(path) {
    var targetFile, fileContent;
    targetFile = new File(path);
    if(targetFile.exists){
        targetFile.encoding = "UTF8";
        targetFile.open("r", undefined, undefined);
        fileContent = targetFile.read();
        targetFile.close();
        return fileContent;
    }
    return '';
}

/**
 * Executes an external executable file in the operating system. This can be an application (*.exe),
 * shell script (*.bat), or any file associated with an application in the system.
 * @param {string} file - full access path to the file
 * @param {string}[parameters] - additional parameters for the launched application
 */
function runExternalExecutiveFile(file, parameters) {
    var externalApp = new File(file);
    if(externalApp.exists) {
        externalApp.execute();
    }
}

/**
 * Returns an object with i18n dictionary converted to variable.
 * Function required by test documents from '05 tools' folder.
 * @param folder
 * @returns {{languages: *[]}}
 */
function getDictionary(folder) {
    var dictionary = {"languages":[]};
    var i18Files = getAllFiles(folder, '*.json');
    for (var i = 0; i < i18Files.length; i++) {
        dictionary.languages.push(JSON.parse(readTextFromFile(i18Files[i])));
    }
    return dictionary;
}