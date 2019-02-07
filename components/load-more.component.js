const LoadMore = {
  view: ({attrs}) =>
    attrs.summary ?
      m('div', {class: 'uk-text-center'},
        m('button', {class: `uk-button uk-button-primary`, onclick: attrs.onclick}, `Load more (${attrs.summary})`)) :
      undefined
};