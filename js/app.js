(function() {
  const { ajax_url, plugin_slug } = wp_data
  const loading = document.getElementById('loading')
  const searchForm = document.getElementById(`${plugin_slug}-form`)
  const searchFormElements = Array.prototype.slice.call(searchForm.elements);
  const searchFormButton = document.querySelector(`${plugin_slug}-form button[type="submit"]`)
  const resultsStats = document.getElementById(`${plugin_slug}-results-stats`)
  const resultsStatsContainer = document.getElementById(`${plugin_slug}-results-stats-container`)
  const resultsList = document.getElementById(`${plugin_slug}-results`)
  const resetButton = document.getElementById(`${plugin_slug}-reset`)
  const animationDuraton = 260

  let totalResults = 0

  let params = {
    action: 'snoway_pdf_search',
    // postsPerPage: 100,
    // paged: 1,
    debug: true // for devs
  }

  const setLoading = bool => {
    bool ?
      loading.classList.add('loading-shown') :
      loading.classList.remove('loading-shown')

    for (var i = 0, len = searchFormElements.length; i < len; ++i) {
      searchFormElements[i].disabled = bool
    }
  }

  const reset = () => {
    searchForm.reset()
    resultsStats.innerText = ''
    resultsList.innerHTML = ''
  }

  const renderResultHTML = obj => {
    resultsList.innerHTML += `<li class="result-item">
      <div><a href="${obj.pdf}" target="_blank">View PDF</a></div>
      <div>${obj.title}</div>
      <div>${obj.type}</div>
      <div>${obj.description}</div>
    <li>`
  }

  const renderResults = json => {
    const { data, debug } = json
    console.log(data)
    resultsList.innerHTML = ''
    if (data.length > 0) {
      resultsStats.innerText = `${data.length} results found.`
      data.forEach(obj => renderResultHTML(obj))
    } else {
      resultsStats.innerText = 'No results'
    }
    if (debug) {
      console.info('Debug Info', debug)
    }
    setLoading(false)
  }

  const searchManuals = async form_data => {
    try {
      const response = await fetch(ajax_url, {
        method: 'POST',
        body: form_data
      })
      var res = await response.text()
      console.log(res)
      return
      const json = await response.json()
      renderResults(json)
    } catch (err) {
      setLoading(false)
      alert(`😵 ${err}`)
      throw new Error(err)
    }
  }

  const formSubmit = e => {
    e.preventDefault()
    setLoading(true)
    let form_data = new FormData(searchForm)
    for (key in params) {
      form_data.append(key, params[key])
    }
    searchFormElements
      .forEach(el => form_data.append(el.name, el.value))
    searchManuals(form_data)
  }


    /*
     * Retrieves the text of a specif page within a PDF Document obtained through pdf.js
     *
     * @param {Integer} pageNum Specifies the number of the page
     * @param {PDFDocument} PDFDocumentInstance The PDF document obtained
     **/
    // function getPageText(pageNum, PDFDocumentInstance) {
    //     // Return a Promise that is solved once the text of the page is retrieven
    //     return new Promise(function (resolve, reject) {
    //         PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
    //             // The main trick to obtain the text of the PDF page, use the getTextContent method
    //             pdfPage.getTextContent().then(function (textContent) {
    //                 var textItems = textContent.items;
    //                 var finalString = "";
    //
    //                 // Concatenate the string of the item to the final string
    //                 for (var i = 0; i < textItems.length; i++) {
    //                     var item = textItems[i];
    //
    //                     finalString += item.str + " ";
    //                 }
    //
    //                 // Solve promise with the text retrieven from the page
    //                 resolve(finalString);
    //             });
    //         });
    //     });
    // }

    /**
     * Extract the text from the PDF
     */
    //  pdfjsLib.getDocument(PDF_URL).then(function (PDFDocumentInstance) {
    //   var pdfDocument = PDFDocumentInstance;
    //   // Create an array that will contain our promises
    //   var pagesPromises = [];
    //   for (var i = 0; i < pdfDocument._pdfInfo.numPages; i++) {
    //     // Required to prevent that i is always the total of pages
    //     (function (pageNumber) {
    //       // Store the promise of getPageText that returns the text of a page
    //       pagesPromises.push(getPageText(pageNumber, pdfDocument));
    //     })(i + 1);
    //   }
    //   // Execute all the promises
    //   Promise.all(pagesPromises).then(function (pagesText) {
    //     // Display text of all the pages in the console
    //     // e.g ["Text content page 1", "Text content page 2", "Text content page 3" ... ]
    //     console.log(pagesText);
    //   });
    // }, function (reason) {
    //   // PDF loading error
    //   console.error(reason);
    // });

  searchForm.addEventListener('submit', formSubmit)
  resetButton.addEventListener('click', reset)

})()
