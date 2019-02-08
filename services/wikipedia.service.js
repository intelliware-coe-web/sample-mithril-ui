const WikipediaService = (function () {
  const fullTextSearch = find();
  fullTextSearch.next();

  return {
    search: _.curry(search)(fullTextSearch)
  };

  // Modify the implementation of this function to utilize generators to provide the next set of results
  function search(finder, topic) {
    return finder.next(topic).value;
  }

  function* find() {
    const current = { topic: '' };
    const previous = { topic: '' };
    while(true) {
      current.topic = yield current.request;

      if (current.topic) {
        if (current.topic !== previous.topic) {
          delete previous.offset;
        }

        const searchParams = getSearchParams(current.topic, previous.offset).toString();
        current.request = fetch(`https://en.wikipedia.org/w/api.php?${searchParams}`)
            .then(toJson)
            .then(_.curry(sideEffect)(setOffset))
            .then(adaptSearchResults);

        previous.topic = current.topic;
      }
    }

    function setOffset(response) {
      previous.offset = response.continue;
    }
  }

  function sideEffect(effect, value) {
    effect(value);
    return value;
  }

  function toJson(response) {
    return response.json();
  }

  function adaptSearchResults(searchResult) {
    const summary = getSummary(searchResult);
    const articles = searchResult.query.search
      .map(({pageid}) => searchResult.query.pages[pageid])
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