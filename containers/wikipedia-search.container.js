const WikipediaSearch = (articleService) => {
  let store = {
    busy: false,
    articles: [],
    error: {},
    search: ''
  };

  const debouncedSearch = _.debounce(500)(function (search) {
    articleService.search(search)
      .then(results => store = {...store, ...results, busy: false})
      .finally(m.redraw)
      .catch(() => store = {...initializeStore(store.search), error: { title: 'Error', message: 'Please try again'}});
  });

  return {
    view: () =>
      m('div', {class: 'uk-padding'}, [
        m(SearchComponent, {onsearch}),
        m(ErrorMessage, store.error),
        m(Spinner, store),
        m(ArticleList, store),
        m(LoadMore, {
          ...store,
          onclick: () => onsearch(store.search)
        })
      ])
  };

  function onsearch(search) {
    store = initializeStore(search);
    debouncedSearch(search);
  }

  function initializeStore(search) {
    return {
      busy: true,
      error: {},
      articles: [],
      search: search,
    }
  }
};
