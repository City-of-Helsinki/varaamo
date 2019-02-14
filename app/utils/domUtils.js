function scrollTo(domElement) {
  if (!domElement) {
    return;
  }
  const bodyOffsetTop = document.body.getBoundingClientRect().top;
  const slotOffsetTop = domElement.getBoundingClientRect().top;
  const scrollToX = 0;
  const scrollToY = slotOffsetTop - bodyOffsetTop;
  window.scrollTo(scrollToX, scrollToY);
}

export {
  scrollTo
};
