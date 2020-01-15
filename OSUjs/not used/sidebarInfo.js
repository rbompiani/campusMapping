  // When a user clicks on a feature on the map, intercept the
  // click event and display the data in a modal dialog box.
  function displayData(mouseEvent) {
	document.getElementById("info").innerHTML = 
	formatTableRowAsHtml(mouseEvent.row);
    //var dialog = new goog.ui.Dialog();
    //dialog.setTitle(mouseEvent.row['Building Name'].value);
    //dialog.setContent(formatTableRowAsHtml(mouseEvent.row));
    //dialog.setButtonSet(goog.ui.Dialog.ButtonSet.OK);
    //dialog.setVisible(true);
  }

  // Produce some nicely formatted HTML using the raw row data exposed as
  // part of the feature click event.
  function formatTableRowAsHtml(row) {
    var parts = [
      
	  '<center><br/><h2>',
	  row['Building Name'].value,
	  '</h2><br><img width="300px" src="',
      row['Photo'].value,
      '"></img><br><br>',
      '<b>Building Age: </b>',
      row['Building Age'].value,
      '<br /><b>Renovation: </b> ',
      row['Renovation'].value,
	  '<br /><b>Floors: </b> ',
      row['Floors'].value,
	  '<br /><b>Size: </b> ',
      row['Size'].value +' sf',
	  '<br /><b>Architect: </b> ',
      row['Architect'].value,
	  '<br /><b>Program: </b> ',
      row['Program'].value,
	  '</center>'
    ];
    return parts.join('');
  }