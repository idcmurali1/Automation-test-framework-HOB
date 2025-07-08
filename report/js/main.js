

function createErrorDetails() {

    $('#app').html(DATA.app);
    $('#timestamp').html(DATA.timestamp);
    let errorstring = '';
    DATA.errors.forEach(error => {
        let index = "TraceList_"+error.traceID;
 
        let mappingInput = error.isMapped ? `<div class="check-box">
            <label class="check-box-label" data-toggle="tooltip" data-placement="top" title="Click to toggle between identifiers and mappings">Mapping Names</label>
            <input type="checkbox" id=${index} onchange="updateToggleValue(this);">
           </div>` : ``

            errorstring += `
                           <hr />
                           <p class="error">${error.name}</p>`
                           +getSessionID(error)+
                          `<p ><strong>File Name: </strong>${error.filename}</p>
                           <div class="details">
                               <img class="image" src="./images/${error.image}" alt="screenshot" />
                               <div class="error-container">
                               ${mappingInput}
                               <div>
                               `;

        error.trace.forEach(err => {

            for (let key in err) {
                if (key === 'id') {

                    errorstring += `
                    <p class= ${index}_idName><strong>${err['id']}: </strong>${err['idName'] ? err['idName'] : "N/A"}</p>
                    <p class=${index}_idMap style="display:none"><strong>${err['id']}: </strong>${err['mapName'] ? err['mapName'] : "N/A"}</p>
                    `;
                }
            }
        });

        errorstring += `
            </div>
            </div>
           </div>`;
    });
    $('#errors').html(errorstring);
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    })
}


function updateToggleValue(checkBox) {
    if (checkBox.checked) {
        Array.from(document.getElementsByClassName(checkBox.id+"_idName")).forEach(item => {
          item.style.display="none";
        })
        Array.from(document.getElementsByClassName(checkBox.id+"_idMap")).forEach((item) => {
          item.style.display="block";
        })
    
    } 
   else {
        Array.from(document.getElementsByClassName(checkBox.id+"_idName")).forEach(item => {
          item.style.display="block";
        })
        Array.from(document.getElementsByClassName(checkBox.id+"_idMap")).forEach(item => {
          item.style.display="none";
        })
      }
}

function getTestURL(error) {
    let testUrl =  "";
        if(error.testType === "sauce"){
            testUrl = "https://app.saucelabs.com/tests/" + error.session
        } else if (error.testType === "plexus"){
        if(error.plexusToken != ""){
            testUrl = "http://ui-stg.plexus.walmart.com/testActivityPage/"+error.session+ "/"+ error.plexusToken
        } else {
            testUrl = "http://ui-stg.plexus.walmart.com/testActivityPage/"+error.session
        }
        }
    return testUrl;
}

function getSessionID(error) {
    let testUrl = getTestURL(error);
    let sessionID =  error.testType === "local" ? `<p class="session"><strong>Session ID: </strong>${error.session}</p>`
    : `<p class="session"><strong>Session ID: </strong><a href=${testUrl}>${error.session}</a></p>`
    return sessionID;
  }