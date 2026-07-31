function spaces(count) {
  return space.repeat(count);
}
function createSection(parentSelector, sectionId, title, description) {
  const section = $(generateTag("div", { id: sectionId })).appendTo(parentSelector);
  section.append(generateTag(Constant.title_m, { text: title }));
  if (description) {
    section.append(generateTag("p", { text: description }));
  }
}
function createTabs(parentSelector, tabsId, tabNames, tabContentIds, options) {
  $(parentSelector).append(generateTag("div", { id: tabsId }));
  createTabItems("#" + tabsId, tabNames, tabContentIds, options);
  $("#" + tabsId).tabs({
    activate: function (event, ui) {
      const panelId = ui.newPanel.attr("id");
      if (panelId && panelId.indexOf("FilesTab") >= 0) {
        $("#" + panelId).css("display", "inline-block");
      }
    },
  });
}
function createDialog(parentSelector, dialogId, config) {
  if ($("#" + dialogId).length === 0) {
    $(parentSelector).append(
      generateTag("div", {
        id: dialogId,
        properties: [{ name: "title", value: config.title }],
      })
    );
  }
  
  const iconSpan = generateTag("span", {
    properties: [
      { name: "class", value: "ui-icon ui-icon-alert" },
      { name: "style", value: "float:left; margin:0 7px 20px 0;" },
    ],
  });
  
  $("#" + dialogId).append(
    generateTag("p", { text: iconSpan + config.content })
  );
  
  $(function () {
    $("#" + dialogId).dialog({
      modal: true,
      width: config.width,
      buttons: {
        Ok: function () {
          $(this).dialog("close");
        },
      },
    });
  });
}
function createTabItems(containerSelector, tabNames, contentIds, options) {
  $(containerSelector).append(generateTag("ul"));
  
  for (let i = 0; i < tabNames.length; i++) {
    $(generateTag("li"))
      .appendTo(containerSelector + " > ul")
      .append(
        generateTag("a", {
          text: tabNames[i],
          properties: [{ name: "href", value: "#" + contentIds[i] }],
        })
      );
    
    if (options && options.contents) {
      $(containerSelector).append(options.contents[i]);
    } else {
      $(generateTag("div", { id: contentIds[i] })).appendTo(containerSelector);
    }
  }
}
function createStepsArea(parentSelector, areaId, data, options) {
  if ($("#" + areaId).length === 0) {
    $(parentSelector).append(
      generateTag("div", {
        id: areaId,
        properties: [{ name: "style", value: "display: inline-block;" }],
      })
    );
  }
  createStepItems("#" + areaId, data, options);
}
function createMigrationStepSection(parentSelector, sectionId, config, options) {
  if ($("#" + sectionId).length === 0) {
    $(parentSelector).append(generateTag("div", { id: sectionId }));
  }
  
  $("#" + sectionId).css({
    "border-style": "solid",
    "padding-left": "40px",
    "padding-right": "40px",
    "border-width": "1px",
    "border-radius": "8px"
  });
  
  config.link.text = "more information";
  createDescriptionArea("#" + sectionId, sectionId + "_desc", config.desc);
  createMigrationStepListArea("#" + sectionId, sectionId + "_detail", config.list, options);
}
function createDescriptionArea(parentSelector, areaId, description) {
  if ($("#" + areaId).length === 0) {
    $(parentSelector).append(generateTag("div", { id: areaId }));
  }
  $("#" + areaId).append(generateTag("p", { text: description }));
}
function createMigrationStepListArea(e, t, a, n) {
  if ($("#" + t).length === 0) $(e).append(generateTag("div", { id: t }));

  // map input array to lookup
  const byKey = {};
  for (let k = 0; k < a.length; k++) byKey[(a[k].text || "").toLowerCase()] = a[k].value || 0;
  const err = +(byKey.error || byKey.errors || 0);
  const warn = +(byKey.warning || byKey.warnings || 0);
  const info = +(byKey.info || byKey.infos || 0);

  // tiny inline SVG icons
  const icoErr  = '<svg width="12" height="12" viewBox="0 0 12 12" style="vertical-align:-2px"><path d="M3 3 L9 9 M9 3 L3 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
  const icoWarn = '<svg width="12" height="12" viewBox="0 0 24 24" style="vertical-align:-2px"><path d="M12 3L1 21h22L12 3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>';
  const icoInfo = '<svg width="12" height="12" viewBox="0 0 24 24" style="vertical-align:-2px"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="8" r="1" fill="currentColor"/><path d="M12 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  const parts = [];
  if (err > 0)  parts.push(`<span style="color:red;display:inline-flex;align-items:center;gap:4px;">${icoErr} ${err} error${err===1?'':'s'}</span>`);
  if (warn > 0) parts.push(`<span style="color:orange;display:inline-flex;align-items:center;gap:4px;">${icoWarn} ${warn} warning${warn===1?'':'s'}</span>`);
  if (info > 0) parts.push(`<span style="color:#1565c0;display:inline-flex;align-items:center;gap:4px;">${icoInfo} ${info} info${info===1?'':'s'}</span>`);

  const link = generateTag("a", {
    id: t + "listlink",
    text: "Detailed List",
    properties: [
      {
        name: "href",
        value:
          window.location.protocol + "//" + window.location.hostname +
          (window.location.hostname !== "" ? ":" : "") + window.location.port +
          (window.location.port !== "" ? "/" : "") + window.location.pathname +
          "?view=detail&step=" + n.step,
      },
      { name: "target", value: "_blank" },
      { name: "style", value: "color:blue;" },
    ],
  });

  // join only nonzero parts
  const countsHtml = parts.length > 0 ? parts.join(", ") + " " : "";
  $("#" + t).append("<p>" + countsHtml + link + "</p>");
}
function getStepInfoText(labels, counts) {
  const parts = [];
  
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i].toLowerCase() + (counts[i] > 1 ? "s" : "");
    parts.push(counts[i] + "&nbsp;" + label);
  }
  
  const result = parts.join(",&nbsp;&nbsp;&nbsp;&nbsp;");
  return result ? result + "&nbsp;&nbsp;&nbsp;&nbsp;" : "";
}
function createStepItems(containerSelector, data, options) {
  if (!data || !data.steps) {
    return;
  }
  
  const steps = data.steps;
  const baseId = containerSelector.slice(1);
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    step.id = baseId + "_step" + i;
    
    $(containerSelector).append(
      generateTag(Constant.title_s, {
        text: "Step " + (i + 1) + " -  " + step.name,
        id: step.id + "_title",
      })
    );
    
    $(generateTag("div", { id: step.id })).appendTo(containerSelector);
    createMigrationStepSection("#" + step.id, step.id + "_section", step, { step: i });
  }
}
function createFormPanel(parentSelector, panelId, unused, fieldNames, fieldValues, options) {
  if ($("#" + panelId).length === 0) {
    $(parentSelector).append(generateTag("div", { id: panelId }));
  }
  
  if (options && options.style) {
    for (const styleItem of options.style) {
      $("#" + panelId).css(styleItem.name, styleItem.value);
    }
  }
  
  $(generateTag("table", { id: panelId + "_table", properties: [] })).appendTo("#" + panelId);
  
  if (options && options.table_style) {
    for (const styleItem of options.table_style) {
      $("#" + panelId + "_table").css(styleItem.name, styleItem.value);
    }
  }
  
  const columnWidth = (options && options.width) ? options.width : "140px";
  $(generateTag("col", {
    properties: [{ name: "width", value: columnWidth }],
  })).appendTo("#" + panelId + "_table");
  
  for (let i = 0; i < fieldNames.length; i++) {
    const row = $(generateTag("tr")).appendTo("#" + panelId + "_table");
    const trimmedName = fieldNames[i].trim();
    const colonSuffix = (trimmedName === "" || trimmedName === space) ? "" : ":";
    
    row.append(generateTag("td", { text: fieldNames[i] + colonSuffix }));
    row.append(generateTag("td", { text: fieldValues[i] }));
  }
}
function createProjectInfoArea(parentSelector, areaId, projectData, options) {
  if ($("#" + areaId).length === 0) {
    $(parentSelector).append(generateTag("div", { id: areaId }));
  }
  createFormPanel("#" + areaId, areaId + "_form", 4, projectData.names, projectData.values, options);
}
function createTitle(parentSelector, titleId, text, options) {
  $(parentSelector).append("<div id = '" + titleId + "'></div>");
  
  let iconHtml = "";
  if (options && options.icon) {
    const widthAttr = options.icon_width ? "' width='" + options.icon_width : "";
    const heightAttr = options.icon_height ? "' height='" + options.icon_height : "";
    iconHtml = "<img src='" + options.icon + widthAttr + heightAttr + "'/>";
  }
  
  const headerTag = (options && options.size) ? options.size : "h1";
  let titleContent = generateTag(headerTag, { text: iconHtml + text });
  
  if (options && options.addText) {
    titleContent += options.addText;
  }
  
  $("#" + titleId).append(titleContent);
}
function createListArea(parentSelector, areaId) {
  if ($("#" + areaId).length === 0) {
    $(parentSelector).append(generateTag("div", { id: areaId }));
  }
  
  $("#" + areaId).append(generateTag("table", { id: areaId + "_t" }));
  
  return {
    header: $(generateTag("thead", {
      id: areaId + "_t_hd",
      properties: [{ name: "class", value: "ui-widget-header" }],
    })).appendTo("#" + areaId + "_t"),
    body: $(generateTag("tbody", {
      id: areaId + "_t_bd",
      properties: [{ name: "class", value: "ui-widget-content" }],
    })).appendTo("#" + areaId + "_t"),
  };
}
function appendColumes(headerElement, columnNames) {
  const row = $(generateTag("tr")).appendTo(headerElement);
  for (const columnName of columnNames) {
    row.append(generateTag("th", { text: columnName }));
  }
}
function appendRecord(bodyElement, records, fieldKeys) {
  for (const record of records) {
    const row = $(generateTag("tr", {
      properties: [{ name: "class", value: "ui-widget-content" }],
    })).appendTo(bodyElement);
    
    for (const key of fieldKeys) {
      row.append(generateTag("td", { text: record[key] }));
    }
  }
}
function generateTag(tagName, config) {
  let html = "<" + tagName;
  
  if (config && config.id) {
    html += " id='" + config.id + "'";
  }
  
  if (config && config.properties) {
    for (const prop of config.properties) {
      html += " " + prop.name + "='" + prop.value + "'";
    }
  }
  
  html += ">";
  
  if (config && config.text) {
    html += config.text;
  }
  
  html += "</" + tagName + ">";
  return html;
}
function load_local_file(filePath, callback) {
  const cleanPath = filePath.replace(/"/g, "");
  
  $.ajax({ url: cleanPath, dataType: "text" })
    .done(function (content) {
      if (callback) {
        callback(content);
      }
    })
    .fail(function (xhr, status, error) {
      alert("Unable to read file " + cleanPath + ": " + error);
    });
}
function enableOpenHighlighter(className, unbind) {
  if (unbind) {
    $("." + className).unbind("click");
  }
  
  $("." + className).click(function () {
    const element = this;
    const filePath = element.text.replace(/\\/g, "/");
    
    load_local_file(filePath, function (content) {
      const plainTextContent = "<plaintext>" + content;
      window.target = "_blank";
      const newWindow = window.open("report/content.html");
      newWindow.filename = element.text;
      
      const isIE = window.navigator.userAgent.indexOf("MSIE ") > 0 ||
                   navigator.userAgent.match(/Trident.*rv\:11\./);
      
      if (isIE) {
        setTimeout(function () {
          checkReadyState(function () {
            newWindow.document.getElementById("codecontent").innerHTML = plainTextContent;
            newWindow.focus();
          }, newWindow);
        }, 1000);
      } else {
        $(newWindow).on("load", function () {
          newWindow.document.getElementById("codecontent").innerHTML = plainTextContent;
          newWindow.focus();
        });
      }
    });
  });
}
function checkReadyState(callback, targetWindow) {
  if (targetWindow.document.readyState !== "complete") {
    setTimeout(function () {
      checkReadyState(callback, targetWindow);
    }, 100);
  } else {
    callback();
  }
}
function generateFileListObject() {
  if (!main_filelist) {
    return null;
  }
  
  const asyncOrXsjs = (main_data && main_data.async_data !== "Async migration is not required when migrating the application to CAP") 
    ? "async_xsjs" 
    : "xsjs";
  
  const result = {
    sum: [{ name: "total generated files", value: main_filelist.length }],
    detail: [
      { name: asyncOrXsjs, number: 0, detail: {} },
      { name: "db", number: 0, detail: {} },
      { name: "web", number: 0, detail: {} },
      { name: "todo", number: 0, detail: {} },
    ],
  };
  
  for (const file of main_filelist) {
    let matched = false;
    
    for (const detailItem of result.detail) {
      if (file.container === detailItem.name) {
        matched = true;
        detailItem.number++;
        
        const ext = "." + file.ext;
        detailItem.detail[ext] = (detailItem.detail[ext] || 0) + 1;
        break;
      }
    }
    
    if (!matched) {
      const newDetail = { 
        name: file.container, 
        number: 1, 
        detail: { ["." + file.ext]: 1 } 
      };
      result.detail.push(newDetail);
    }
  }
  
  const containerNames = result.detail
    .filter(item => item.number > 0)
    .map(item => '"' + item.name + '"');
  
  result.sum.push({ 
    name: "content containers", 
    value: containerNames.toString() 
  });
  
  return result;
}
function initDetailView(parentSelector, viewId, data, options) {
  if ($("#" + viewId).length === 0) {
    $(parentSelector).append(
      generateTag("div", {
        id: viewId,
        properties: [{ name: "class", value: "ui-widget-content" }],
      })
    );
  }
  createDetailContent("#" + viewId, viewId + "_content", data, options);
}
function initAsyncMigratorView(parentSelector, viewId){
  const content = main_data.async_data;
  $("#" + viewId).append("<div id='" + viewId + "_Content'></div>");
  const asyncTabContent = "#" + viewId + "_Content";
  
  if (content === "No xsjs directory found! Skipping migration..." || 
      content === "Async migration is not required when migrating the application to CAP") {
    createSection(asyncTabContent, viewId + "_MigrationStatus", "Migration Status", content);
    return;
  }
  
  let asyncWarnings = main_data.async_warnings;
  asyncWarnings.forEach((warning, index) => {
    if (index === 2 || index === 3 || index === 4) {
      asyncWarnings[index] = "<span style='color: #000000;'>" + warning + "</span>";
    }
  });
  const asyncWarningsContent = asyncWarnings.join("<br>");
  
  const contentLines = content.split('\n');
  const migratedFiles = [];
  const asyncFunctions = [];
  
  contentLines.forEach(function (line) {
    if (line.includes("migrated file:")) {
      migratedFiles.push(line.replace(/migrated file:/g, '').trim());
    } else if (line.includes("has been made async")) {
      asyncFunctions.push(line.replace(/has been made async/g, '').trim());
    }
  });
  
  const uniqueMigratedFiles = Array.from(new Set(migratedFiles));
  const uniqueAsyncFunctions = Array.from(new Set(asyncFunctions));
  
  const columnsno = 4;
  const filesperColumn = Math.ceil(uniqueMigratedFiles.length / columnsno);
  let migratedFilesContent = "<table style='border-spacing: 20px 0;'><tr>";
  
  for (let i = 0; i < columnsno; i++) {
    migratedFilesContent += "<td valign='top'>";
    for (let j = i * filesperColumn; j < (i + 1) * filesperColumn; j++) {
      if (j < uniqueMigratedFiles.length) {
        migratedFilesContent += uniqueMigratedFiles[j];
        if (j < (i + 1) * filesperColumn - 1 && j < uniqueMigratedFiles.length - 1) {
          migratedFilesContent += "<br>";
        }
      }
    }
    migratedFilesContent += "</td>";
  }
  migratedFilesContent += "</tr></table>";
  
  const asyncFunctionsColumns = splitArray(uniqueAsyncFunctions, 5);
  let asyncFunctionsTable = "<table style='border-spacing: 20px 0;'><tbody>";
  const maxLen = Math.max(...asyncFunctionsColumns.map(col => col.length));
  
  for (let i = 0; i < maxLen; i++) {
    asyncFunctionsTable += "<tr>";
    for (let j = 0; j < 5; j++) {
      asyncFunctionsTable += "<td>";
      if (asyncFunctionsColumns[j] !== undefined && i < asyncFunctionsColumns[j].length) {
        asyncFunctionsTable += asyncFunctionsColumns[j][i];
      }
      asyncFunctionsTable += "</td>";
    }
    asyncFunctionsTable += "</tr>";
  }
  asyncFunctionsTable += "</tbody></table>";
  
  createSection(asyncTabContent, viewId + "_AsyncWarnings", "Migration Status", asyncWarningsContent);
  const migrationStatusContent = "Migrated files: " + uniqueMigratedFiles.length + "<br>" + 
                                 "Functions made async: " + uniqueAsyncFunctions.length;
  createSection(asyncTabContent, viewId + "_MigrationStatus", migrationStatusContent);
  createSection(asyncTabContent, viewId + "_MigratedFiles", "List of Migrated Files", migratedFilesContent);
  createSection(asyncTabContent, viewId + "_AsyncFunctions", "List of Functions made Async", asyncFunctionsTable);
  
  function splitArray(arr, parts) {
    const result = [];
    const len = Math.ceil(arr.length / parts);
    for (let i = 0; i < arr.length; i += len) {
      result.push(arr.slice(i, i + len));
    }
    return result;
  }
}
function initCAPMigratorView(e, t) {
  // Helper function to generate standardized list HTML
  function arrayToListHTML(arr, fontSize = "16px") {
    return `<ul style="color: black; font-size: ${fontSize};">${arr.map(item => `<li>${item}</li>`).join('')}</ul>`;
  }

  let title, reportHTML, noFunctionTitle;

  $("#" + t).append(`
    <style>
      #${t}_Content {
        font-family: sans-serif;
        font-size: 16px;
        color: black;
      }
      #${t}_Content ul li {
        margin-bottom: 12px;
      }
      #${t}_Content h4,
      #${t}_Content h5 {
        font-weight: bold;
      }
      #${t}_Content table th,
      #${t}_Content table td {
        font-size: 16px;
        font-family: sans-serif;
      }
    </style>
    <div id='${t}_Content'></div>
  `);
  
  var capTabContent = "#" + t + "_Content";
  var content = main_data.cap_logs;

  if (content === "CAP Migration is not required when migrating the application to XSA") {
    var formatted_content = "CAP Migration not needed when migrating application to XSA!";
    createSection(capTabContent, t + "_MigrationCAPStatus", "Migration Status", formatted_content);
    return;
  } else {

    var caplogs = main_data.cap_logs;
    caplogs[0] = "SAP HANA native artifacts such as 'hdbtable', 'hdbcalculationviews', 'hdbview', and 'hdbfunctions' will not be read by CDS. To make these objects recognizable to CDS, respective proxy files are created with certain limitations. For more information on this, please refer to the <a href='https://cap.cloud.sap/docs/advanced/hana' style='color: blue;' target='_blank' rel='noopener noreferrer'>Cloud Application Programming model documentation</a>.";
    
    var caplogsHtml = `
    <div style="font-family: Arial, sans-serif;line-height: 1.6; color: #333;">
      <ul>
        ${caplogs.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `;

    var capdata = main_data.capdata;
    var reportHdbtableFiles = main_data.reportHdbtableFiles;
    var reportHdbfunctionFiles = main_data.reportHdbfunctionFiles;
    var reportCalcCdsFiles = main_data.reportCalcCdsFiles;
    var reportHdbcdsToCdsFiles = main_data.reportHdbcdsToCdsFiles;
    var runtimeVirtualTableDependentObjects= main_data.runtimeVirtualTableDependentObjects;
    var hdbIndexConversionMsgs = main_data.hdbIndexConversionMsgs
    var reportHdbroleFiles = main_data.hdbroleCleanupMsgs

    var post_mig = [
      "SQL syntax changes in procedures, e.g., UPDATE FROM has to be changed into MERGE INTO, and TRUNCATE statements with DELETE FROM.",
      "Reptask and Replication artifacts need to be adjusted to make them CAP compliant.",
      "If Aliases are being used anywhere in the CDS files, please make sure that these are in uppercase.",
      "A folder named 'unsupported_feature' has been created by the extension to contain file extensions that are not supported in SAP HANA Cloud. The files in this folder need to be handled manually.",
      "Unsupported types and functions in calculation views, e.g., 'CE_FUNCTION', 'CACHE', etc. Please check the SAP HANA Cloud documentation.",
      "Verify the cross-container artifacts before deployment.",
      "Series entity is not supported in SAP HANA Cloud and will be removed by the extension. Please check the Migration Documentation for more information.",
      "CDS Access Policy entity definition is not supported in CAP CDS.",
      "For hdbsynonym, hdbsynonymconfig, and hdbrole files, please check the target object parameters and role names before deployment.",
      "The memory threshold parameter is not supported in SAP HANA Cloud and will be removed by the extension.",
      "Fulltext indexes are not supported in SAP HANA Cloud and have been removed.",
      "For hdbflowgraph, ensure that the expression content within the <node> tag is verified before deployment."
    ];
    post_mig[4] = 'Unsupported types and functions in calculation view ex: "CE_FUNCTION", "CACHE" etc, please check the <a href="https://help.sap.com/docs/hana-cloud/sap-hana-cloud-migration-guide/design-time-content-compatibility?locale=en-US" style="color: blue;" target="_blank" rel="noopener noreferrer">SAP HANA Cloud Documentation</a>.';
    post_mig[6] = 'Series entity is not supported in SAP HANA Cloud so they will be removed by the extension. Please check the <a href="https://help.sap.com/docs/hana-cloud/sap-hana-cloud-migration-guide/series-data" style="color: blue;" target="_blank" rel="noopener noreferrer">Migration Documentation</a> for more information.';

    var post_mig_html = `
  <div style="font-family: Arial, sans-serif;line-height: 1.6; color: #333;">
    <ul>
      ${post_mig.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
`;


    // intro part
    createSection(capTabContent, t + "_Caplogs", "Migration Status", caplogsHtml);

    // hdbdd (hdbcdsToCds) part
    if (reportHdbcdsToCdsFiles.length !== 0) {
      title = '<div style="font-size:18px;">hdbdd Files Migrated:</div>';
      reportHTML = arrayToListHTML(reportHdbcdsToCdsFiles, "14px");
      createSection(capTabContent, t + "_Caplogs", title, reportHTML);
    } else {
      title = '<div style="font-size:18px;">No hdbdd files found to migrate</div>';
      createSection(capTabContent, t + "_none", title, " ");
    }

    if(Object.keys(reportHdbroleFiles).length>0){
     const list = Object.entries(reportHdbroleFiles).map(([fileName, messages]) => {
      const joinedMessages = messages
        .map(msg => `"${msg}"`)
        .join(' AND ');
        return `${fileName} - ${joinedMessages}`;
    });
       title = '<div style="font-size:18px;">hdbrole Files Migrated:</div>';
      reportHTML = arrayToListHTML(list, "14px");
      createSection(capTabContent, t + "_Caplogs", title, reportHTML);
    }

    // hdbfunction part
    if (reportHdbfunctionFiles.length !== 0) {
      title = '<div style="font-size:18px;">hdbfunction Files Migrated:</div>';
      reportHTML = arrayToListHTML(reportHdbfunctionFiles, "14px");
      createSection(capTabContent, t + "_Caplogs", title, reportHTML);
    } else {
      noFunctionTitle = '<div style="font-size:18px;">No hdbfunction files found to migrate</div>';
      createSection(capTabContent, t + "_none", noFunctionTitle, " ");
    }

    // calculationview part
    if (reportCalcCdsFiles.length !== 0) {
      title = '<div style="font-size:18px;">calculationview Files Migrated</div>';
      reportHTML = arrayToListHTML(reportCalcCdsFiles, "14px");
      createSection(capTabContent, t + "_info", title, reportHTML);
    } else {
      title = '<div style="font-size:18px;">No calculationview files found to migrate</div>';
      createSection(capTabContent, t + "_none", title, " ");
    }

     //hdbindex - hash index convertion msgs part
     if (hdbIndexConversionMsgs.length !== 0) {
      title = '<div style="font-size:18px;">hdbindex Files Migrated:</div>';
      reportHTML = arrayToListHTML(
                            hdbIndexConversionMsgs.map(w =>
                              w.isUnique
                                ? `UNIQUE INVERTED HASH INDEX converted to UNIQUE INVERTED VALUE INDEX in file ${w.source_fileName}`
                                : `INVERTED HASH INDEX converted to INVERTED VALUE INDEX in file ${w.source_fileName}`
                            ),
                            "14px"
                          );
      createSection(capTabContent, t + "_hdbindexlogs", title, reportHTML);
    }

    const rawTaTables = main_data.Ta || [];
    const rawTmTables = main_data.Tm || [];
    
    function cleanTaTableNames(tables) {
      return tables.map(t => ({
        TABLE_NAME: t.TABLE_NAME.replace(/^\$TA_/, '')
      }));
    }
    
    function extractUniqueTmSuffixes(tables) {
      const seen = new Set();
      const suffixes = [];
    
      for (const t of tables) {
        const match = t.TABLE_NAME.match(/^\$TM_[^_]+_(.+)$/);
        if (match) {
          const suffix = match[1];
          if (!seen.has(suffix)) {
            seen.add(suffix);
            suffixes.push({ TABLE_NAME: suffix });
          }
        }
      }
    
      return suffixes;
    }
    
    function createTable(title, rows) {
      return `
        <div style="margin-top: 25px;">
          <h4>${title}</h4>
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 14px;">
            <thead style="background-color: #d7ebf9;">
              <tr>
                <th>Table Name</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `<tr><td>${row.TABLE_NAME}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
    
    // Apply transformation
    
    
    const taTables = cleanTaTableNames(rawTaTables);
    const tmTables = extractUniqueTmSuffixes(rawTmTables);
    
    let taTableHTML = '';
    let tmTableHTML = '';
    
    if (taTables.length > 0) {
      taTableHTML = createTable('Tables with Text Analysis', taTables);
    }
    if (tmTables.length > 0) {
      tmTableHTML = createTable('Tables with Text Mining', tmTables);
    }
    
    const combinedHTML = `
      <h4>TextAnalysis and TextMining parameters have been found in the following tables. Please follow the guides below to make the changes before deployment:</h4>
      <ul>
        <li>
          <a href="https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-predictive-analysis-library/text-analysis-textanalysis?locale=en-US" 
             target="_blank" 
             rel="noopener noreferrer"
             style="color:blue;">
             Text Analysis Documentation
          </a>
        </li>
        <li>
          <a href="https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-predictive-analysis-library/text-mining-text-mining-96687ab?locale=en-US" 
             target="_blank" 
             rel="noopener noreferrer"
             style="color:blue;">
             Text Mining Documentation
          </a>
        </li>
      </ul>
      ${taTableHTML}
      ${tmTableHTML}
    `;
    
    if (taTableHTML || tmTableHTML) {
      createSection(capTabContent, t + "_Content", "Text Analysis and Text Mining", combinedHTML);
    }
    

  }
  if(Object.keys(runtimeVirtualTableDependentObjects).length != 0){
    createSection(capTabContent, t + "_VirtualTables", "hdbvirtual tables were found during the migration", "Below are the virtual tables found during migration, and synonyms have been generated for them. Please find the hdb artifacts that use these virtual tables.");
    var tableContent = "<table style='border-collapse: collapse; width: 100%; text-align: left;'>";
    tableContent += "<thead><tr style='border: 1px solid black; background-color: #f2f2f2;'>";
    tableContent += "<th style='border: 1px solid black; padding: 8px;'>Table Name</th>";
    tableContent += "<th style='border: 1px solid black; padding: 8px;'>Dependent Artifact</th>";
    tableContent += "<th style='border: 1px solid black; padding: 8px;'>Dependent Artifact Type</th>";
    tableContent += "</tr></thead>";
    tableContent += "<tbody>";

    for (var tableName in runtimeVirtualTableDependentObjects) {
      var dependentObjects = runtimeVirtualTableDependentObjects[tableName];
      var rowSpan = dependentObjects.length;
      dependentObjects.forEach((obj, index) => {
        tableContent += "<tr style='border: 1px solid black;'>";
        if (index === 0) {
          tableContent += `<td style='border: 1px solid black; padding: 8px; text-align: center; vertical-align: middle;' rowspan="${rowSpan}">${tableName}</td>`;
        }
        tableContent += `<td style='border: 1px solid black; padding: 8px;'>${obj.DEPENDENT_OBJECT_NAME}</td>`;
        tableContent += `<td style='border: 1px solid black; padding: 8px;'>${obj.DEPENDENT_OBJECT_TYPE}</td>`;
        tableContent += "</tr>";
      });
    }

    tableContent += "</tbody></table>";
    createSection(capTabContent, t + "_VirtualTablesTable", "", tableContent);
  }
  else{
    title='<div style="font-size:18px;">' + "No hdbvirtualtables found during migration" + '</div>';
    createSection(capTabContent,t+"_none",title," ");
  }

    // limitations part
    var issuesHTML = arrayToListHTML(capdata);
    createSection(capTabContent, t + "_Content", "Features that are currently out of scope:", issuesHTML);

    createSection(capTabContent, t + "_Content", "Post Migration Steps - Database Layer:", post_mig_html);
    // Post Migration Steps - Service Layer
    const postMigsectionSrv = document.createElement('div');
    postMigsectionSrv.classList.add('section');
    postMigsectionSrv.innerHTML = `
       <style>
         #${t}_Content .section ul li {
         font: sans-serif
         font-size: 16px;
        }
    
       </style>
      <h4>Post Migration Steps - Service Layer</h4>
      <p class="highlight">Migration of Service Artifacts from XSJS to CAP NodeJS is complete. However, please verify the following service-level details post-migration:</p>
      <h5>service.cds</h5>
      <ul>
        <li><strong>Entity Imports:</strong> Confirm that all entities from DB are correctly imported. Some imports may be missing or incorrectly formatted. Add missing <strong>using</strong> statements manually. CAP by default converts HANA object names to uppercase with underscores. Refer <a href='https://cap.cloud.sap/docs/advanced/hana#make-the-object-known-to-cds' style='color: blue;' target='_blank' rel='noopener noreferrer'>CAP HANA Naming Convention.</a></li>
        <li><strong>Service Name:</strong> Each <strong>service.cds</strong> file uses the xsodata filename as the service name. There might be duplicate service names due to same <strong>.xsodata</strong> filenames across directories. Verify and rename if required.</li>
        <li><strong>Duplicate Exposed Entities:</strong> If multiple services expose the same entity, review and remove duplicates unless explicitly needed.</li>
        <li><strong>Entity Columns:</strong> Check if column names align with functional logic. If mismatches exist, correct them based on the original <strong>.xsodata</strong> logic.</li>
        <li><strong>Associations & Compositions:</strong> If an entity contains complex association or composition relationships, verify that they are correctly structured. The Gen-AI may not always interpret or convert deep associations accurately. You may need to rewrite them manually based on the original data model and business logic.</li>
      </ul>

      <h5>service.js</h5>
      <ul>
        <li>Review for correct binding between entity operations and handler functions (e.g., <strong>srv.on('READ', ...)</strong>).</li>
      </ul>

      <h5>custom-service.cds</h5>
      <ul>
        <li>Default service name is <strong>CustomService</strong>. You must rename it to a unique and meaningful name.</li>
        <li>Validate that any additional or extended services are logically separated from the main <strong>service.cds</strong>.</li>
      </ul>

      <h5>custom-service.js</h5>
      <ul>
        <li>Ensure all custom logic handlers are correctly implemented and bound.</li>
        <li>Replace or refactor placeholder logic (if any) added by the migration assistant.</li>
      </ul>

      <h5>handlers</h5>
      <ul>
        <li>Confirm that all converted <strong>.xsjs</strong>/<strong>.xsjslib</strong> files are present.</li>
        <li>
          Each file must export a function that binds to its relevant service events.
          <ul>
            <li>In ES6 script, there are multiple ways in which a function or a file can be imported or exported.</li>
            <li>Please review all the exports done in each file and make sure that they are imported correctly in other files.</li>
          </ul>
        </li>
        <li>
          If the original <strong>.xsjs</strong> code contains raw SQL statements:
          <ul>
            <li>These may reference tables, views, or columns using SAP HANA naming.</li>
            <li>In SAP HANA Cloud, naming conventions follow uppercase with underscores.</li>
            <li>Review and adjust any raw SQL queries in the code to align with the actual object names referring to migrated DB artifacts. Reference DB migration report for the converted/renamed entities.</li>
          </ul>
        </li>
        <li>Verify functionality by comparing with original <strong>.xsjs</strong> and <strong>.xsjslib</strong> logic. Some constructs (e.g., response manipulation, error handling) require adaptation to CAP's async/event model.</li>
      </ul>
    `;
    const serviceTableSection = document.createElement("div");
      serviceTableSection.classList.add("section");
      serviceTableSection.innerHTML = `
        <h4>Limitations - Service Layer</h4>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 14px;">
          <thead style="background-color:#d7ebf9;">
                  <tr>
        <th style="text-align: left;">Area</th>
        <th style="text-align: left;">Limitation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Entity Import</td>
        <td>Namespaces in <strong>.hdbcds</strong> files may not map cleanly. You may need to adjust <strong>using</strong> statements manually in <strong>service.cds</strong>.</td>
      </tr>
      <tr>
        <td>Role Definitions</td>
        <td> <strong>xsprivileges</strong> are not automatically mapped. CAP uses <strong>@requires</strong> for access control and this must be configured manually.</td>
      </tr>
      <tr>
        <td>Custom SQL Logic</td>
        <td>Procedures or views with input tables or advanced logic may not convert well. Review all manually converted logic for correctness.</td>
      </tr>
      <tr>
        <td>Shared Services</td>
        <td>If multiple services expose the same entity, CAP will throw an error. De-duplicate service exposures manually.</td>
      </tr>
      <tr>
        <td>Unsupported Features</td>
        <td>Artifacts like <strong>CE_FUNCTION</strong>, <strong>CACHE</strong>, or unsupported XSJS libraries are moved to an <strong>unsupported_feature</strong> folder and require manual review.</td>
      </tr>
          </tbody>
        </table>
      `;
    if (main_data.srvCheck === true) {
      document.querySelector(capTabContent).appendChild(postMigsectionSrv);
      document.querySelector(capTabContent).appendChild(serviceTableSection);
    }
  }
  




function initDetailView_standalone(parentSelector, viewId, data, options) {
  if ($("#" + viewId).length === 0) {
    $(parentSelector).append(
      generateTag("div", {
        id: viewId,
        properties: [{ name: "class", value: "ui-widget-content" }],
      })
    );
  }
  createDetailContent_standalone("#" + viewId, viewId + "_content", data, options);
}
function createDetailContent_standalone(parentSelector, contentId, data, options) {
  if ($("#" + contentId).length === 0) {
    $(parentSelector).append(
      generateTag("div", {
        id: contentId,
        properties: [{ name: "class", value: "ui-widget-content" }],
      })
    );
  }
  
  const step = data.steps[options.step];
  const title = "Step " + (parseInt(options.step) + 1) + ": " + step.name;
  const tabsId = contentId + "_tabs";
  
  $("#" + contentId).append(generateTag(contentId + "_tabs"));
  
  const extendedOptions = options || {};
  extendedOptions.desc = step.desc;
  extendedOptions.standalone = true;
  
  createDetailSection(contentId + "_tabs", title, tabsId, step, extendedOptions);
  enableOpenHighlighter("FileOpen", true);
}
function createDetailContent(parentSelector, contentId, data, options) {
  if ($("#" + contentId).length === 0) {
    $(parentSelector).append(
      generateTag("div", {
        id: contentId,
        properties: [{ name: "class", value: "ui-widget-content" }],
      })
    );
  }
  
  const tabTitles = [];
  const tabIds = [];
  
  for (let i = 0; i < data.steps.length; i++) {
    const step = data.steps[i];
    tabTitles.push("Step " + (i + 1) + ": " + step.name);
    tabIds.push(contentId + "_tabs_sections_" + i);
  }
  
  createDetailSectionTabs("#" + contentId, contentId + "_tabs", tabTitles, tabIds, options);
  
  for (let i = 0; i < data.steps.length; i++) {
    createDetailSection(contentId + "_tabs", tabTitles[i], tabIds[i], data.steps[i], options);
  }
  
  enableOpenHighlighter("FileOpen", true);
}
function createDetailSectionTabs(parentSelector, tabsId, tabTitles, tabIds, options) {
  $(function () {
    $("#" + tabsId).addClass("ui-tabs-vertical ui-helper-clearfix");
    $("#" + tabsId + " li")
      .removeClass("ui-corner-top")
      .addClass("ui-corner-left");
  });
  createTabs(parentSelector, tabsId, tabTitles, tabIds, options);
}
function createDetailSection(parentSelector, title, sectionId, stepData, options) {
  if (options && options.standalone === true && Object.keys(stepData.messages).length === 0) {
    window.location.href = stepData.link.url;
  }
  
  if ($("#" + sectionId).length === 0) {
    $(parentSelector).append(generateTag("div", { id: sectionId }));
  }
  
  generateDetailFromMessages("#" + sectionId, title, sectionId + "_content", stepData.messages, options);
}
function generateDetailFromMessages(parentSelector, title, contentId, messages, options) {
  if ($("#" + contentId).length === 0) {
    $(parentSelector).append(generateTag("div", { id: contentId }));
  }
  
  $("#" + contentId).append(generateTag(Constant.title_m, { text: title }));
  
  const description = (options && options.desc) ? options.desc : "Warnings and Errors";
  $("#" + contentId).append(generateTag("p", { text: description }));
  
  const styleOptions = options || {};
  styleOptions.style = { name: "style", value: "padding-left:20px" };
  
  const tableColumns = ["type", "category", "file"];
  
  if (messages.ERROR) {
    createDetailSectionTitle(
      parentSelector,
      contentId + "_title",
      "Error (" + messages.ERROR.length + ")",
      styleOptions
    );
    const errorRecords = getDetailTableMessages(messages.ERROR);
    generateDetailTable(
      parentSelector,
      contentId + "table_error",
      tableColumns,
      errorRecords,
      tableColumns,
      styleOptions
    );
  }
  
  if (messages.WARNING) {
    createDetailSectionTitle(
      parentSelector,
      contentId + "_title",
      "Warning (" + messages.WARNING.length + ")",
      styleOptions
    );
    const warningRecords = getDetailTableMessages(messages.WARNING);
    generateDetailTable(
      parentSelector,
      contentId + "table_warning",
      tableColumns,
      warningRecords,
      tableColumns,
      styleOptions
    );
  }
  
  if (messages.INFO) {
    createDetailSectionTitle(
      parentSelector,
      contentId + "_title",
      "Info (" + messages.INFO.length + ")",
      styleOptions
    );
    const infoRecords = getDetailTableMessages(messages.INFO);
    generateDetailTable(
      parentSelector,
      contentId + "table_info",
      tableColumns,
      infoRecords,
      tableColumns,
      styleOptions
    );
  }
}
function formatMessageText(message) {
  if (
    message &&
    "[object Array]" === Object.prototype.toString.call(message) &&
    message.length > 1
  ) {
    let result = message[0];
    for (let i = 0; i < message.length - 1; i++) {
      const placeholder = "{*" + i + "}";
      const regex = new RegExp(placeholder, "g");
      result = result.replace(regex, message[i + 1]);
    }
    return result;
  }
  return message.toString();
}

function formatLocationInfo(loc) {
  let locationStr = "";
  if (!loc) {
    return locationStr;
  }
  
  if (loc.length > 5) {
    locationStr += "<br>";
  }
  locationStr += " (in line: ";
  
  if ("[object Array]" === Object.prototype.toString.call(loc)) {
    for (let i = 0; i < loc.length; i++) {
      locationStr += loc[i].start.line;
      if (i != loc.length - 1) {
        locationStr += ", ";
      }
    }
  } else {
    locationStr += loc.start.line;
  }
  locationStr += ") ";
  
  return locationStr;
}

function getDetailTableMessages(e) {
  const results = [];
  
  for (const item of e) {
    let messageText = formatMessageText(item.message);
    
    if (item.description) {
      messageText += "<br>" + item.description.toString();
    }
    
    const locationStr = formatLocationInfo(item.loc);
    
    const fileInfo = item.file && "" != item.file
      ? item.file + " " + locationStr + "<br>"
      : "";
    
    results.push({
      type: item.type,
      category: item.category,
      file: fileInfo + messageText
    });
  }
  
  return results;
}
function generateDetailTable(parentSelector, tableId, headerColumns, records, fieldKeys, options) {
  const detail_area = createListArea(parentSelector, tableId);
  detail_area.header.parent().css("padding-left", "8px");
  detail_area.header.parent().css("padding-right", "40px");
  appendColumes(detail_area.header, headerColumns);
  appendRecord(detail_area.body, records, fieldKeys);
}
function createDetailSectionTitle(parentSelector, titleId, text, options) {
  const config = { text: text, properties: [] };
  
  if (options && options.style) {
    config.properties.push(options.style);
  }
  
  const underlinedText = generateTag("u", config);
  $(parentSelector).append(generateTag(Constant.title_m, { text: underlinedText }));
}
function setSectionBorderStyle(elementId) {
  $("#" + elementId).css({
    "padding-left": "8px",
    "padding-right": "40px"
  });
}
function initFileListView(parentSelector, viewId, options) {
  if (!statisticObject) {
    statisticObject = generateFileListObject();
  }
  
  if ($("#" + viewId).length === 0) {
    $(parentSelector).append(
      generateTag("div", {
        id: viewId,
        properties: [{ name: "class", value: "ui-widget-content" }],
      })
    );
  }
  
  createFilterArea("#" + viewId, viewId + "_filters", statisticObject.detail, options);
  $("#" + viewId).append("<hr>");
  createFileListContent("#" + viewId, viewId + "_content", options);
}
function createFilterArea(parentSelector, filterId, detailData, options) {
  if ($("#" + filterId).length === 0) {
    $(parentSelector).append(generateTag("div", { id: filterId }));
  }
  
  if (options && options.newtab === true) {
    $("#" + filterId).css({
      "padding-left": "8px",
      "padding-right": "40px"
    });
  }
  
  const containerFilters = [{ text: "All", key: "all" }];
  filterExt = [{ text: "All", key: "all" }];
  
  for (const item of detailData) {
    containerFilters.push({ text: item.name, key: item.name });
    for (const ext in item.detail) {
      filterExt.push({ text: ext, key: ext, container: item.name });
    }
  }
  
  const containerConfig = {
    text: "filter for container: ",
    change: function () {
      containerFilterUpdate(filterId);
    }
  };
  
  const extensionConfig = {
    text: "filter for extension: ",
    change: function () {
      extensionFilterUpdate(filterId);
    }
  };
  
  createFilter("#" + filterId, filterId + "_con", containerFilters, containerConfig);
  createFilter("#" + filterId, filterId + "_ext", filterExt, extensionConfig);
}
function containerFilterUpdate(filterId) {
  const selected = $("#" + filterId + "_con_section_list option:selected");
  
  if (selected.length !== 1) {
    return;
  }
  
  fileFilter.container = selected.attr("key");
  
  let extensionFilters;
  if (fileFilter.container !== "all") {
    extensionFilters = [{ text: "All", key: "all" }];
    for (const ext of filterExt) {
      if (ext.container === fileFilter.container) {
        extensionFilters.push(ext);
      }
    }
  } else {
    extensionFilters = filterExt;
  }
  
  fileFilter.extension = "all";
  list_area.body.empty();
  $("#" + filterId + "_ext_section").empty();
  $("#" + filterId + "_ext_section").remove();
  
  const extensionConfig = {
    text: "filter for extension: ",
    change: function () {
      extensionFilterUpdate(filterId);
    }
  };
  
  createFilter("#" + filterId, filterId + "_ext", extensionFilters, extensionConfig);
  appendCreatedFileList(list_area.body, main_filelist, fileFilter);
}
function extensionFilterUpdate(filterId) {
  const selected = $("#" + filterId + "_ext_section_list option:selected");
  
  if (selected.length === 1) {
    fileFilter.extension = selected.attr("key");
    list_area.body.empty();
    appendCreatedFileList(list_area.body, main_filelist, fileFilter);
  }
}
function createFilter(parentSelector, filterId, options, config) {
  const section = $(generateTag("p", { id: filterId + "_section" })).appendTo(parentSelector);
  
  section.append(
    generateTag("lable", {
      text: config.text,
      properties: [{ name: "for", value: filterId + "_section_list" }],
    })
  );
  
  section.append(
    generateTag("select", {
      id: filterId + "_section_list",
      properties: [{ name: "name", value: filterId + "_section_list" }],
    })
  );
  
  for (const option of options) {
    $("#" + filterId + "_section_list").append(
      generateTag("option", {
        text: option.text,
        properties: [{ name: "key", value: option.key }],
      })
    );
  }
  
  $("#" + filterId + "_section_list").change(config.change);
}
function createFileListContent(parentSelector, contentId, options) {
  list_area = createListArea(parentSelector, contentId);
  
  if (options && options.newtab === true) {
    list_area.header.parent().css("padding-left", "8px");
    list_area.header.parent().css("padding-right", "40px");
  }
  
  const filter = (options && options.filter) 
    ? options.filter 
    : { container: "all", extension: "all" };
  
  appendColumes(list_area.header, filelist_view_columns);
  appendCreatedFileList(list_area.body, main_filelist, filter);
}
function appendCreatedFileList(bodyElement, filelist, filter) {
  const containerFilter = (filter.container === "all") ? null : filter.container;
  let extensionFilter = (filter.extension === "all") ? null : filter.extension;
  
  // Validate extension filter belongs to selected container
  if (containerFilter && extensionFilter) {
    let isValidExtension = false;
    for (const item of filterExt) {
      if (item.key === extensionFilter) {
        if (item.container === containerFilter) {
          isValidExtension = true;
          break;
        }
      }
    }
    if (!isValidExtension) {
      extensionFilter = null;
    }
  }
  
  for (const file of filelist) {
    let shouldInclude = true;
    
    if (containerFilter && file.container !== containerFilter) {
      shouldInclude = false;
    }
    
    if (extensionFilter && !file.name.endsWith(extensionFilter)) {
      shouldInclude = false;
    }
    
    if (shouldInclude) {
      const row = $(generateTag("tr", {
        properties: [{ name: "class", value: "ui-widget-content" }],
      })).appendTo(bodyElement);
      
      row.append(generateTag("td", { text: file.container }));
      row.append(generateTag("td", { text: file.name }));
    }
  }
  
  enableOpenHighlighter("FileListView", true);
}

function initSummaryView(parentSelector, viewId) {
  const projectData = { names: [], values: [] };
  
  projectData.names.push("Project");
  projectData.values.push(main_data.project.name + " - " + main_data.project.version);
   projectData.names.push("Migration Path");
  projectData.values.push(main_data.migration_path);
   projectData.names.push("Migration Scope");
projectData.values.push(
  main_data?.service_layer === "Yes"
    ? "service layer and database layer"
    : "database layer"
);
  projectData.names.push("Content");
  
  let contentValue = main_data.task.dus.length + 
    (main_data.task.dus.length > 1 ? " DUs, " : " DU, ");
  
  for (const du of main_data.task.dus) {
    contentValue += du.name + " (" + du.vendor + ") -" + du.version;
  }
  
  contentValue += ", including " + 
    main_data.task.packages.length + " packages and " + 
    main_data.sum[0].number + " objects";
  
  projectData.values.push(contentValue);
  
  projectData.names.push("System");
  projectData.values.push(
    main_data.system.protocol + "://" + 
    main_data.system.host + ":" + 
    main_data.system.port + ", SID:" + 
    main_data.system.sid + ", version " + 
    main_data.system.hana_version
  );
  
  projectData.names.push("VSCode Version");
  projectData.values.push(
    main_data["mig-tool-version"] + "/" + main_data["extension-version"]
  );
  
  createProjectInfo("#" + viewId, "summary_projectInfo", projectData);
  createMigrationStep("#" + viewId, "summary_migrationSteps", main_data);
}
function createProjectInfo(parentSelector, infoId, projectData) {
  createSection(parentSelector, infoId, "Project Information");
  createProjectInfoArea(parentSelector, infoId, projectData);
}
function createMigrationStep(parentSelector, stepId, data) {
  createSection(parentSelector, stepId, "Migration Steps", CON_TEXT.Migration_Desc);
  createStepsArea("#" + stepId, "migration_steps_accordion", data);
}
function createDocsArea(parentSelector, docsId, data) {
  createSection(parentSelector, docsId, "How to find useful docs");
  
  if (data.docs && data.docs.link) {
    for (const link of data.docs.link) {
      createReferenceLinksArea("#" + docsId, docsId + "_link", link);
    }
  }
}
function initStatisticsView(parentSelector, viewId) {
  if (!statisticObject) {
    statisticObject = generateFileListObject();
  }
  createSummaryInfo("#" + viewId, "statistics_projectInfo", statisticObject);
}
function createSummaryInfo(parentSelector, infoId, statisticData) {
  createSection(parentSelector, infoId, "Generated Result");
  createStatisticsSumInfo("#" + infoId, infoId + "_infopanel", statisticData.sum);
  
  for (let i = 0; i < statisticObject.detail.length; i++) {
    const containerDetail = statisticObject.detail[i];
    createContainerInfo(
      "#" + infoId, 
      infoId + "_container" + i + "_" + containerDetail.name, 
      containerDetail
    );
  }
}
function createStatisticsSumInfo(parentSelector, panelId, summaryData) {
  const names = [];
  const values = [];
  
  for (const item of summaryData) {
    names.push(item.name);
    values.push(item.value);
  }
  
  createFormPanel(parentSelector, panelId, null, names, values, { width: "180px" });
}
function createContainerInfo(parentSelector, containerId, containerData) {
  const title = containerData.name + spaces(2) + "(" + containerData.number + space + "files)";
  createSection(parentSelector, containerId, title);
  createContainerInfoDetail("#" + containerId, containerId + "_detail", containerData.detail);
}
function createContainerInfoDetail(parentSelector, detailId, detailData) {
  const leftNames = [];
  const leftValues = [];
  const rightNames = [];
  const rightValues = [];
  
  let isLeft = true;
  for (const key in detailData) {
    if (isLeft) {
      leftNames.push(key);
      leftValues.push(detailData[key]);
    } else {
      rightNames.push(key);
      rightValues.push(detailData[key]);
    }
    isLeft = !isLeft;
  }
  
  // Balance columns if left has more items
  if (leftNames.length > rightNames.length) {
    rightNames.push("&nbsp;");
    rightValues.push("&nbsp;");
  }
  
  $(parentSelector).append(generateTag("div", { id: detailId }));
  
  createFormPanel(parentSelector, detailId, null, leftNames, leftValues, {
    style: [{ name: "float", value: "left" }],
  });
  
  createFormPanel(parentSelector, detailId + "_right", null, rightNames, rightValues, {
    table_style: [{ name: "padding-left", value: "100px" }],
  });
}
function ifIE() {
  return window.navigator.userAgent.indexOf("MSIE ") > 0 ||
         !!navigator.userAgent.match(/Trident.*rv\:11\./);
}
function clearContent(elementId) {
  const element = $("#" + elementId);
  element.empty();
  element.remove();
}

function start_the_fun() {
  const mainView = "mainView";
  const queryParams = getQueryString();
  
  const tabs = ["Summary", "File statistics", "File List", "Steps Detail"];
  const tabIds = [
    mainView + "_summaryTab",
    mainView + "_statisticsTab",
    mainView + "_FilesTab",
    mainView + "_detailTab"
  ];
  
  if (main_data.async_data !== "Async migration is not required when migrating the application to CAP") {
    tabs.push("Async Migration");
    tabIds.push(mainView + "_asyncMigratorTab");
  }
  
  if (main_data.cap_logs !== "CAP Migration is not required when migrating the application to XSA") {
    tabs.push("CAP Migration");
    tabIds.push(mainView + "_capMigratorTab");
  }
  
  const iconConfig = {
    icon: "migration/report/icons/sap.gif",
    icon_width: "100px",
    icon_height: "50px",
  };
  
  if (queryParams.view && queryParams.view !== "main") {
    if (queryParams.view === "detail") {
      createTitle("#content", "stepdetail_title", tool_name, iconConfig);
      initDetailView_standalone("#content", "stepdetail_body", main_data, {
        newtab: true,
        step: queryParams.step,
      });
    } else if (queryParams.view === "filelist") {
      createTitle("#content", "filelist_title", tool_name, iconConfig);
      initFileListView("#content", "filelist_body", { newtab: true });
    }
  } else {
    createTitle("#content", "mainview_title", tool_name, iconConfig);
    createTabs("#content", "mainview_tabs", tabs, tabIds);
    initSummaryView("#mainview_tabs", mainView + "_summaryTab");
    initStatisticsView("#mainview_tabs", mainView + "_statisticsTab");
    initFileListView("#mainview_tabs", mainView + "_FilesTab", { newtab: false });
    initDetailView("#mainview_tabs", mainView + "_detailTab", main_data, { newtab: false });
    
    if (main_data.async_data !== "Async migration is not required when migrating the application to CAP") {
      initAsyncMigratorView("#mainview_tabs", mainView + "_asyncMigratorTab");
    }
    
    if (main_data.cap_logs !== "CAP Migration is not required when migrating the application to XSA") {
      initCAPMigratorView("#mainview_tabs", mainView + "_capMigratorTab");
    }
  }
  
  if (ifIE()) {
    createDialog(
      "#content",
      "_IE_NotSupportDlg",
      {
        title: "Browser Not Fully Supported",
        width: 500,
        content:
          "We recomment to use another Web Browser. We still have some issues for showing all content correctly in IE. If you are checking only very generic information, it might not be a big issue. However if you would like to investigate issues, it is very unlikely to work with IE.",
      }
    );
  }
}
function getQueryString() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split("&");
  
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    const decodedValue = decodeURIComponent(value);
    const existingValue = params[key];
    
    if (existingValue === undefined) {
      params[key] = decodedValue;
    } else if (typeof existingValue === "string") {
      params[key] = [existingValue, decodedValue];
    } else if (Array.isArray(existingValue)) {
      existingValue.push(decodedValue);
    }
  }
  
  return params;
}
const space = "&nbsp;";
const CON_TEXT = {
  Migration_Desc:
    "The objects from the provided delivery units have been exported from the system, analyzed, migrated, and have been written into an XS Advanced folder structure if the Migration Path chosen is XSC->XSA and then into the CAP Folder structure if the Migration Path chosen is XSC->CAP. Follow the steps shown below in order to complete the migration.",
};
const Constant = { title_l: "h3", title_m: "h4", title_s: "h5" };
const filelist_view_columns = ["container", "file name"];
const fileFilter = { container: "all", extension: "all" };
const filterKey = (main_data.async_data !== "Async migration is not required when migrating the application to CAP") ? 'async_xsjs' : 'xsjs';
const filter_container = {
  all: true,
  [filterKey]: false,
  web: false,
  db: false,
  todo: false,
  delete: false,
};
let filterExt = [];
let list_area = null;
let statisticObject = null;
const Views = {
  main: "main",
  detail: "detail",
  list: "filelist",
  statistics: "statistics",
};
const tool_name  = "Migration Report For " + main_data.project.name;