(function() {
  const loading = document.getElementById('loading')
  const searchForm = document.getElementById('snoway-pdf-search-form')
  const resultsStatsContainer = document.getElementById('results-stats-container')
  const resultsStats = document.getElementById('results-stats')
  const resultsList = document.getElementById('snoway-pdf-search-results-grid')
  const pageCount = document.getElementById('page-count')
  const resetButton = document.getElementById('reset-au-search-results')
  const animationDuraton = 260

  let totalResults = 0

  let params = {
    action: 'snoway_pdf_search',
    postsPerPage: 12,
    paged: 1,
    debug: false // for devs
  }

  const showLoading = () => {
    loading.classList.add('loading-shown')
  }

  const hideLoading = () => {
    loading.classList.remove('loading-shown')
  }

  // const reset = () => {
  //   totalResults = 0
  //   params.paged = 1
  //   params.catName = ''
  //   params.cat = false
  //   resultsList.innerHTML = initialCats
  //
  // }

  const searchManuals = async form_data => {
    try {
      const response = await fetch(wp_data.ajax_url, {
        method: 'POST',
        body: form_data
      })
      const json = await response.json()
      console.log(json)
      // renderResults(json)
      hideLoading()
    } catch (err) {
      hideLoading()
      alert(`😵 ${err}`)
      throw new Error(err)
    }
  }

  const formSubmit = e => {
    e.preventDefault()
    showLoading()
    let form_data = new FormData(searchForm)
    for (key in params) {
      form_data.append(key, params[key])
    }
    searchManuals(form_data)
  }

  searchForm.addEventListener('submit', formSubmit)

})()
