const productsMapper = product => {
  const {
    description,
    alt_description,
    urls: {
      thumb: imgThumb,
      regular: img,
    },
    links: {
      download: link
    },
    user: {
      id: userId,
      name: userName,
      links: {
        html: userLink,
      }
    },
    tags
  } = product;

  return {
    description: description || alt_description,
    imgThumb,
    img,
    link,
    userId,
    userName,
    userLink,
    tags
  };
}

module.exports = {
  productsMapper
};
