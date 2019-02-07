const WikipediaService = (function () {
  return {
    search
  };

  // Modify the implementation of this function to utilize generators to provide the next set of results
  function search(topic) {
    return fetch(`https://en.wikipedia.org/w/api.php?${getSearchParams(topic).toString()}`)
      .then(toJson)
      .then(adaptSearchResults);
  }

  function toJson(response) {
    return response.json();
  }

  function adaptSearchResults(searchResult) {
    const summary = `${searchResult.continue.sroffset || searchResult.query.searchinfo.totalhits} of ${searchResult.query.searchinfo.totalhits}`;
    const articles = searchResult.query.search
      .map(({pageid}) => searchResult.query.pages[pageid])
      .map(({title, extract, fullurl, thumbnail = {}}) => ({title, thumbnail, description: extract, href: fullurl}));
    return { summary, articles };
  }

  function getSearchParams(topic) {
    const searchParams = new URLSearchParams();
    searchParams.append('action', 'query');
    searchParams.append('generator', 'search');
    searchParams.append('gsrsearch', topic);
    searchParams.append('gsrlimit', '3');
    searchParams.append('srsearch', topic);
    searchParams.append('srlimit', '3');
    searchParams.append('prop', 'info|extracts|pageimages');
    searchParams.append('inprop', 'url');
    searchParams.append('list', 'search');
    searchParams.append('iwurl', 'true');
    searchParams.append('explaintext', '1');
    searchParams.append('exintro', '1');
    searchParams.append('redirects', '1');
    searchParams.append('format', 'json');
    searchParams.append('origin', '*');
    return searchParams;
  }
}());