const ArticleList = {
  view: (vnode) => vnode.attrs.articles.map(article =>
    m('div', {class: 'uk-card uk-card-default uk-margin uk-width-1-1@m'}, [
      m('div', {class: 'uk-card-header'},
        m('div', {class: 'uk-width-expand'},
          m('h3', {class: 'uk-card-title'},
            m('a', {href: article.href}, article.title)))
      ),
      m('div', {class: 'uk-card-body uk-text-justify'},
        m('p', article.description))
    ])
  )
};