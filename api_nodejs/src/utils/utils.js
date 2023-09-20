exports.getPathImgUpload = (path) => {
  const newPath = path.replace('\\', '/');
  return newPath.replace('public/', 'http://localhost:3000/');
};
