(function() {
  const { ajax_url, plugin_slug } = wp_data
  const loading = document.getElementById('loading')
  const searchForm = document.getElementById(`${plugin_slug}-form`)
  const searchFormElements = Array.prototype.slice.call(searchForm.elements);
  const resultsStats = document.getElementById(`${plugin_slug}-results-stats`)
  const resultsList = document.getElementById(`${plugin_slug}-results`)
  const resetButton = document.getElementById(`${plugin_slug}-reset`)

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
      <div>${obj.type}</div>
      <div>${obj.description}</div>
    <li>`
  }

  const renderResults = json => {
    const { data, options, debug } = json
    console.log(data, options)
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

  searchForm.addEventListener('submit', formSubmit)
  resetButton.addEventListener('click', reset)

})()
