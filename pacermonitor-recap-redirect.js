// ==UserScript==
// @name         Replace PacerMonitor with CourtListener RECAP
// @namespace    https://github.com/
// @version      1.1
// @description  Rewrites PacerMonitor Google results directly into CourtListener RECAP search queries
// @match        https://www.google.com/search*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function replaceLinks() {
        const links = document.querySelectorAll('a[href*="pacermonitor.com/public/case/"]');
        links.forEach(link => {
            const match = link.href.match(/pacermonitor\.com\/public\/case\/\d+\/([^/?#]+)/);
            if (match && match[1]) {
                // Strip trailing "_et_al" and clean underscores into spaces
                const cleanTitle = decodeURIComponent(match[1])
                    .replace(/_et_al$/i, '')
                    .replace(/_/g, ' ');

                // type=r specifically targets PACER / RECAP dockets
                link.href = `https://www.courtlistener.com/?type=r&q=${encodeURIComponent(cleanTitle)}`;
                
                if (!link.dataset.recapModified) {
                    const badge = document.createElement('span');
                    badge.textContent = ' [→ RECAP Search]';
                    badge.style.color = '#2e7d32';
                    badge.style.fontWeight = 'bold';
                    badge.style.fontSize = '0.85em';
                    link.appendChild(badge);
                    link.dataset.recapModified = "true";
                }
            }
        });
    }

    replaceLinks();
    const observer = new MutationObserver(replaceLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
