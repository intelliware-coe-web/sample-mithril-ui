const WikipediaService = (function () {
  const fullTextSearch = find();
  fullTextSearch.next();

  return {
    search: _.curry(search)(fullTextSearch)
  };

  // Modify the implementation of this function to utilize generators to provide the next set of results
  async function search(finder, topic) {
    const next = await finder.next(topic);
    return next.value;
  }

  async function* find() {
    const current = { topic: '' };
    const previous = { topic: '' };
    while(true) {
      current.topic = yield current.results;

      if (current.topic) {
        if (current.topic !== previous.topic) {
          delete previous.offset;
        }

        const searchParams = getSearchParams(current.topic, previous.offset).toString();
        const response = await fetch(`https://en.wikipedia.org/w/api.php?${searchParams}`);
        const results = await response.json();
        current.results = adaptSearchResults(results);

        previous.offset = results.continue;
        previous.topic = current.topic;
      }
    }
  }

  function adaptSearchResults(searchResult) {
    const summary = getSummary(searchResult);
    const articles = Object.values(searchResult.query.pages)
      .map(({title, extract, fullurl, thumbnail = {}}) => ({title, thumbnail, description: extract, href: fullurl}));
    return { summary, articles };
  }

  function getSummary(searchResult) {
    const page = searchResult.continue ? searchResult.continue.sroffset : searchResult.query.searchinfo.totalhits;
    const total = searchResult.query.searchinfo.totalhits;
    return `${page} of ${total}`
  }

  function getSearchParams(topic, offset) {
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
    if (offset) {
      searchParams.append('sroffset', offset.sroffset);
      searchParams.append('gsroffset', offset.gsroffset);
    }
    return searchParams;
  }
}());