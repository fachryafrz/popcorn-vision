export const handleOpenWindow = async (url, target = "_blank") => {
  const width =
    screen.availWidth < 1024 ? 600 : screen.availWidth < 1280 ? 1024 : 1200;
  const height = screen.availHeight < 600 ? screen.availHeight : 600;
  const left = (screen.availWidth - width) / 2;
  const top = (screen.availHeight - height) / 2;

  const windowFeatures = `left=${left},top=${top},width=${width},height=${height},noreferrer,noopener`;

  window.open(url, target, windowFeatures);
};