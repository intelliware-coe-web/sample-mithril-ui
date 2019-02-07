const Spinner = {
  view: ({attrs}) =>
    attrs.busy ?
      m('div', {class: 'uk-text-center'},
        m('span', {'uk-spinner': 'ratio: 4.5'})) :
      undefined
};
