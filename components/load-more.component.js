const LoadMore = {
  view: (vnode) =>
    m('div', {class: 'uk-text-center'},
      m('button', {class: `uk-button uk-button-primary`, onclick: vnode.attrs.onclick}, `Load more (${vnode.attrs.summary})`)
)};