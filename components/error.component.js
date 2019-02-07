const ErrorMessage = {
  view: ({attrs}) =>
    attrs.title ?
      m('div', {'uk-alert': 1},[
        m('a', {class: 'uk-alert-close', 'uk-close': 1}),
        m('h3', attrs.title),
        m('p', attrs.message)
      ]) :
      undefined
};