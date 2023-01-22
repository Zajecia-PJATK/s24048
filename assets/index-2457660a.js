(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const v=(i,t,e,n)=>i.substring(0,t)+n+i.substring(e);class f extends HTMLElement{static TAB="	";child;constructor(){super();const[t]=this.getElementsByTagName("textarea");if(!t)throw new Error("Pass textarea within label to <reactive-textarea>!");if(this.child=t,this.setupImport(),this.setupExport(),this.setupTab(),this.setupEmptyEndLine(),!this.hasAttribute("save"))return;const e=this.getAttribute("save");this.child.value=sessionStorage.getItem(e)??"",queueMicrotask(()=>this.child.dispatchEvent(new InputEvent("input"))),this.child.addEventListener("input",()=>sessionStorage.setItem(e,this.child.value))}setupImport(){const t=this.querySelector("#import");t&&t.addEventListener("change",async()=>{const[e]=t.files;this.child.value=await e.text(),this.child.dispatchEvent(new InputEvent("input"))})}setupExport(){const t=this.querySelector("#export");t&&t.addEventListener("click",async()=>{try{const n=await(await window.showSaveFilePicker({suggestedName:"Untitled."+window.conversion.textContent.split(" ")[2].toLowerCase(),types:[{description:"Source code",accept:{"text/plain":[".md",".html"]}}]})).createWritable();await n.write(this.child.value),await n.close()}catch{}})}setupTab(){this.child.addEventListener("keydown",t=>{if(t.key!=="Tab")return;t.preventDefault();const e=this.child.value,n=this.child.selectionStart;if(t.shiftKey){const r=e.substring(0,n),s=e.substring(n),o=r.indexOf(`
`),c=s.lastIndexOf(`
`),d=o===-1?0:o,a=c===-1?e.length:c,u=e.substring(d,a+1).indexOf("	");if(u===-1)return;const l=u+d;this.child.value=v(e,l,l+1,""),this.child.selectionStart=n+Number(l>=0)*(l>=n?0:-1)}else this.child.value=e.substring(0,n)+f.TAB+e.substring(n),this.child.selectionStart=n+1;this.child.selectionEnd=this.child.selectionStart})}setupEmptyEndLine(){this.child.addEventListener("input",()=>{const{value:t}=this.child;if(t.endsWith(`
`))return;const e=this.child.selectionStart;this.child.value=t+`
`,this.child.selectionEnd=this.child.selectionStart=e,this.child.dispatchEvent(new InputEvent("input"))})}}class ${static mappers={H1:this.prefixMapper("#"),H2:this.prefixMapper("##"),H3:this.prefixMapper("###"),H4:this.prefixMapper("####"),H5:this.prefixMapper("#####"),H6:this.prefixMapper("######"),P:t=>t.textContent??"","#text":t=>this.removeLineBreaks(t.textContent??""),BR:()=>"",STRONG:this.surroundMapper("**"),DEL:this.surroundMapper("~~"),EM:this.surroundMapper("*"),BLOCKQUOTE:this.multilinePrefixMapper(">"),LI:t=>t.textContent??"",CODE:this.surroundMapper("`"),PRE:this.multilineCodeMapper(),HR:()=>"---",A:this.linkMapper(),IMG:this.imageMapper(),OL:this.listMapper(),UL:this.listMapper(!1),TABLE:this.tableMapper()};static html2md(t){const e=[];for(const n of t.childNodes){const r=this.mapChildNodeToMarkdown(n);e.push(r)}return e.join(`
`)}static mapChildNodeToMarkdown(t){return this.mappers[t.nodeName]?.(t)??t.textContent}static mapChildrenToMarkdown(t){return Array.from(t.childNodes).map(e=>this.mapChildNodeToMarkdown(e)).join()}static prefixMapper(t){return e=>this.removeLineBreaks(`${t} ${this.getJustOwnedText(e)} ${this.mapChildrenToMarkdown(e)}`)}static surroundMapper(t){return e=>`${t}${this.getJustOwnedText(e)}${this.mapChildrenToMarkdown(e)}${t}`}static multilinePrefixMapper(t){return e=>this.getJustOwnedText(e).split(`
`).map((n,r)=>`${t} ${r===0?this.mapChildrenToMarkdown(e):""} ${n.trim()}`).join(`
`)}static linkMapper(){return t=>`[${t.textContent}](${t.getAttribute("href")})`}static imageMapper(){return t=>`![${t.getAttribute("alt")}](${t.getAttribute("src")} "${t.getAttribute("title")??""}")`}static listMapper(t=!0){return e=>Array.from(e.children).map(n=>this.mapChildNodeToMarkdown(n)).map((n,r)=>t?`${r+1}. ${n}`:`- ${n}`).join(`
`)}static tableMapper(){return t=>{const e=t.querySelectorAll("th"),n=t.querySelectorAll("tr:has(td)"),r=Array.from(e,a=>a.textContent??""),s="| "+r.join(" | ")+" |",o="|"+Array.from({length:s.length-1}).join("-")+"|",c=r.map(a=>a.length),d=[];for(const a of n){const g="| "+Array.from(a.children,(u,l)=>u.textContent.padEnd(c[l]," ")).join(" | ")+" |";d.push(g)}return[s,o,...d,`
`].join(`
`)}}static getJustOwnedText(t){return Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()??"").join()}static removeLineBreaks(t){return t.replaceAll(`
`,"").trim()}static multilineCodeMapper(){return t=>`\`\`\`${t.textContent}\`\`\``}}class m{static rules=new RegExp([/(^\|(?<tableSeparator>[\s\-|]+)\|\n)/,/(^\|\s*(?<tableTopFirst>[^|]+)(?=.*\n\|\s*-))/,/((?<!^)\|(?<tableTopMiddle>[^|\n]+)(?=\|.*\|\n\| -))/,/(\|(?<tableTopLast>[^|]+)\|\n(?=\|\s*-))/,/(^\|\s*(?<tableBottomFirst>[^|]+)(?=.*\n^[^|]))/,/((?<!^)\|(?<tableBottomMiddle>[^|\n]+)(?=\|.*\|\n[^|]))/,/(\|\s*(?<tableBottomLast>[^|]+)\|\n(?!\|))/,/(^\|\s*(?<tableMiddleFirst>[^|]+)(?=\|))/,/(\|\s*(?<tableMiddleLast>[^|]+)\|\n)/,/(\|\s*(?<tableMiddleMiddle>[^|]+))/,/!?(\[(?<text>[^(]+)]\((?<url>[^"\s)]+))(\s+"(?<title>[^"]+)"|.*)\)/,/((?<!-.+\n)- (?<unorderedListFirstItem>.+)\n)/,/((?<=-.+\n)- (?<unorderedListMiddleItem>.+)\n(?=-))/,/(- (?<unorderedListLastItem>.+)\n(?!-))/,/((?<!\d+\..+\n)\d+\. (?<orderedListFirstItem>.+)\n)/,/((?<=\d+\..+\n)\d+\. (?<orderedListMiddleItem>.+)\n(?=\d+\.))/,/(\d+\. (?<orderedListLastItem>.+)\n(?!\d+\.))/,/(\*\*\*(?<boldAndItalic>[^*]*)\*\*\*)/,/(\*\*(?<bold>[^*]*)\*\*)/,/(\*(?<italic>[^*]*)\*)/,/(~~(?<strikethrough>[^~]*)~~)/,/(`{3}\n(?<multilineCode>[^`]+)`{3}\n)/,/(`(?<inlineCode>[^`\n]*)`)/,/(^#{6} (?<h6>.+)\n?)/,/(^#{5} (?<h5>.+)\n?)/,/(^#{4} (?<h4>.+)\n?)/,/(^#{3} (?<h3>.+)\n?)/,/(^#{2} (?<h2>.+)\n?)/,/(^# (?<h1>.+)\n?)/,/(?<horizontalLine>^-{3}\n)/,/(?<=^\n)> (?<singleLineQuote>.+)\n(?!^>)/,/((?<!> .+\n)> (?<quoteFirst>.+)\n?)/,/(> (?<quoteLast>.+)(?!.*\n> .+))/,/(> (?<quoteMiddle>.+)\n?)/,/(?<lineBreak>\n{2})/].map(t=>t.source).join("|"),"gm");static md2html(t){let e=t;console.time("md2html");for(let n=0;n<5;n++)e=e.replace(m.rules,this.replacer);return console.timeEnd("md2html"),e}static mappers={tableSeparator:t=>"",tableTopFirst:t=>`<table>
	<tr>
		<th>${t}</th>
`,tableTopMiddle:t=>`		<th>${t}</th>
`,tableTopLast:t=>`		<th>${t}</th>
	</tr>
`,tableMiddleFirst:t=>`	<tr>
		<td>${t}</td>
`,tableMiddleMiddle:t=>`		<td>${t}</td>
`,tableMiddleLast:t=>`		<td>${t}</td>
	</tr>
`,tableBottomFirst:t=>`	<tr>
		<td>${t}</td>
`,tableBottomMiddle:t=>`		<td>${t}</td>
`,tableBottomLast:t=>`		<td>${t}</td>
	</tr>
</table>
`,unorderedListFirstItem:t=>`<ul>
	<li>${t}</li>
`,unorderedListMiddleItem:t=>`	<li>${t}</li>
`,unorderedListLastItem:t=>`	<li>${t}</li>
</ul>
`,orderedListFirstItem:t=>`<ol>
	<li>${t}</li>
`,orderedListMiddleItem:t=>`	<li>${t}</li>
`,orderedListLastItem:t=>`	<li>${t}</li>
</ol>
`,boldAndItalic:t=>`<em><strong>${t}</strong></em>`,bold:t=>`<strong>${t}</strong>`,italic:t=>`<em>${t}</em>`,strikethrough:t=>`<del>${t}</del>`,multilineCode:t=>`<pre><code>${t}</code></pre>
`,inlineCode:t=>`<code>${t}</code>`,h6:t=>`<h6>${t}</h6>
`,h5:t=>`<h5>${t}</h5>
`,h4:t=>`<h4>${t}</h4>
`,h3:t=>`<h3>${t}</h3>
`,h2:t=>`<h2>${t}</h2>
`,h1:t=>`<h1>${t}</h1>
`,horizontalLine:t=>`<hr>
`,singleLineQuote:t=>`<blockquote>
	<p>${t}</p>
</blockquote>
`,quoteFirst:t=>`<blockquote>
	<p>${t}<br>`,quoteMiddle:t=>`${t}<br>`,quoteLast:t=>`${t}</p>
</blockquote>
`,lineBreak:t=>`<br>
`};static replacer(t,...e){const n=e.at(-1);if(n.text){const s=n.title?` title="${n.title}"`:"";return t[0]==="!"?`
<img src="${n.url}" alt="${n.text}"${s}/>
`:`<a href="${n.url}"${s}>${n.text}</a>`}const[r]=Object.entries(n).map(([s,o])=>o&&m.mappers[s]?.(o.trim())).filter(s=>typeof s=="string");return r??t}}customElements.define("reactive-textarea",f);const L=document.querySelector("textarea#input"),h=document.querySelector("textarea#output"),x=document.querySelector("h1#conversion"),M=document.querySelector("section#live");L.addEventListener("input",()=>{const i=L.value,t=document.createElement("template");t.innerHTML=i;const e=t.content.children.length>0;x.textContent=e?"HTML 2 MD":"MD 2 HTML",e?(h.value=$.html2md(t.content),M.innerHTML=i):(h.value=m.md2html(i),M.innerHTML=h.value),h.dispatchEvent(new InputEvent("input"))});let p;function E(i){this.style.opacity="0.4",p=this,i.dataTransfer.effectAllowed="move",i.dataTransfer.setData("text/plain",this.innerHTML)}function T(){this.style.opacity="1",b.forEach(function(i){i.classList.remove("over")})}function y(i){return i.preventDefault(),!1}function w(){this.classList.add("over")}function C(){this.classList.remove("over")}function A(i){if(i.stopPropagation(),p!==this){const t=document.createComment("");p.replaceWith(t),this.replaceWith(p),t.replaceWith(this)}return!1}const b=document.querySelectorAll("[draggable]");b.forEach(i=>{i.addEventListener("dragstart",E),i.addEventListener("dragover",y),i.addEventListener("dragenter",w),i.addEventListener("dragleave",C),i.addEventListener("dragend",T),i.addEventListener("drop",A)});const S=document.querySelectorAll("span.drag");for(const i of S){const t=i.parentNode.parentElement;i.addEventListener("pointerdown",()=>{t.setAttribute("draggable","true")}),i.addEventListener("pointercancel",()=>{t.setAttribute("draggable","false")})}
