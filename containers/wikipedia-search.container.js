const WikipediaSearch = (articleService) => {
  const store = {
    busy: false,
    articles: [],
    summary: '',
    error: {},
    search: ''
  };

  const searchHandler = _.flow(startSearch, _.debounce(500)(doSearch));

  return {
    view: () =>
      m('div', {class: 'uk-padding'}, [
        m(SearchComponent, {onsearch: searchHandler}),
        m(ErrorMessage, store.error),
        m(Spinner, store),
        m(ArticleList, store),
        m(LoadMore, {...store, onclick: () => searchHandler(store.search)})
      ])
  };

  function startSearch(search) {
    store.articles = search === store.search ? store.articles : [];
    store.search = search;
    store.busy = true;
    store.error = {};
    store.summary = '';
    return search;
  }

  function doSearch(search) {
    return articleService.search(search)
      .then(({articles, summary}) => {
        store.articles = store.articles.concat(articles);
        store.summary = summary;
      })
      .catch(() => store.error = {title: 'Error', message: 'Please try again'})
      .finally(() => {
        store.busy = false;
        m.redraw();
      });
  }
};
