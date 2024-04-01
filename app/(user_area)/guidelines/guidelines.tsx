import React from "react";

const Guidelines = () => {

    return(
        <div className="guidelines_container">
            <h1 id="sample-markdown">Sample Markdown</h1>
            <p>This is some basic, sample markdown.</p>
            <h2 id="second-heading">Second Heading</h2>
            <ul>
            <li>Unordered lists, and:<ol>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
            </ol>
            </li>
            <li>More</li>
            </ul>
            <blockquote>
            <p>Blockquote</p>
            </blockquote>
            <p>And <strong>bold</strong>, <em>italics</em>, and even <em>italics and later <strong>bold</strong></em>. Even <del>strikethrough</del>. <a href="https://markdowntohtml.com">A link</a> to somewhere.</p>
            <p>And code highlighting:</p>
            <pre><code className="lang-js"><span className="hljs-keyword">var</span> foo = <span className="hljs-string">'bar'</span>;

            <span className="hljs-function"><span className="hljs-keyword">function</span> <span className="hljs-title">baz</span><span className="hljs-params">(s)</span> </span>
            </code></pre>
            <p>Or inline code like <code>var foo = &#39;bar&#39;;</code>.</p>
            <p>Or an image of bears</p>
            <p>The end ...</p>
        </div>
    )
}

export default Guidelines