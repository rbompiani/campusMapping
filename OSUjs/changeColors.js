var legend_width = '150px';
var columns = {
  '--SELECT--': [
    {
      'color': '#999999',
    }
  ],
  'Use': [
    {
      'category': 'Instructional',
      'color': '#FA7236',
      'opacity': 0.7
    },
    {
      'category': 'Research',
      'color': '#C2361D',
      'opacity': 0.7
    },
    {
      'category': 'Support Services',
      'color': '#AB6B90',
      'opacity': 0.7
    },
    {
      'category': 'Athletics',
      'color': '#70C7D4',
      'opacity': 0.7
    },
    {
      'category': 'Housing and Dining',
      'color': '#CDD00A',
      'opacity': 0.7
    }
  ],
  'College': [
    {
      'category': 'College of Health & Human Sciences',
      'color': '#FA7236'
    },
    {
      'category': 'College of Engineering',
      'color': '#CDD00A'
    },
    {
      'category': 'College of Science',
      'color': '#70C7D4'
    },
    {
      'category': 'College of Agricultural Sciences',
      'color': '#C2361D'
    },
    {
      'category': 'College of Liberal Arts',
      'color': '#AB6B90'
    },
  ],
  'Historic - OSU': [
    {
      'category': 'Significant',
      'color': '#E45A15'
    },
    {
      'category': 'Contributing',
      'color': '#F78452'
    }
  ],
  'Historic - All': [
    {
      'category': 'OSU',
      'color': '#F78452'
    },
    {
      'category': 'City or OSBHE + OSU',
      'color': '#E45A15'
    },
    {
      'category': 'City + OSBHE + OSU',
      'color': '#C2361D'
    }
  ],
  'Historic - OSU': [
    {
      'category': 'Significant',
      'color': '#E45A15'
    },
    {
      'category': 'Contributing',
      'color': '#F78452'
    }
  ],
  'Condition': [
    {
      'category': 'Good',
      'color': '#94D487'
    },
    {
      'category': 'Fair',
      'color': '#FA7236'
    },
    {
      'category': 'Poor',
      'color': '#C2361D'
    }
  ]
}

function getKey() {
  for (key in columns) {
    return key;
  }
}

// Initialize the drop-down menu
function init_selectmenu() {
  var selectmenu = document.getElementById('colorOpts');
  for (column in columns) {
    var option = document.createElement('option');
    option.setAttribute('value', column);
    option.innerHTML = column;
    selectmenu.appendChild(option);
  }
}



function styleMap(prop) {
  const filter = columns[prop];
  let colorDef = {};
  for (type in filter) {
    const category = filter[type].category;
    const color = filter[type].color;
    colorDef[category] = color;
  }

  map.data.setStyle(function (feature) {
    const filterProp = feature.getProperty(prop);
    const color = colorDef[filterProp] || "#999999";
    return {
      fillColor: color,
      strokeWeight: 1,
      fillOpacity: 1
    };
  });

  updateLegend(prop);

}

function selectSector(prop) {
  map.data.setStyle(function (feature) {
    const sector = feature.getProperty("Sub-sector");
    if (sector != prop) {
      return {
        visible: false
      }
    }
  });
}

// Create the where clause	
function generateWhereRange(column_name, low, high) {

  //var newHigh = currentYear - low;
  //var newLow = currentYear - high;
  var whereClause = new Array();
  whereClause.push("'");
  whereClause.push(column_name);
  whereClause.push("' >= ");
  whereClause.push(low);
  whereClause.push(" AND '");
  whereClause.push(column_name);
  whereClause.push("' <= ");
  whereClause.push(high);
  return whereClause.join('');

}

function generateWhereEquals(column_name, category) {

  var whereClause = new Array();
  whereClause.push("'");
  whereClause.push(column_name);
  whereClause.push("' = '");
  whereClause.push(category);
  whereClause.push("'");
  return whereClause.join('');

}

// Create the legend with the corresponding colors
function updateLegend(column) {
  var legendDiv = document.createElement('div');
  var legend = new Legend(legendDiv, column);
  legendDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].pop();
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendDiv);
}

// Generate the content for the legend
function Legend(controlDiv, column) {
  controlDiv.style.padding = '10px';
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '1px';
  controlUI.style.width = legend_width;
  controlUI.title = 'Legend';
  controlDiv.appendChild(controlUI);
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';

  controlText.innerHTML = legendContent(column);
  controlUI.appendChild(controlText);
}

function legendContent(column) {
  var defined_styles = columns[column];

  // Generate the content for the legend using colors from object
  var controlTextList = new Array();
  controlTextList.push('<p><b>');
  controlTextList.push(column);
  controlTextList.push('</b></p>');
  for (defined_style in defined_styles) {
    var style = defined_styles[defined_style];
    if (style.min) {
      controlTextList.push('<div style="background-color: ');
      controlTextList.push(style.color);
      controlTextList.push('; height: 20px; width: 20px; margin: 3px; float: left;"></div>');
      controlTextList.push(style.min);
      controlTextList.push(' - ');
      controlTextList.push(style.max);
      controlTextList.push('<br style="clear: both;"/>');
    }
    else {
      controlTextList.push('<div style="background-color: ');
      controlTextList.push(style.color);
      controlTextList.push('; height: 20px; width: 20px; margin: 3px; float: left;"></div>');
      controlTextList.push(style.category);
      controlTextList.push('<br style="clear: both;"/>');
    }
  }

  controlTextList.push('<br />');
  return controlTextList.join('');
}
