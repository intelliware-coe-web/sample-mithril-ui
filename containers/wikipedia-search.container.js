const WikipediaSearch = (articleService) => {
  let store = {
    busy: false,
    articles: []
  };

  const debouncedSearch = _.debounce(500)(async function(search) {
    const results = await articleService.search(search);
    store = { ...store, ...results, busy: false };
    m.redraw();
  });

  return {
    view: () =>
      m('div', {class: 'uk-padding'}, [
        m(SearchComponent, { onsearch }),
        store.busy ? m(Spinner, store) : undefined,
        store.articles.length ? m(ArticleList, store) : undefined,
        store.articles.length ? m(LoadMore, {
          ...store,
          onclick: onsearch.bind(null, store.search)
        }) : undefined
    ])
  };

  function onsearch(search) {
    startSearch(search);
    debouncedSearch(search);
  }

  function startSearch(search) {
    store.busy = true;
    store.articles = [];
    store.search = search;
  }
};
