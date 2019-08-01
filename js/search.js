(function() {
  const { ajax_url, plugin_slug } = wp_data
  const loading = document.getElementById('loading')
  const searchForm = document.getElementById(`${plugin_slug}-form`)
  const searchFormElements = Array.prototype.slice.call(searchForm.elements)
  const searchPDFTextInput = document.getElementById('search_text_wrap')
  const resultsStats = document.getElementById(`${plugin_slug}-results-stats`)
  const resultsList = document.getElementById(`${plugin_slug}-results`)
  const resetButton = document.getElementById(`${plugin_slug}-reset`)
  
  let params = {
    action: 'snoway_pdf_search',
    debug: true // for devs
  }

  let lastSelectUsed = null

  function debounce(func, wait, immediate) {
  	var timeout
  	return function() {
  		var context = this, args = arguments
  		var later = function() {
  			timeout = null
  			if (!immediate) func.apply(context, args)
  		}
  		var callNow = immediate && !timeout
  		clearTimeout(timeout)
  		timeout = setTimeout(later, wait)
  		if (callNow) func.apply(context, args)
  	}
  }

  const setLoading = bool => {
    bool ?
      loading.classList.add('loading-shown') :
      loading.classList.remove('loading-shown')

    for (var i = 0, len = searchFormElements.length; i < len; ++i) {
      searchFormElements[i].disabled = bool
    }
  }

  const resetOptions = () => ['product_type', 'product_series', 'manual_type'].forEach(label => 
    Array.prototype.slice
      .call(searchForm.elements[label].children)
      .forEach(el => {
        el.disabled = false
        el.style.display = 'block'
      })
  )

  const reset = () => {
    resetOptions()
    searchForm.reset()
    searchPDFTextInput.style.display = ''
    resultsStats.innerText = ''
    resultsList.innerHTML = ''
  }

  const renderResultHTML = obj => {
    const fileName = obj.pdf ? obj.pdf.split('/').reverse()[0] : ''
    resultsList.innerHTML += `<li class="result-item">
      <div><a href="${obj.pdf}" target="_blank">${fileName}</a></div>
      <div>${obj.title}</div>
      <div>${obj.manual_type.join(', ')}<br/> ${obj.product_type.join(', ')}</div>
      <div>${obj.description}</div>
    <li>`
  }

  const renderResults = json => {
    const { data, debug, options } = json
    resultsList.innerHTML = ''
    if (data.length > 0) {
      // table header
      resultsList.innerHTML += `<li class="result-item header">
        <div>Manual</div>
        <div>Title</div>
        <div>Type</div>
        <div>Description</div>
      <li>`
      // render each item
      data.forEach(obj => {
        renderResultHTML(obj)
      })
      resultsStats.innerText = `${data.length} results found.`
      searchPDFTextInput.style.display = 'block'
      console.log(searchPDFTextInput)
      updateOptions(options)
    } else {
      resultsStats.innerText = 'No results'
    }
    if (debug) {
      console.info('Debug Info', debug)
    }
    setLoading(false)
  }

  const updateOptions = newOptions => {
    const currentOptions = {
      product_type: Array.prototype.slice.call(searchForm.elements['product_type'].children),
      product_series: Array.prototype.slice.call(searchForm.elements['product_series'].children),
      manual_type: Array.prototype.slice.call(searchForm.elements['manual_type'].children)
    }
    for (key in currentOptions) {
      if (key === lastSelectUsed) 
        continue // skip this one so it has all options for re-picking
      currentOptions[key].forEach(el => {
        if (!newOptions[key].includes(el.dataset.label) && el.dataset.label !== undefined) {
          el.disabled = true
          el.style.display = 'none'
        }
      })
    }    
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

  function formSubmit(e) {
    e.preventDefault()
    setLoading(true)
    if (this.tagName === 'SELECT') {
      lastSelectUsed = this.id
    } else {
      lastSelectUsed = null
    }
    let form_data = new FormData(searchForm)
    for (key in params) {
      form_data.append(key, params[key])
    }
    searchFormElements.forEach(el => form_data.append(el.name, el.value))
    searchManuals(form_data)
  }

  const init = () => {
    searchForm.addEventListener('submit', formSubmit)
    resetButton.addEventListener('click', reset)
    searchFormElements.forEach(el => {
      if (el.tagName === 'INPUT') {
        el.addEventListener('keyup', debounce(function(e) {
          formSubmit(e)
        }, 500))
      } else {
        el.addEventListener('change', formSubmit)
      }    
    })
  }

  init()

})()
