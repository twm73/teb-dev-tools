#target estoolkit#dbg
//@include  "json2.jsx"

var extensionPath, sourceFolderPath, buildPath, sourceFolder, jsFiles, textIDSN, textPHXS, textILST, tempText, binJs, fileOut;



extensionPath = 'C:/Tools/Projects/Extension Builder/Extensions/pl.haveabook.plotline';
sourceFolderPath = extensionPath + '/01 source/libraries/appCode/sources';
buildPath = extensionPath + '/02 build/assets/appCode/libraries';
sourceFolder = new Folder (sourceFolderPath);
jsFiles = sourceFolder.getFiles('*.jsx');
$.writeln(jsFiles.length);
textIDSN = '';
textPHXS = '';
textILST = '';
tempText = '';
for (var i = 0; i < jsFiles.length; i++) {
    var tempFile = new File (jsFiles[i]);
    tempFile.open("r");
    tempText = tempFile.read();
    tempFile.close();
    tempFile.remove();
    switch (jsFiles[i].name.split('_')[0]) {
        case 'IDSN':
            textIDSN += tempText;
            break;
        case 'PHXS':
            textPHXS += tempText;
            break;
        case 'ILST':
            textILST += tempText;
            break;
        default:
            textIDSN += tempText;
            textPHXS += tempText;
            textILST += tempText;
            break;
    }
}
binJs = app.compile(textIDSN);
alert(buildPath + '/IDSN_library.jsxbin')
fileOut = File( buildPath + '/IDSN_library.jsxbin' );
fileOut.open("w");
fileOut.write(binJs);
fileOut.close();
binJs = app.compile(textPHXS);
fileOut = File( buildPath + '/PHXS_library.jsxbin' );
fileOut.open("w");
fileOut.write(binJs);
fileOut.close();
binJs = app.compile(textILST);
fileOut = File( buildPath + '/ILST_library.jsxbin' );
fileOut.open("w");
fileOut.write(binJs);
fileOut.close();