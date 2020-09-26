main();

function main() {

  // open a new document
  var myDocument = app.documents.add();
  var myPage = myDocument.layoutWindows[0].activePage;
  with(myDocument.documentPreferences){
    pageHeight = "11in";
    pageWidth = "8.5in";
    facingPages = false;
    pageOrientation = PageOrientation.portrait;
  }

  // set margins to 1/4" on masterspread
  with(myDocument.masterSpreads.item(0)) {
    with(pages.item(0)) {
      with (marginPreferences) {
        bottom = "0.25in";
        left = "0.25in";
        right = "0.25in";
        top = "0.25in";
      }
    }
    with(pages.item(1)) {
      with (marginPreferences) {
        bottom = "0.25in";
        left = "0.25in";
        right = "0.25in";
        top = "0.25in";
      }
    }
  }

  // Create an object style to apply to the graphic frames.
  // Currently not actually using or applying this...
  var myObjectStyle = myDocument.objectStyles.item("GraphicFrame");
  try {
    var myName = myObjectStyle.name;
  }
  catch (myError) {
    // The object style did not exist, so create it.
    myObjectStyle = myDocument.objectStyles.add({name:"GraphicFrame"});
  }

  // Display a "choose folder" dialog box.
  var myFolder = Folder.selectDialog ("Please choose a folder of images to work with.");
  // grab all files with the .jpg extension
  var images = myFolder.getFiles("*.jpg");

  // testing
  // boop(images.length);

  // for all the items i in this folder
    // for all the other items j in this folder?
      // make a rectangle and place i in it,
      // then make a rectangle and place j in it,
      // then add a new page
  // NOTE: THIS MIGHT BREAK INDESIGN FOR 500 CHOOSE 2 SETS
  for (var i=0; i<images.length; i++) {
    for (var j=0; j<images.length; j++) {
      if (i != j && i < j) {
        var myRectangleI = myPage.rectangles.add();
        myRectangleI.geometricBounds = myGetBounds(myDocument, myPage);
        myRectangleI.place(File(images[i].fullName), false);
        myRectangleI.fit(FitOptions.PROPORTIONALLY);
        myRectangleI.transparencySettings.blendingSettings.opacity = 50;

        var myRectangleJ = myPage.rectangles.add();
        myRectangleJ.geometricBounds = myGetBounds(myDocument, myPage);
        myRectangleJ.place(File(images[j].fullName), false);
        myRectangleJ.fit(FitOptions.PROPORTIONALLY);
        myRectangleJ.transparencySettings.blendingSettings.opacity = 50;

        myDocument.pages.add();
        // later: omit this for the last page (it's adding one extra page at end)
        myPage = myDocument.layoutWindows[0].activePage;
      }
    }
  }

  // export all pages to pdfs
  // Ask for target folder
  var myFolder = Folder.selectDialog("Please select a target folder for PDF generation.");
  for (var k=0; k<myDocument.pages.length; k++) {
    // Get current page name
    var myPageName = myDocument.pages[k].name;
    // Set the PDF export page range to the page name
    app.pdfExportPreferences.pageRange = myPageName;
    // Create new filename
    var myFileName = "testpage_" + k + ".pdf";
    // Create new filepath
    var myFilePath = myFolder.fullName + "/" + myFileName;
    // Create new file object
    var myFile = File(myFilePath);
    // Export the file
    // later: could catch for errors here or something
    myDocument.exportFile(ExportFormat.pdfType, myFile, false, "Press Quality");
  }

} // end main()


// ----------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// A useful function to override all master items on a page.
// ----------------------------------------------------------------------------
function OverrideMasterItems(myDocument, myPage) {
  var allItems = myPage.appliedMaster.pageItems.everyItem().getElements();
  for (var i=0; i<allItems.length; i++) {
    try{allItems[i].override(myPage)}
    catch(e){}
  }
}

// ----------------------------------------------------------------------------
// A useful function for finding the bounds of the live area
// ----------------------------------------------------------------------------
function myGetBounds(myDocument, myPage) {
  var myPageWidth = myDocument.documentPreferences.pageWidth;
  var myPageHeight = myDocument.documentPreferences.pageHeight;
  if (myPage.side == PageSideOptions.leftHand) {
    var myX2 = myPage.marginPreferences.left;
    var myX1 = myPage.marginPreferences.right;
  }
  else {
    var myX1 = myPage.marginPreferences.left;
    var myX2 = myPage.marginPreferences.right;
  }
  var myY1 = myPage.marginPreferences.top;
  var myX2 = myPageWidth - myX2;
  var myY2 = myPageHeight - myPage.marginPreferences.bottom;
  return [myY1, myX1, myY2, myX2];
}

// ----------------------------------------------------------------------------
// A very basic logging function written out of a desire to never use Adobe's
// ExtendScript editor.
//
// param {string} s - text to log.
//
// thanks to lily!
// ----------------------------------------------------------------------------
function boop(s) {
  var now = new Date();
  var output = now.toLocaleTimeString() + ": " + s;
  var logFolder = Folder(Folder.desktop.fsName + "/Logs");
  if (!logFolder.exists) {
    logFolder.create();
  }
  var logFile = File(logFolder.fsName + "/indesign_log.txt");
  logFile.lineFeed = "Unix";
  logFile.open("a");
  logFile.writeln(output);
  logFile.close();
}
