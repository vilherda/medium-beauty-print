(function preparePage() {
    // Helper function to find an element with an XPath expression and
    // execute an anonymous function passing it the selected element
    const findAndExec = (xpathExpr, execFunc) => {
      const elementList = document.evaluate(xpathExpr, document);
      if (elementList != null) {
        const element = elementList.iterateNext();
        if (element != null) {
          execFunc(element);
        }
      }
    };
  
    // Copy the main header with the title into the clipboard
    findAndExec(
      '/html/body/div/div/div/div/div/main/div/div/div/div/article/div/div/section/div/div/div/h1',
      async (element) =>
        await navigator.clipboard
          .writeText(element.innerHTML)
          .catch((reason) =>
            console.warn(`Cannot copy title into clipboard: ${reason}`)
          )
    );
  
    // Click in the use warning message button
    findAndExec(
        '/html/body/div/div/div/div/div/div/button',
        (useWarningButton) => useWarningButton.click()
    );
  
    // Click in the external account message button
    findAndExec(
      '/html/body/div/div/div/div/div/main/div/div/div/div/div/div/button',
      (externalAccountButton) => externalAccountButton.click()
    );
  
    // Making invisible the target elements
    const targetElments = [
      '/html/body/div/div/div/div/div/main/../div',
      '/html/body/div/div/div/div/div/main/div/div/div/div/article/../../../../div[last()]',
      '/html/body/div/div/div/div/div/main/div/div/div/div/article/../../../*[position()>1]'
    ]
    targetElments.forEach((xpath) => findAndExec(xpath, (element) => element.classList.add("invisible")));
  
    // scroll down to ensure all possible lazy-dynamic sections are loaded and finally print the article
    let currentScroll = 0;
    const scrollMargin = window.innerHeight;
    const maxScroll = document.body.scrollHeight + scrollMargin;
    const scrollDownAndWait = () => {
      setTimeout(() => {
        window.scrollBy(0, scrollMargin);
        currentScroll += scrollMargin;
        if (currentScroll < maxScroll) {
          scrollDownAndWait();
        } else {
          // print the article
          window.print();
        }
      }, 500);
    };
    scrollDownAndWait();
})();