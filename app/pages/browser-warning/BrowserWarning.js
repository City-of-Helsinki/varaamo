import React from 'react';

function BrowserWarning() {
  return (
    <div>
      <p className="alert alert-warning">
        Currently, Varaamo does not support IE11.
        We are investigating this issue and finding a solution.
        Meanwhile, use another browser (such as
        <a href="https://www.google.com/chrome/"> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a>
        or
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>
        ).
      </p>
      <p className="alert alert-warning">
        Varaamo ei tue IE11 selainta tällä hetkellä.
        Selvitämme ongelmaa sen ratkaisemiseksi.
        Sillä välin, käytä toista selainta (kuten
        <a href="https://www.google.com/chrome/"> Chrome</a>
        ,
        <a href="https://www.mozilla.org/en-US/firefox/new/"> Firefox </a>
        tai
        <a href="https://www.microsoft.com/en-us/windows/microsoft-edge"> Edge</a>
        ).
      </p>
    </div>
  );
}

export default BrowserWarning;
