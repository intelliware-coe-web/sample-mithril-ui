const SearchComponent = {
  view: (vnode) => m('search',
    m('form', {class: 'uk-search uk-search-large uk-width-1-1'}, [
      m('span', {'uk-search-icon': true}),
      m('input', {
        class: 'uk-search-input',
        type: 'search',
        placeholder: 'Search...',
        oninput: m.withAttr('value', vnode.attrs.onsearch)
      })
    ])
  )
};
