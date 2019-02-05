const WikipediaSearch = (articleService) => {
  const state = {
    busy: false,
    articles: []
  };

  return {
    oninit: () => {
      const debouncedSearch = _.debounce(1000)(onSearch);
      this.onsearch = query => {
        state.busy = true;
        debouncedSearch(query);
      };
    },
    view: () => m('div', [
      m(SearchComponent, {onsearch: this.onsearch}),
      state.busy ? m(Spinner) : m('div'),
      m(ArticleList, {articles: state.articles})
    ])
  };

  function onSearch(search) {
    return articleService.search(search)
      .then(setArticles)
      // hack because we're using fetch instead of m.request
      .finally(m.redraw);
  }

  function setArticles(articles) {
    state.busy = false;
    state.articles = articles;
  }
};
