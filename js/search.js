(function() {
  const { ajax_url, plugin_slug } = wp_data
  const loading = document.getElementById('loading')
  const searchForm = document.getElementById(`${plugin_slug}-form`)
  const searchFormElements = Array.prototype.slice.call(searchForm.elements);
  const resultsStats = document.getElementById(`${plugin_slug}-results-stats`)
  const resultsList = document.getElementById(`${plugin_slug}-results`)
  const resetButton = document.getElementById(`${plugin_slug}-reset`)

  let newOptions = {
    'product_type': [],
    'product_series': [],
    'manual_type': []
  }

  let params = {
    action: 'snoway_pdf_search',
    debug: true // for devs
    // paged: 1,
    // postsPerPage: 100,
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
      <div>${obj.product_type.join(', ')}<br/>${obj.product_series.join(', ')}<br/>${obj.manual_type.join(', ')}</div>
      <div>${obj.description}</div>
    <li>`
  }

  const renderResults = json => {
    const { data, debug, options } = json
    resultsList.innerHTML = ''
    if (data.length > 0) {
      // render each item
      data.forEach(obj => {
        renderResultHTML(obj)
      })
      resultsStats.innerText = `${data.length} results found.`
      updateOptions(options)
    } else {
      resultsStats.innerText = 'No results'
    }
    if (debug) {
      console.info('Debug Info', debug)
    }
    setLoading(false)
  }

  const updateOptions = options => {
    console.log('New Options:', options)
  }

  const searchManuals = async form_data => {
    try {
      const response = await fetch(ajax_url, {
        method: 'POST',
        body: form_data
      })
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

  const init = () => {
    searchForm.addEventListener('submit', formSubmit)
    resetButton.addEventListener('click', reset)
    // searchFormElements.forEach(el => {
    //   if (el.tagName === 'SELECT') {
    //     originalOptions[el.name] = el.children
    //   }
    // })
  }

  init()

})()
