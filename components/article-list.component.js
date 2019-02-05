const ArticleList = {
  view: (vnode) => m('dl', {class: 'uk-description-list uk-description-list-divider'},
    vnode.attrs.articles.reduce(
      (list, article) =>
        list.concat(m('dt', m('a', {href: article.href, title: article.title}, article.title)))
          .concat(m('dd', article.description)),
      [])
  )
};