const WikipediaService = (function () {
  return { search };

  function search(topic) {
    return fetch(`http://en.wikipedia.org/w/api.php?action=opensearch&search=${topic}&origin=*`)
      .then(response => response.json())
      .then(adaptResult);
  }

  function adaptResult([, titles, descriptions, links]) {
    return titles.map((title, index) => ({title, description: descriptions[index], href: links[index]}));
  }
}());