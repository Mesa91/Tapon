function t(t,e,i,s){var a,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(r=(o<3?a(r):o>3?a(e,i,r):a(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),a=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=a.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,b=globalThis,g=b.trustedTypes,v=g?g.emptyScript:"",m=b.reactiveElementPolyfillSupport,f=(t,e)=>t,_={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),y={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),b.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&d(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);a?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),a=e.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:_;this._$Em=s;const o=a.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(void 0!==t){const o=this.constructor;if(!1===s&&(a=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==a||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,m?.({ReactiveElement:x}),(b.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+C,M=`<${z}>`,P=document,R=()=>P.createComment(""),I=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,N="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,U=/>/g,j=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),q=/'/g,L=/"/g,F=/^(?:script|style|textarea|title)$/i,H=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),B=H(1),V=H(2),G=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),Y=new WeakMap,Q=P.createTreeWalker(P,129);function X(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let a,o=2===e?"<svg>":3===e?"<math>":"",r=D;for(let e=0;e<i;e++){const i=t[e];let n,l,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===D?"!--"===l[1]?r=O:void 0!==l[1]?r=U:void 0!==l[2]?(F.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=j):void 0!==l[3]&&(r=j):r===j?">"===l[0]?(r=a??D,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?j:'"'===l[3]?L:q):r===L||r===q?r=j:r===O||r===U?r=D:(r=j,a=void 0);const p=r===j&&t[e+1].startsWith("/>")?" ":"";o+=r===D?i+M:d>=0?(s.push(n),i.slice(0,d)+S+i.slice(d)+C+p):i+C+(-2===d?e:p)}return[X(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,o=0;const r=t.length-1,n=this.parts,[l,d]=J(t,e);if(this.el=K.createElement(l,i),Q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Q.nextNode())&&n.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=d[o++],i=s.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:a,name:r[2],strings:i,ctor:"."===r[1]?st:"?"===r[1]?at:"@"===r[1]?ot:it}),s.removeAttribute(t)}else t.startsWith(C)&&(n.push({type:6,index:a}),s.removeAttribute(t));if(F.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],R()),Q.nextNode(),n.push({type:2,index:++a});s.append(t[e],R())}}}else if(8===s.nodeType)if(s.data===z)n.push({type:2,index:a});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)n.push({type:7,index:a}),t+=C.length-1}a++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===G)return e;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const o=I(e)?void 0:e._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(t),a._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(e=Z(t,a._$AS(t,e.values),a,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);Q.currentNode=s;let a=Q.nextNode(),o=0,r=0,n=i[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new et(a,a.nextSibling,this,t):1===n.type?e=new n.ctor(a,n.name,n.strings,this,t):6===n.type&&(e=new rt(a,this,t)),this._$AV.push(e),n=i[++r]}o!==n?.index&&(a=Q.nextNode(),o++)}return Q.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),I(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new K(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const a of t)s===e.length?e.push(i=new et(this.O(R()),this.O(R()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const a=this.strings;let o=!1;if(void 0===a)t=Z(this,t,e,0),o=!I(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const s=t;let r,n;for(t=a[0],r=0;r<a.length-1;r++)n=Z(this,s[i+r],e,r),n===G&&(n=this._$AH[r]),o||=!I(n)||n!==this._$AH[r],n===W?t=W:t!==W&&(t+=(n??"")+a[r+1]),this._$AH[r]=n}o&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class at extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class ot extends it{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??W)===G)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(K,et),(w.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;class dt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let a=s._$litPart$;if(void 0===a){const t=i?.renderBefore??null;s._$litPart$=a=new et(e.insertBefore(R(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}dt._$litElement$=!0,dt.finalized=!0,lt.litElementHydrateSupport?.({LitElement:dt});const ct=lt.litElementPolyfillSupport;ct?.({LitElement:dt}),(lt.litElementVersions??=[]).push("4.2.2");const pt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ht={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},ut=(t=ht,e,i)=>{const{kind:s,metadata:a}=i;let o=globalThis.litPropertyMetadata.get(a);if(void 0===o&&globalThis.litPropertyMetadata.set(a,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const a=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,a,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const a=this[s];e.call(this,i),this.requestUpdate(s,a,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function bt(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function gt(t){return bt({...t,state:!0,attribute:!1})}function vt(t){return t.shelves?.length?t.shelves:Array(t.rows).fill(t.cols)}function mt(t){return vt(t).reduce((t,e)=>t+e,0)}const ft=[{key:"name",label:"Nome del vino",kind:"text"},{key:"producer",label:"Produttore",kind:"text"},{key:"vintage",label:"Annata",kind:"year"},{key:"region",label:"Regione / denominazione",kind:"text"},{key:"country",label:"Paese",kind:"text"},{key:"grape",label:"Vitigno",kind:"text"},{key:"drink_from",label:"Da bere dal",kind:"year"},{key:"drink_until",label:"Da bere entro il",kind:"year"},{key:"drink_peak",label:"Al suo meglio nel",kind:"year"},{key:"alcohol",label:"Gradazione",kind:"text"},{key:"serve_temp",label:"Temperatura di servizio",kind:"text"},{key:"decant",label:"Decantazione",kind:"text"},{key:"glass",label:"Bicchiere",kind:"text"},{key:"price",label:"Prezzo (€)",kind:"number"},{key:"food_pairings",label:"Abbinamenti",kind:"area"},{key:"description",label:"Descrizione",kind:"area"},{key:"notes",label:"Note personali",kind:"area"}];function _t(t){return`${t.name||"Vino"}${t.vintage?` ${t.vintage}`:""}`}function $t(t,e){const i=e.find(e=>e.id===t.rack_id);return i&&null!=t.row&&null!=t.col?`${i.name} · mensola ${t.row+1}, posto ${t.col+1}`:"Da sistemare"}function yt(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}const xt="#ffe2b0",wt=["#4fc3f7","#81c784","#e0525f","#ffb74d","#ba68c8","#f48fb1","#4db6ac","#fff176"];function kt(t){const e=[];return t.serve_temp&&e.push(`🌡 ${t.serve_temp}`),t.decant&&e.push(/^(no|non serve|nessuna)\b/i.test(t.decant.trim())?"⏳ senza decanter":`⏳ decantare ${t.decant}`),t.glass&&e.push(`🍷 ${t.glass}`),e}function At(t){const e=t.opened_days??0;return 0===e?"Aperta oggi":1===e?"Aperta da ieri":`Aperta da ${e} giorni`}const Et=r`
  :host {
    --tb-accent: #9b2c3f;
    --tb-accent-2: #6b1424;
    --tb-gold: #d8b46a;
    --tb-ink: #f2ebe3;
    --tb-ink-2: #a89d93;
    --tb-line: rgba(255, 255, 255, 0.08);
    --tb-panel: linear-gradient(180deg, #211c1d 0%, #151213 100%);
    --tb-field: rgba(255, 255, 255, 0.045);
    --tb-serif: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  .btn {
    border: 1px solid var(--tb-line);
    background: rgba(255, 255, 255, 0.04);
    color: var(--tb-ink, var(--primary-text-color));
    border-radius: 999px;
    padding: 8px 16px;
    font: inherit;
    font-size: 0.9em;
    letter-spacing: 0.01em;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }
  .btn:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255, 255, 255, 0.16);
  }
  .btn:active {
    transform: scale(0.98);
  }
  .btn:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .btn.primary {
    background: linear-gradient(180deg, var(--tb-accent), var(--tb-accent-2));
    border-color: rgba(255, 255, 255, 0.12);
    color: #fff;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 6px 16px rgba(155, 44, 63, 0.35);
  }
  .btn.primary:hover {
    filter: brightness(1.1);
  }
  .btn.danger {
    color: #ff8a80;
  }
  .btn.small {
    padding: 5px 12px;
    font-size: 0.82em;
  }
  .btn.icon {
    width: 36px;
    height: 36px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid var(--tb-line);
    background: rgba(255, 255, 255, 0.03);
    color: var(--tb-ink, var(--primary-text-color));
    border-radius: 999px;
    padding: 6px 13px;
    font: inherit;
    font-size: 0.85em;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .chip:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }
  .chip.active {
    background: rgba(155, 44, 63, 0.28);
    border-color: rgba(216, 120, 136, 0.55);
    color: #fff;
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
    flex: none;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
  }

  /* dialogs */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(6, 4, 5, 0.62);
    backdrop-filter: blur(10px) saturate(120%);
    -webkit-backdrop-filter: blur(10px) saturate(120%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 14px;
    animation: tb-fade 0.18s ease-out;
  }
  .dialog {
    background: var(--tb-panel);
    color: var(--tb-ink);
    border: 1px solid var(--tb-line);
    border-radius: 24px;
    width: min(580px, 100%);
    max-height: 92vh;
    overflow: auto;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    animation: tb-rise 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
    scrollbar-width: thin;
  }
  @keyframes tb-fade {
    from { opacity: 0; }
  }
  @keyframes tb-rise {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
  }
  .dialog-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 22px 24px 8px;
    gap: 12px;
  }
  .eyebrow {
    font-size: 0.7em;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--tb-gold);
    margin-bottom: 4px;
  }
  .dialog-title {
    font-family: var(--tb-serif);
    font-size: 1.55em;
    font-weight: 600;
    line-height: 1.15;
  }
  .dialog-body {
    padding: 10px 24px 16px;
  }
  .dialog-foot {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 14px 24px 22px;
    border-top: 1px solid var(--tb-line);
  }
  .close {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--tb-line);
    color: var(--tb-ink-2);
    width: 34px;
    height: 34px;
    border-radius: 50%;
    font-size: 1em;
    cursor: pointer;
    flex: none;
  }
  .close:hover {
    color: var(--tb-ink);
    background: rgba(255, 255, 255, 0.1);
  }
  .form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 14px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.74em;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--tb-ink-2);
  }
  .field.wide {
    grid-column: 1 / -1;
  }
  .form > *,
  .field {
    min-width: 0;
  }
  .field input,
  .field textarea {
    width: 100%;
    min-width: 0;
  }
  .field input,
  .field textarea,
  .field select {
    font: inherit;
    font-size: 1.32em;
    letter-spacing: normal;
    text-transform: none;
    color: var(--tb-ink);
    background: var(--tb-field);
    border: 1px solid var(--tb-line);
    border-radius: 12px;
    padding: 10px 12px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .field input:focus,
  .field textarea:focus {
    border-color: rgba(216, 120, 136, 0.6);
    box-shadow: 0 0 0 3px rgba(155, 44, 63, 0.25);
  }
  .types {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    text-transform: none;
    letter-spacing: normal;
  }
  .field .types {
    font-size: 1.3em;
  }
  .note {
    font-size: 0.85em;
    color: var(--tb-ink-2);
  }
  .section {
    font-size: 0.72em;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--tb-gold);
    margin: 22px 0 10px;
  }
  .stepper {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--tb-line);
    border-radius: 999px;
    background: var(--tb-field);
    overflow: hidden;
  }
  .stepper button {
    width: 34px;
    height: 32px;
    border: none;
    background: none;
    color: var(--tb-ink);
    font-size: 1.1em;
    cursor: pointer;
  }
  .stepper button:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  .stepper span {
    min-width: 30px;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
  @media (max-width: 480px) {
    .form {
      grid-template-columns: 1fr;
    }
    .dialog-head,
    .dialog-body,
    .dialog-foot {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  .stars {
    display: inline-flex;
    gap: 1px;
    line-height: 1;
    vertical-align: -1px;
  }
  .star {
    color: rgba(255, 255, 255, 0.18);
    font-size: 0.95em;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
  }
  .star.on {
    color: #e3b341;
  }
  .star.half {
    background: linear-gradient(90deg, #e3b341 50%, rgba(255, 255, 255, 0.18) 50%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .stars.big .star {
    font-size: 2.1em;
    padding: 0 3px;
  }
  .stars.edit .star {
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .stars.edit .star:hover {
    transform: scale(1.15);
  }
`,St={red:{shape:"bordeaux",glass:"tb-glass-red",clear:!1,foil:"tb-foil-wine"},white:{shape:"burgundy",glass:"tb-wine-white",clear:!0,foil:"tb-foil-silver"},rose:{shape:"bordeaux",glass:"tb-wine-rose",clear:!0,foil:"tb-foil-rose"},sparkling:{shape:"champagne",glass:"tb-glass-green",clear:!1,foil:"tb-foil-gold"},dessert:{shape:"bordeaux",glass:"tb-glass-amber",clear:!1,foil:"tb-foil-gold"}},Ct={bordeaux:{body:"M9.7 1h4.6v16.5c0 3.4 6.7 4.8 6.7 11.5v31.2c0 1.5-1.2 2.8-2.8 2.8H5.8C4.2 63 3 61.7 3 60.2V29c0-6.7 6.7-8.1 6.7-11.5z",foil:"M9.5 1.4c0-.8.5-1.4 1.3-1.4h2.4c.8 0 1.3.6 1.3 1.4V13H9.5z",label:[4.4,35,15.2,16.5],neckY:15,fillY:22},burgundy:{body:"M9.8 1h4.4v13c0 5 7 9 7 18v28.2c0 1.5-1.2 2.8-2.8 2.8H5.6c-1.6 0-2.8-1.3-2.8-2.8V32c0-9 7-13 7-18z",foil:"M9.6 1.4c0-.8.5-1.4 1.3-1.4h2.2c.8 0 1.3.6 1.3 1.4V12H9.6z",label:[4.2,36,15.6,16],neckY:13.5,fillY:19},champagne:{body:"M9.4 1h5.2v11c0 6 7.6 9.5 7.6 19v29.4c0 1.4-1.2 2.6-2.6 2.6H4.4C3 63 1.8 61.8 1.8 60.4V31c0-9.5 7.6-13 7.6-19z",foil:"M9 1.6C9 .7 9.7 0 10.6 0h2.8c.9 0 1.6.7 1.6 1.6V12c0 2.4 2.6 4.4 4.3 6.6l-14.6.1C6.4 16.4 9 14.4 9 12z",label:[3.6,37,16.8,13],neckY:20,fillY:20},half:{body:"M10 20h4v9c0 2.6 5.2 3.6 5.2 8.8v22.6c0 1.4-1.1 2.6-2.5 2.6H7.3c-1.4 0-2.5-1.2-2.5-2.6V37.8c0-5.2 5.2-6.2 5.2-8.8z",foil:"M9.8 20.9c0-.5.4-.9.9-.9h2.6c.5 0 .9.4.9.9V28H9.8z",label:[6,44,12,11],neckY:30,fillY:33}};function zt(t,e){const i=St[t]||St.red,s=Ct[i.shape],[a,o,r,n]=s.label,l=a+r/2;return V`<svg viewBox="0 0 24 64" aria-hidden="true">
    <ellipse cx="12" cy="63.2" rx="9.5" ry="1" fill="rgba(0,0,0,.55)" filter="url(#tb-soft)"/>
    ${i.clear?V`<path d=${s.body} fill="url(#tb-glass-clear)"/>
            <path d=${s.body} fill=${`url(#${i.glass})`} clip-path=${`url(#tb-fill-${i.shape})`}/>
            <rect x="0" y=${s.fillY} width="24" height=".5" fill="rgba(255,255,255,.35)" clip-path=${`url(#tb-in-${i.shape})`}/>`:V`<path d=${s.body} fill=${`url(#${i.glass})`}/>`}
    <path d=${s.body} fill="url(#tb-cylinder)"/>
    <path d=${s.body} fill="none" stroke="rgba(255,255,255,.18)" stroke-width=".35"/>
    <ellipse cx="12" cy="61.4" rx="6.5" ry="1.3" fill="rgba(0,0,0,.35)" clip-path=${`url(#tb-in-${i.shape})`}/>
    <g class="label-group">
      <rect x=${a} y=${o} width=${r} height=${n} rx=".5" fill="url(#tb-paper)"/>
      <rect x=${a} y=${o} width=${r} height=${n} rx=".5" fill="url(#tb-label-curve)"/>
      <rect x=${a+.9} y=${o+.9} width=${r-1.8} height=${n-1.8} rx=".3" fill="none" stroke="rgba(120,90,50,.55)" stroke-width=".25"/>
      <circle cx=${l} cy=${o+.3*n} r=${.12*Math.min(r,n)} fill="none" stroke="rgba(120,80,30,.8)" stroke-width=".3"/>
      <rect x=${l-.3*r} y=${o+.55*n} width=${.6*r} height=".9" rx=".45" fill="rgba(40,20,15,.75)"/>
      <rect x=${l-.22*r} y=${o+.7*n} width=${.44*r} height=".5" rx=".25" fill="rgba(40,20,15,.45)"/>
      <rect x=${l-.15*r} y=${o+.8*n} width=${.3*r} height=".5" rx=".25" fill="rgba(40,20,15,.35)"/>
    </g>
    <path d=${s.foil} fill=${`url(#${i.foil})`}/>
    <path d=${s.foil} fill="url(#tb-cylinder)" opacity=".6"/>
    <path d="M5.4 30c.6-3.8 2.6-5.6 3.6-6.8V59.5H5.4z" fill="url(#tb-spec)" clip-path=${`url(#tb-in-${i.shape})`} opacity=".9"/>
    <rect x="17.6" y="31" width=".9" height="27" rx=".45" fill="rgba(255,255,255,.18)" clip-path=${`url(#tb-in-${i.shape})`}/>
    ${e?function(t,e){const i="past"===e?"url(#tb-tag-past)":"url(#tb-tag-soon)";return V`<g class="tag">
    <path d=${`M12 ${t}c3 .2 4.6 1 5.4 2.6`} fill="none" stroke="rgba(240,230,210,.85)" stroke-width=".35"/>
    <g transform=${`translate(16.4 ${t+2}) rotate(14)`}>
      <rect x="0" y="0" width="6.4" height="8.6" rx="1.1" fill=${i} stroke="rgba(0,0,0,.35)" stroke-width=".25"/>
      <circle cx="3.2" cy="1.4" r=".55" fill="rgba(0,0,0,.45)"/>
      ${"past"===e?V`<path d="M3.2 3.3v2.6M3.2 7v.1" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>`:V`<circle cx="3.2" cy="5.4" r="1.9" fill="none" stroke="#3b2200" stroke-width=".45"/>
              <path d="M3.2 4.3v1.2l.8.6" fill="none" stroke="#3b2200" stroke-width=".45" stroke-linecap="round"/>`}
    </g>
  </g>`}(s.neckY,e):W}
  </svg>`}const Mt=V`<svg viewBox="0 0 24 64" aria-hidden="true">
  <path d=${Ct.bordeaux.body} fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.16)" stroke-width=".45" stroke-dasharray="1.4 1.2"/>
</svg>`,Pt=(t,e)=>V`<linearGradient id=${t} x1="0" x2="1" y1="0" y2="0">
  ${e.map(([t,e])=>V`<stop offset=${t} stop-color=${e}/>`)}
</linearGradient>`,Rt=V`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="tb-soft" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation=".6"/></filter>
  ${["bordeaux","burgundy","champagne","half"].map(t=>{const e=Ct[t];return V`
    <clipPath id=${`tb-in-${t}`}><path d=${e.body}/></clipPath>
    <clipPath id=${`tb-fill-${t}`}><rect x="0" y=${e.fillY} width="24" height="64"/></clipPath>`})}

  <!-- glass and wine -->
  ${Pt("tb-glass-red",[[0,"#060404"],[.18,"#1c0a0d"],[.42,"#3b0f18"],[.6,"#2a0a11"],[1,"#050303"]])}
  ${Pt("tb-glass-green",[[0,"#030603"],[.2,"#0e2412"],[.42,"#1d4223"],[.62,"#12301a"],[1,"#020402"]])}
  ${Pt("tb-glass-amber",[[0,"#160902"],[.2,"#5a2c08"],[.42,"#9c5714"],[.62,"#6e3a0c"],[1,"#120701"]])}
  ${Pt("tb-wine-white",[[0,"#5a4a12"],[.2,"#b9a043"],[.42,"#ecd98e"],[.62,"#cdb158"],[1,"#4d3e0e"]])}
  ${Pt("tb-wine-rose",[[0,"#b87a6d"],[.2,"#d9917c"],[.42,"#f0b3a0"],[.62,"#e39a83"],[1,"#c48a7c"]])}
  ${Pt("tb-glass-clear",[[0,"rgba(190,215,200,.30)"],[.3,"rgba(230,245,235,.10)"],[.7,"rgba(230,245,235,.08)"],[1,"rgba(160,190,175,.35)"]])}

  <!-- light on a cylinder -->
  <linearGradient id="tb-cylinder" x1="0" x2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".55"/>
    <stop offset=".12" stop-color="#000" stop-opacity=".1"/>
    <stop offset=".3" stop-color="#fff" stop-opacity=".1"/>
    <stop offset=".5" stop-color="#000" stop-opacity="0"/>
    <stop offset=".85" stop-color="#000" stop-opacity=".3"/>
    <stop offset="1" stop-color="#000" stop-opacity=".65"/>
  </linearGradient>
  <linearGradient id="tb-spec" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".15" stop-color="#fff" stop-opacity=".55"/>
    <stop offset=".6" stop-color="#fff" stop-opacity=".25"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>

  <!-- capsules -->
  ${Pt("tb-foil-wine",[[0,"#1d0508"],[.3,"#7a1d2b"],[.45,"#c4515f"],[.6,"#6a1523"],[1,"#150305"]])}
  ${Pt("tb-foil-gold",[[0,"#5a3a08"],[.3,"#c9962e"],[.45,"#ffe7a1"],[.6,"#b88421"],[1,"#4a2f05"]])}
  ${Pt("tb-foil-silver",[[0,"#3c3c3c"],[.3,"#a9a9a9"],[.45,"#f2f2f2"],[.6,"#9a9a9a"],[1,"#2e2e2e"]])}
  ${Pt("tb-foil-rose",[[0,"#5e2d24"],[.3,"#c47e6c"],[.45,"#f6cdbd"],[.6,"#b46e5d"],[1,"#4d241c"]])}

  <!-- label paper -->
  <linearGradient id="tb-paper" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#f8f2e4"/><stop offset="1" stop-color="#e8dcc2"/>
  </linearGradient>
  <linearGradient id="tb-label-curve" x1="0" x2="1">
    <stop offset="0" stop-color="#000" stop-opacity=".4"/>
    <stop offset=".18" stop-color="#000" stop-opacity="0"/>
    <stop offset=".35" stop-color="#fff" stop-opacity=".25"/>
    <stop offset=".55" stop-color="#000" stop-opacity="0"/>
    <stop offset=".88" stop-color="#000" stop-opacity=".18"/>
    <stop offset="1" stop-color="#000" stop-opacity=".45"/>
  </linearGradient>

  <!-- hanging tags -->
  <linearGradient id="tb-tag-soon" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#e09a1a"/>
  </linearGradient>
  <linearGradient id="tb-tag-past" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#ff7a6e"/><stop offset="1" stop-color="#b3201f"/>
  </linearGradient>
</defs></svg>`;function It(t,e,i){return B`
    <div class="form">
      <label class="field wide">
        Tipo
        <div class="types">
          ${Object.entries(t.types).map(([t,s])=>B`<button type="button" class="chip ${e.type===t?"active":""}"
              @click=${()=>i("type",t)}><span class="dot" style="background:${s.color}"></span>${s.label}</button>`)}
        </div>
      </label>
      ${ft.map(t=>{const s="name"===t.key||"area"===t.kind,a=e[t.key]??"",o=e=>i(t.key,e.target.value);return B`<label class="field ${s?"wide":""}">
          ${t.label}
          ${"area"===t.kind?B`<textarea rows="2" .value=${a} @input=${o}></textarea>`:B`<input
                type=${"text"===t.kind?"text":"number"}
                inputmode=${"text"===t.kind?"text":"numeric"}
                step=${"number"===t.kind?"0.01":"1"}
                .value=${String(a)}
                @input=${o}
              />`}
        </label>`})}
    </div>
  `}let Tt=class extends dt{constructor(){super(...arguments),this.rackId=null,this.row=null,this.col=null,this.mode="cellar",this.prefill=null,this.wishId=null,this._where="",this._wishNotes="",this._prefilled=!1,this._values={type:"red"},this._quantity=1,this._busy=!1,this._reading="",this._front="",this._back=""}_merge(t,e){const i={...this._values};for(const[s,a]of Object.entries(t))null!=a&&""!==a&&(e||void 0===i[s]||null===i[s]||""===String(i[s]).trim())&&(i[s]=a);this._values=i}async _photo(t,e){const i=t.target,s=i.files?.[0];if(i.value="",!s)return;const a=await Nt(s);"front"===e?this._front=a:this._back=a,this._front&&await this._read()}async _read(){this._reading=this._back?"Leggo fronte e retro…":"Leggo l'etichetta…";try{const t=await this.card.ws({type:"tapon/ai_recognize",image:this._front,...this._back?{back_image:this._back}:{}});this._merge(t.wine,!0),this.card.toast(this._back?"Fronte e retro letti: controlla i dati":"Etichetta letta: controlla i dati")}catch{}finally{this._reading=""}}_slot(t){const e="front"===t?this._front:this._back,i="front"===t?"Fronte":"Retro",s=!!this._reading||"back"===t&&!this._front;return B`<label class="slot ${e?"has":""} ${s?"off":""}"
        title=${"back"!==t||this._front?`Foto ${i.toLowerCase()}`:"Prima fotografa il fronte"}>
      ${e?B`<img src=${e} alt=${i} />`:B`<span class="plus">📷</span>`}
      <span class="slot-label">${i}${"back"!==t||e?W:B`<small>facoltativo</small>`}</span>
      <input type="file" accept="image/*" capture="environment" ?disabled=${s}
        @change=${e=>this._photo(e,t)} />
    </label>`}async _fill(){if(String(this._values.name||"").trim()){this._reading="Completo i dati…";try{const t=await this.card.ws({type:"tapon/ai_fill",wine:this._values});this._merge(t.wine,!1),this.card.toast("Dati completati")}catch{}finally{this._reading=""}}else this.card.toast("Scrivi almeno il nome del vino")}_renderAI(){return this.data.ai?B`<div class="ai">
      <div class="slots">${this._slot("front")}${this._slot("back")}</div>
      <div class="ai-side">
        <div class="ai-title">✨ Compilazione automatica</div>
        <div class="note">${this._reading||(this._front?"Fatto. Se in etichetta mancava qualcosa, aggiungi il retro.":"Fotografa il fronte dell'etichetta; il retro è facoltativo.")}</div>
        <button class="btn small" style="margin-top:8px" ?disabled=${!!this._reading} @click=${this._fill}>Oppure completa dal nome</button>
      </div>
      ${this._reading?B`<div class="reading"></div>`:W}
    </div>`:B`<div class="ai"><div>
        <div class="ai-title">✨ Compilazione automatica</div>
        <div class="note">Aggiungi una chiave Gemini (gratuita) in Impostazioni → Dispositivi e servizi → Tapon → Configura per leggere le etichette con una foto.</div>
      </div></div>`}willUpdate(){if(!this._prefilled&&this.prefill){this._prefilled=!0;const t=new Set(["id","added_at","source","where","wish_notes","rating"]);this._values={type:"red",...Object.fromEntries(Object.entries(this.prefill).filter(([e,i])=>!t.has(e)&&null!=i))}}}_close(){this.dispatchEvent(new CustomEvent("close"))}async _save(){if(String(this._values.name||"").trim())if("wish"!==this.mode){this._busy=!0;try{const t=(await this.card.ws({type:"tapon/add_bottles",wine:this._values,quantity:this._quantity,rack_id:this.rackId,row:this.row,col:this.col,wish_id:this.wishId})).bottles,e=t.filter(t=>!t.rack_id).length;this.card.toast(e?`Aggiunte ${t.length} bottiglie, ${e} da sistemare: scaffale pieno`:t.length>1?`Aggiunte ${t.length} bottiglie`:"Bottiglia aggiunta"),this.wishId,this._close()}finally{this._busy=!1}}else{this._busy=!0;try{await this.card.ws({type:"tapon/wishlist_add",wine:this._values,where:this._where,wish_notes:this._wishNotes}),this.card.toast("Aggiunto alla lista dei desideri"),this._close()}finally{this._busy=!1}}else this.card.toast("Scrivi almeno il nome del vino")}_renderWishFields(){return B`<div class="form" style="margin-top:10px">
      <label class="field wide">
        Dove l'hai assaggiato
        <input type="text" maxlength="200" placeholder="Es. cena da Marco, Osteria del Ponte…" .value=${this._where}
          @input=${t=>this._where=t.target.value} />
      </label>
      <label class="field wide">
        Nota
        <textarea rows="2" maxlength="1000" placeholder="Es. chiedere all'enoteca sotto casa, prezzo visto 25 €…"
          .value=${this._wishNotes} @input=${t=>this._wishNotes=t.target.value}></textarea>
      </label>
    </div>`}render(){const t=this.data.racks.find(t=>t.id===this.rackId),e=t&&null!=this.row&&null!=this.col?`${t.name}, mensola ${this.row+1}, posto ${this.col+1}`:"nel primo posto libero";return B`
      ${Rt}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <div class="dialog-head">
            <div style="display:flex;gap:16px;align-items:flex-end">
              <div style="width:34px;flex:none;filter:drop-shadow(0 8px 10px rgba(0,0,0,.55))">${zt(this._values.type||"red")}</div>
              <div>
                <div class="eyebrow">${"wish"===this.mode?"Lista dei desideri":this.wishId?"Comprato!":"Nuovo in cantina"}</div>
                <div class="dialog-title">${String(this._values.name||"").trim()||"Aggiungi vino"}</div>
              </div>
            </div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${this._renderAI()}
            ${It(this.data,this._values,(t,e)=>this._values={...this._values,[t]:e})}
            ${"wish"===this.mode?this._renderWishFields():B`            <div class="form" style="margin-top:10px">
              <label class="field">
                Quante bottiglie
                <input type="number" min="1" max="100" .value=${String(this._quantity)}
                  @input=${t=>this._quantity=Math.max(1,Math.min(100,Number(t.target.value)||1))} />
              </label>
              <div class="field">Dove<span style="color:var(--tb-ink);text-transform:none;letter-spacing:normal;font-size:1.3em">${e}${this._quantity>1?" e i successivi":""}</span></div>
            </div>
            ${this.data.settings.auto_labels?B`<p class="note">Per ogni bottiglia verrà richiesta la stampa dell'etichetta QR.</p>`:W}`}
          </div>
          <div class="dialog-foot">
            <button class="btn" @click=${this._close}>Annulla</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${this._save}>
              ${this._busy?"Salvo…":"wish"===this.mode?"♡ Aggiungi ai desideri":"Aggiungi "+(this._quantity>1?`${this._quantity} bottiglie`:"bottiglia")}
            </button>
          </div>
        </div>
      </div>
    `}};async function Nt(t,e=1280){const i=URL.createObjectURL(t);try{const t=new Image;t.src=i,await t.decode();const s=Math.min(1,e/Math.max(t.naturalWidth,t.naturalHeight)),a=document.createElement("canvas");return a.width=Math.round(t.naturalWidth*s),a.height=Math.round(t.naturalHeight*s),a.getContext("2d").drawImage(t,0,0,a.width,a.height),a.toDataURL("image/jpeg",.85)}finally{URL.revokeObjectURL(i)}}function Dt(t,e,i=!1){const s=Number(t)||0;return B`<span class="stars ${i?"big":""} ${e?"edit":""}" role=${e?"radiogroup":W}
    aria-label=${s?`${s} su 5`:"Nessun voto"}>
    ${[1,2,3,4,5].map(t=>{const i=s>=t?"on":s>=t-.5?"half":"";return e?B`<button type="button" class="star ${i}" title="${t} su 5" @click=${()=>e(s===t?null:t)}>★</button>`:B`<span class="star ${i}">★</span>`})}
  </span>`}function Ot(t){return t?t.toLocaleString("it-IT",{maximumFractionDigits:1}):""}Tt.styles=[Et,r`
      .ai {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
        align-items: center;
        padding: 14px;
        margin-bottom: 16px;
        border-radius: 16px;
        border: 1px solid rgba(216, 180, 106, 0.25);
        background:
          radial-gradient(120% 140% at 0% 0%, rgba(216, 180, 106, 0.12), transparent 55%),
          rgba(255, 255, 255, 0.025);
      }
      .ai-title {
        font-weight: 600;
      }
      .ai .note {
        margin-top: 2px;
      }
      .slots {
        display: flex;
        gap: 8px;
      }
      .slot {
        position: relative;
        width: 74px;
        height: 96px;
        border-radius: 12px;
        border: 1px dashed rgba(216, 180, 106, 0.45);
        background: rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        cursor: pointer;
        overflow: hidden;
        transition: border-color 0.15s, background 0.15s;
      }
      .slot:hover {
        border-color: var(--tb-gold);
        background: rgba(216, 180, 106, 0.08);
      }
      .slot.has {
        border-style: solid;
      }
      .slot.off {
        opacity: 0.4;
        cursor: default;
      }
      .slot img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .slot .plus {
        font-size: 1.4em;
      }
      .slot-label {
        position: relative;
        font-size: 0.72em;
        text-align: center;
        line-height: 1.15;
        padding: 2px 6px;
        border-radius: 8px;
      }
      .slot.has .slot-label {
        margin-top: auto;
        margin-bottom: 6px;
        background: rgba(0, 0, 0, 0.65);
      }
      .slot-label small {
        display: block;
        color: var(--tb-ink-2);
        font-size: 0.9em;
      }
      .reading {
        grid-column: 1 / -1;
        height: 3px;
        border-radius: 2px;
        background: linear-gradient(90deg, transparent, var(--tb-gold), transparent);
        background-size: 40% 100%;
        background-repeat: no-repeat;
        animation: tb-scan 1.1s linear infinite;
      }
      @keyframes tb-scan {
        from { background-position: -40% 0; }
        to { background-position: 140% 0; }
      }
      input[type="file"] {
        display: none;
      }
    `],t([bt({attribute:!1})],Tt.prototype,"card",void 0),t([bt({attribute:!1})],Tt.prototype,"data",void 0),t([bt({attribute:!1})],Tt.prototype,"rackId",void 0),t([bt({attribute:!1})],Tt.prototype,"row",void 0),t([bt({attribute:!1})],Tt.prototype,"col",void 0),t([bt({attribute:!1})],Tt.prototype,"mode",void 0),t([bt({attribute:!1})],Tt.prototype,"prefill",void 0),t([bt({attribute:!1})],Tt.prototype,"wishId",void 0),t([gt()],Tt.prototype,"_where",void 0),t([gt()],Tt.prototype,"_wishNotes",void 0),t([gt()],Tt.prototype,"_values",void 0),t([gt()],Tt.prototype,"_quantity",void 0),t([gt()],Tt.prototype,"_busy",void 0),t([gt()],Tt.prototype,"_reading",void 0),t([gt()],Tt.prototype,"_front",void 0),t([gt()],Tt.prototype,"_back",void 0),Tt=t([pt("tb-add-dialog")],Tt);let Ut=class extends dt{constructor(){super(...arguments),this._label=null,this._editing=!1,this._values={},this._sameWine=!0,this._otherReason=!1,this._busy=!1,this._rating=!1,this._stars=null,this._tasting="",this._reserving=!1,this._resFor="",this._resUntil="",this._estimatePeak=()=>this._aiComplete(["drink_peak","drink_from","drink_until"],"drink_peak",t=>`Al suo meglio nel ${t.drink_peak}`,"Gemini non ha saputo stimare il picco di questo vino"),this._estimateService=()=>this._aiComplete(["serve_temp","decant","glass"],"serve_temp",()=>"Aggiunti i consigli di servizio","Gemini non ha saputo dire come servirlo")}willUpdate(t){if(t.has("data")&&this._label&&this.data.settings.label_format!==this._label.label_format&&(this._label=null,this._loadLabel()),t.has("bottle")){const e=t.get("bottle");e?.id!==this.bottle.id&&(this._label=null,this._editing=!1,this._rating=!1,this._reserving=!1,this._loadLabel())}}async _loadLabel(){const t=this.bottle.id;try{const e=await this.card.hass.callWS({type:"tapon/get_label",bottle_id:t});this.bottle.id===t&&(this._label=e)}catch{}}_close(){this.dispatchEvent(new CustomEvent("close"))}_sameWineCount(){const t=t=>`${(t.name||"").trim().toLowerCase()}|${(t.producer||"").trim().toLowerCase()}|${t.vintage||""}`;return this.data.bottles.filter(e=>t(e)===t(this.bottle)).length}async _remove(t,e=!1){this._busy=!0;try{const i={type:"tapon/remove_bottle",bottle_id:this.bottle.id,reason:t};e&&(this._stars&&(i.rating=this._stars),this._tasting.trim()&&(i.tasting_notes=this._tasting.trim()));const s=await this.card.ws(i);if(s?.wishlisted)return this.card.toast(`${_t(this.bottle)} era l'ultima: l'ho messa nella lista dei desideri da ricomprare ♡`),void this._close();this.card.toast(e&&this._stars?`${_t(this.bottle)}: bevuta, voto ${this._stars}/5. Salute!`:`${_t(this.bottle)}: ${this.data.reasons[t]?.toLowerCase()||"tolta"}. La trovi nello storico.`),this._close()}finally{this._busy=!1}}async _saveReserve(t=!1){this._busy=!0;try{await this.card.ws({type:"tapon/reserve_bottle",bottle_id:this.bottle.id,reserved_for:t?"":this._resFor.trim()||"Riservata",reserved_until:t?null:this._resUntil||null}),this.card.toast(t?"Riserva tolta":"Bottiglia riservata: non verrà proposta negli abbinamenti"),this._reserving=!1}finally{this._busy=!1}}async _saveEdit(){this._busy=!0;try{const t=await this.card.ws({type:"tapon/update_bottle",bottle_id:this.bottle.id,changes:this._values,same_wine:this._sameWine});this.card.toast(t.updated>1?`Aggiornate ${t.updated} bottiglie`:"Bottiglia aggiornata"),this._editing=!1,this._label=null,this._loadLabel()}finally{this._busy=!1}}async _printOnPrinter(){const t=await this.card.ws({type:"tapon/request_label",bottle_id:this.bottle.id});this.card.toast(t.printed?"Etichetta stampata":this.data.printer?"Stampa non riuscita: guarda le notifiche di Home Assistant":"Richiesta inviata. Per stampare da solo, scegli la stampante nelle opzioni di Tapon.")}_printInBrowser(){if(!this._label)return;const t=window.open("","_blank","width=480,height=360");if(!t)return void this.card.toast("Il browser ha bloccato la finestra di stampa");const{width_mm:e,height_mm:i}=this._label;t.document.write(`<!doctype html><html><head><title>Etichetta ${this._label.code}</title>\n      <style>@page{size:${e}mm ${i}mm;margin:0}html,body{margin:0}img{width:${e}mm;height:${i}mm;display:block}</style></head>\n      <body><img src="data:image/png;base64,${this._label.png_base64}"\n      onload="setTimeout(function(){window.print();window.close();},150)"></body></html>`),t.document.close()}render(){const t=this.bottle,e=this.data.types[t.type];return B`
      ${Rt}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <div class="hero">
            <div class="hero-bottle">${zt(t.type,t.alert)}</div>
            <div class="hero-text">
              <div class="eyebrow">${e?.label||""}${t.region?` · ${t.region}`:""}</div>
              <div class="dialog-title">${t.name||"Vino"}</div>
              ${t.producer?B`<div class="producer">${t.producer}</div>`:W}
              <div class="vintage">${t.vintage||"s.a."}</div>
            </div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${this._rating?this._renderRate():this._editing?this._renderEdit():this._renderView(t,e)}
          </div>
          ${this._rating?this._renderRateFoot():this._editing?this._renderEditFoot():this._renderViewFoot()}
        </div>
      </div>
    `}_renderView(t,e){const i=function(t){return t.drink_from&&t.drink_until?`${t.drink_from}–${t.drink_until}`:t.drink_until?`entro il ${t.drink_until}`:t.drink_from?`dal ${t.drink_from}`:""}(t);return B`
      <div class="badges">
        ${t.opened_at?B`<span class="badge opened ${t.opened_state||""}">🍾 ${At(t)}</span>`:W}
        ${"closing"===t.alert?B`<span class="badge warn">Da bere presto</span>`:W}
        ${"past"===t.alert?B`<span class="badge bad">Oltre la finestra</span>`:W}
        ${t.opened_at?W:B`<span class="where">📍 ${$t(t,this.data.racks)}</span>`}
        ${this._reserving?W:B`<button class="btn small res-btn" @click=${()=>{this._resFor=t.reserved_for||"",this._resUntil=t.reserved_until||"",this._reserving=!0}}>${t.reserved_for?"🔒 Modifica riserva":"🔒 Riserva"}</button>`}
      </div>
      ${t.reserved_for&&!this._reserving?B`<div class="reserved">🔒 <b>Riservata</b>: ${t.reserved_for}${t.reserved_until?B` · ${new Date(t.reserved_until+"T12:00").toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"})}`:W}
            <div class="note">Non viene proposta negli abbinamenti${t.reserved_until?"; quel giorno ti arriva un promemoria":""}.</div></div>`:W}
      ${this._reserving?B`<div class="reserve-form">
            <div class="form">
              <label class="field">Per cosa
                <input type="text" maxlength="200" placeholder="Es. anniversario, annata di nascita…" .value=${this._resFor}
                  @input=${t=>this._resFor=t.target.value} /></label>
              <label class="field">Quando (facoltativo)
                <input type="date" .value=${this._resUntil}
                  @input=${t=>this._resUntil=t.target.value} /></label>
            </div>
            <div class="row" style="justify-content:flex-end;margin-top:10px">
              ${t.reserved_for?B`<button class="btn small" ?disabled=${this._busy} @click=${()=>this._saveReserve(!0)}>Togli riserva</button>`:W}
              <button class="btn small" @click=${()=>this._reserving=!1}>Annulla</button>
              <button class="btn small primary" ?disabled=${this._busy} @click=${()=>this._saveReserve()}>Salva</button>
            </div>
          </div>`:W}
      ${t.past_count||t.past_notes?B`<div class="past">
            <span class="past-head">Già bevuto${t.past_count?B` ${1===t.past_count?"una volta":`${t.past_count} volte`}`:W}</span>
            ${t.past_rating?B`${Dt(t.past_rating)} <b>${Ot(t.past_rating)}</b>`:W}
            ${t.past_notes?B`<div class="past-notes">«${t.past_notes}»</div>`:W}
          </div>`:W}
      <dl class="facts">
        ${ft.filter(t=>!["name","producer","vintage","drink_from","drink_until","drink_peak","serve_temp","decant","glass"].includes(t.key)).map(e=>{const i=t[e.key];return null==i||""===i?W:B`<dt>${e.label}</dt><dd>${"price"===e.key?`${Number(i).toFixed(2)} €`:i}</dd>`})}
        ${i?B`<dt>Finestra di beva</dt><dd>${i}</dd>`:W}
      </dl>
      ${this._renderService(t)}
      ${this._renderMaturity(t)}
      <div class="label-box">
        ${this._label?B`<img class="label ${this._label.label_format}" alt="Etichetta QR" src="data:image/png;base64,${this._label.png_base64}" />`:B`<div class="note">Preparo l'etichetta…</div>`}
        <div class="note">Inquadra il QR con l'app Home Assistant quando prendi la bottiglia: verrà tolta dalla cantina.</div>
        <div class="row">
          <button class="btn small" @click=${this._printOnPrinter}>🖨️ Stampante etichette</button>
          <button class="btn small" ?disabled=${!this._label} @click=${this._printInBrowser}>Stampa dal browser</button>
        </div>
      </div>
      ${this._otherReason?B`<div class="reasons">
            ${Object.entries(this.data.reasons).filter(([t])=>"drank"!==t).map(([t,e])=>B`<button class="btn small ${"deleted"===t?"danger":""}" ?disabled=${this._busy}
                @click=${()=>this._remove(t)}>${e}</button>`)}
          </div>`:W}
    `}_renderViewFoot(){return B`<div class="dialog-foot">
      <button class="btn" @click=${()=>this.dispatchEvent(new CustomEvent("move",{detail:{bottle:this.bottle}}))}>↔ Sposta</button>
      <button class="btn" @click=${()=>{this._values=Object.fromEntries(["type",...ft.map(t=>t.key)].map(t=>[t,this.bottle[t]??""])),this._sameWine=!0,this._editing=!0}}>✏️ Modifica</button>
      <button class="btn" @click=${()=>this._otherReason=!this._otherReason}>Altro…</button>
      ${this.bottle.opened_at?W:B`<button class="btn" ?disabled=${this._busy} title="Aperta ma non finita: ti ricordo di finirla"
            @click=${this._open}>🍾 Aperta</button>`}
      <button class="btn primary" ?disabled=${this._busy} @click=${()=>{this._stars=null,this._tasting="",this._rating=!0}}>🍷 ${this.bottle.opened_at?"Finita":"Bevuta"}</button>
    </div>`}_renderMaturity(t){const e=function(t,e=(new Date).getFullYear()){const i=t.drink_from||null,s=t.drink_until||null;let a=t.drink_peak||null;if(!s&&!a)return null;a&&i&&a<i&&(a=i),a&&s&&a>s&&(a=s);const o=i??Math.min(a??s,s??a)-3,r=s??a+4;let n,l;e>r?[n,l]=["past","Oltre la finestra: da bere subito"]:e<o?[n,l]=["young","Ancora giovane: meglio aspettare"]:a&&Math.abs(e-a)<=1?[n,l]=["peak","Al massimo: è il momento giusto"]:[n,l]=a&&e<a?["rising",`In crescita: al meglio nel ${a}`]:a?["declining","Dopo il picco: da bere presto"]:["rising","Pronto da bere"];const d=Math.max(1,r-o+1),c=t=>Math.min(100,Math.max(0,(t-o+.5)/d*100));return{start:o,end:r,peak:a,phase:n,label:l,today:c(e),peakPos:a?c(a):null}}(t),i=this.data.ai&&!t.drink_peak?B`<button class="btn small" ?disabled=${this._busy} @click=${this._estimatePeak}>✨ Stima il picco</button>`:W;return e?B`<div class="maturity ph-${e.phase}">
      <div class="m-head"><span class="m-label">${e.label}</span>${i}</div>
      <div class="m-bar" style=${null!=e.peakPos?`background:linear-gradient(90deg,#5c6bc0 0%,#7cb342 ${Math.max(0,e.peakPos-22)}%,#e3b341 ${Math.max(0,e.peakPos-4)}%,#e3b341 ${Math.min(100,e.peakPos+4)}%,#ef6c00 ${Math.min(100,e.peakPos+22)}%,#8d2b2b 100%)`:""}>
        ${null!=e.peakPos?B`<span class="m-peak" style="left:${e.peakPos}%" title="Picco ${e.peak}"></span>`:W}
        <span class="m-today" style="left:${e.today}%" title="Oggi"></span>
      </div>
      <div class="m-scale"><span>${e.start}</span>
        ${e.peak&&null!=e.peakPos&&e.peakPos>14&&e.peakPos<86?B`<span class="m-peak-label" style="left:${e.peakPos}%">picco ${e.peak}</span>`:W}
        <span>${e.end}</span></div>
    </div>`:this.data.ai?B`<div class="maturity empty">${i}</div>`:W}async _aiComplete(t,e,i,s){this._busy=!0;try{const a=this.bottle,o=(await this.card.ws({type:"tapon/ai_fill",wine:{name:a.name,producer:a.producer,vintage:a.vintage,type:a.type,region:a.region,grape:a.grape}})).wine||{},r={};for(const e of t)o[e]&&!a[e]&&(r[e]=o[e]);if("drink_peak"in r){const t=Number(r.drink_from??a.drink_from)||0,e=Number(r.drink_until??a.drink_until)||9999;r.drink_peak=Math.min(e,Math.max(t,Number(r.drink_peak)))}if(!r[e])return void this.card.toast(s);await this.card.ws({type:"tapon/update_bottle",bottle_id:a.id,changes:r,same_wine:!0}),this.card.toast(i(r))}catch{}finally{this._busy=!1}}_renderService(t){const e=kt(t);return e.length||this.data.ai?B`<div class="service">
      ${e.length?e.map(t=>B`<span class="svc">${t}</span>`):B`<button class="btn small" ?disabled=${this._busy} @click=${this._estimateService}>✨ Come servirlo</button>`}
    </div>`:W}async _open(){this._busy=!0;try{const t=await this.card.ws({type:"tapon/open_bottle",bottle_id:this.bottle.id});this.card.toast(`Segnata come aperta: ti ricordo di finirla entro ${t.limit} giorni`),this._close()}finally{this._busy=!1}}_renderRate(){return B`<div class="rate">
      ${this.bottle.reserved_for?B`<div class="note">🔒 Era riservata: «${this.bottle.reserved_for}»</div>`:W}
      <div class="rate-q">Com'era?</div>
      ${Dt(this._stars,t=>this._stars=t,!0)}
      <div class="rate-hint">${["Tocca le stelle per votarla","Deludente","Così così","Buono","Molto buono","Eccezionale"][this._stars||0]}</div>
      <textarea class="tasting" rows="3" maxlength="1000"
        placeholder="Note di degustazione (facoltative): profumi, con cosa l'avete bevuta, se ricomprarla…"
        .value=${this._tasting} @input=${t=>this._tasting=t.target.value}></textarea>
      <div class="note">Il voto resta nello storico e aiuta gli abbinamenti a proporti i vini che ti sono piaciuti di più.</div>
    </div>`}_renderRateFoot(){const t=!this._stars&&!this._tasting.trim();return B`<div class="dialog-foot">
      <button class="btn" ?disabled=${this._busy} @click=${()=>this._rating=!1}>Annulla</button>
      <button class="btn primary" ?disabled=${this._busy} @click=${()=>this._remove("drank",!0)}>
        ${t?"Togli senza voto":"🍷 Salva e togli"}
      </button>
    </div>`}_renderEdit(){const t=this._sameWineCount();return B`
      ${It(this.data,this._values,(t,e)=>this._values={...this._values,[t]:e})}
      ${t>1?B`<label class="check"><input type="checkbox" .checked=${this._sameWine}
            @change=${t=>this._sameWine=t.target.checked} />
            Applica a tutte le ${t} bottiglie di questo vino</label>`:W}
    `}_renderEditFoot(){return B`<div class="dialog-foot">
      <button class="btn" @click=${()=>this._editing=!1}>Annulla</button>
      <button class="btn primary" ?disabled=${this._busy} @click=${this._saveEdit}>Salva</button>
    </div>`}};Ut.styles=[Et,r`
      .maturity {
        margin: 6px 0 14px;
      }
      .maturity.empty {
        display: flex;
        justify-content: flex-end;
      }
      .m-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .m-label {
        font-weight: 600;
        font-size: 0.92em;
      }
      .maturity.ph-peak .m-label {
        color: #e3b341;
      }
      .maturity.ph-declining .m-label,
      .maturity.ph-past .m-label {
        color: #ef9a6a;
      }
      .maturity.ph-young .m-label {
        color: #90caf9;
      }
      .m-bar {
        position: relative;
        height: 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #5c6bc0 0%, #7cb342 30%, #e3b341 55%, #e3b341 62%, #ef6c00 85%, #8d2b2b 100%);
        opacity: 0.85;
      }
      .m-peak {
        position: absolute;
        top: -3px;
        width: 2px;
        height: 14px;
        margin-left: -1px;
        background: rgba(255, 255, 255, 0.7);
      }
      .m-today {
        position: absolute;
        top: 50%;
        width: 14px;
        height: 14px;
        margin: -7px 0 0 -7px;
        border-radius: 50%;
        background: #fff;
        border: 3px solid #1c1a1a;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6), 0 2px 6px rgba(0, 0, 0, 0.6);
      }
      .m-peak-label {
        position: absolute;
        transform: translateX(-50%);
      }
      .m-scale {
        position: relative;
        display: flex;
        justify-content: space-between;
        font-size: 0.75em;
        color: var(--secondary-text-color);
        margin-top: 6px;
        font-variant-numeric: tabular-nums;
      }
      .service {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 4px 0 12px;
      }
      .svc {
        padding: 5px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--tb-line, var(--divider-color));
        font-size: 0.88em;
      }
      .badge.opened {
        background: rgba(129, 199, 132, 0.2);
        color: #a5d6a7;
      }
      .badge.opened.today {
        background: rgba(227, 179, 65, 0.22);
        color: #e3b341;
      }
      .badge.opened.late {
        background: rgba(229, 57, 53, 0.22);
        color: #ef7a77;
      }
      .res-btn {
        margin-left: auto;
      }
      .reserved {
        margin: 2px 0 14px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--tb-line, var(--divider-color));
      }
      .reserve-form {
        margin: 2px 0 14px;
        padding: 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
      }
      .reserve-form .row {
        display: flex;
        gap: 6px;
      }
      .past {
        margin: 2px 0 14px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(227, 179, 65, 0.08);
        border: 1px solid rgba(227, 179, 65, 0.22);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        font-size: 0.92em;
      }
      .past-head {
        color: var(--secondary-text-color);
      }
      .past-notes {
        width: 100%;
        font-style: italic;
        color: var(--secondary-text-color);
      }
      .rate {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        text-align: center;
        padding: 4px 0;
      }
      .rate-q {
        font-family: "Playfair Display", Georgia, serif;
        font-size: 1.35em;
      }
      .rate-hint {
        min-height: 1.2em;
        color: #e3b341;
        font-size: 0.9em;
      }
      .tasting {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.04);
        color: var(--primary-text-color);
        font: inherit;
        resize: vertical;
      }
      .hero {
        display: flex;
        gap: 18px;
        align-items: flex-end;
        padding: 26px 24px 18px;
        background:
          radial-gradient(90% 120% at 15% 100%, rgba(155, 44, 63, 0.25), transparent 60%),
          radial-gradient(60% 80% at 100% 0%, rgba(216, 180, 106, 0.08), transparent 60%);
        border-bottom: 1px solid var(--tb-line);
        position: relative;
      }
      .hero .close {
        position: absolute;
        top: 16px;
        right: 16px;
      }
      .hero-bottle {
        width: 62px;
        flex: none;
        filter: drop-shadow(0 12px 14px rgba(0, 0, 0, 0.6));
      }
      .hero-bottle svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .hero-text {
        min-width: 0;
        padding-bottom: 6px;
      }
      .producer {
        color: var(--tb-ink-2);
        margin-top: 4px;
      }
      .vintage {
        font-family: var(--tb-serif);
        font-size: 2.1em;
        color: var(--tb-gold);
        line-height: 1;
        margin-top: 10px;
      }
      .badges {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 10px;
      }
      .badge {
        border-radius: 10px;
        padding: 2px 9px;
        font-size: 0.8em;
        color: #111;
        font-weight: 600;
      }
      .badge.warn {
        background: #ffa000;
      }
      .badge.bad {
        background: #e53935;
        color: #fff;
      }
      .where {
        font-size: 0.85em;
        color: var(--tb-ink-2);
      }
      .facts {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 4px 12px;
        margin: 0 0 12px;
        font-size: 0.92em;
      }
      dt {
        color: var(--tb-ink-2);
        font-size: 0.85em;
        letter-spacing: 0.04em;
      }
      dd {
        margin: 0;
        white-space: pre-wrap;
      }
      .label-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid var(--tb-line);
        background: rgba(255, 255, 255, 0.025);
        text-align: center;
      }
      .label.qr,
      .label.qr30 {
        max-width: 140px;
        padding: 6px;
      }
      .label {
        width: 100%;
        max-width: 300px;
        background: #fff;
        border-radius: 4px;
        image-rendering: pixelated;
      }
      .row,
      .reasons {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .reasons {
        margin-top: 12px;
      }
      .check {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-top: 12px;
        font-size: 0.9em;
      }
    `],t([bt({attribute:!1})],Ut.prototype,"card",void 0),t([bt({attribute:!1})],Ut.prototype,"data",void 0),t([bt({attribute:!1})],Ut.prototype,"bottle",void 0),t([gt()],Ut.prototype,"_label",void 0),t([gt()],Ut.prototype,"_editing",void 0),t([gt()],Ut.prototype,"_values",void 0),t([gt()],Ut.prototype,"_sameWine",void 0),t([gt()],Ut.prototype,"_otherReason",void 0),t([gt()],Ut.prototype,"_busy",void 0),t([gt()],Ut.prototype,"_rating",void 0),t([gt()],Ut.prototype,"_stars",void 0),t([gt()],Ut.prototype,"_tasting",void 0),t([gt()],Ut.prototype,"_reserving",void 0),t([gt()],Ut.prototype,"_resFor",void 0),t([gt()],Ut.prototype,"_resUntil",void 0),Ut=t([pt("tb-bottle-dialog")],Ut);let jt=class extends dt{constructor(){super(...arguments),this._drafts={},this._open=null}_close(){this.dispatchEvent(new CustomEvent("close"))}_draft(t){return this._drafts[t.id]||{name:t.name,shelves:[...vt(t)]}}_edit(t,e){const i=this._draft(t),s={name:i.name,shelves:[...i.shelves]};e(s),this._drafts={...this._drafts,[t.id]:s}}_setShelfCount(t,e){this._edit(t,t=>{e=Math.max(1,Math.min(30,e));const i=t.shelves[t.shelves.length-1]||6;for(;t.shelves.length<e;)t.shelves.push(i);t.shelves.length=e})}_setShelf(t,e,i){this._edit(t,t=>t.shelves[e]=Math.max(1,Math.min(30,i)))}_setAll(t,e){this._edit(t,t=>t.shelves=t.shelves.map(()=>Math.max(1,Math.min(30,e))))}_count(t){return this.data.bottles.filter(e=>e.rack_id===t).length}async _save(t){const e=this._draft(t),i=await this.card.ws({type:"tapon/save_rack",rack:{id:t.id,name:e.name,shelves:e.shelves}}),s={...this._drafts};delete s[t.id],this._drafts=s,this.card.toast(i.displaced?`Salvato. ${i.displaced} bottiglie sono finite in "Da sistemare".`:"Scaffale salvato")}async _delete(t){const e=this._count(t.id);confirm(`Eliminare "${t.name}"?${e?` Le sue ${e} bottiglie restano in cantina, in "Da sistemare".`:""}`)&&(await this.card.ws({type:"tapon/delete_rack",rack_id:t.id}),this.card.toast("Scaffale eliminato"))}async _add(){const t=await this.card.ws({type:"tapon/save_rack",rack:{name:`Scaffale ${this.data.racks.length+1}`,shelves:[8,8,8,8,8]}});this._open=t.rack.id}async _setting(t,e){await this.card.ws({type:"tapon/update_settings",[t]:e})}_stepper(t,e){return B`<span class="stepper">
      <button @click=${()=>e(t-1)} aria-label="meno">−</button>
      <span>${t}</span>
      <button @click=${()=>e(t+1)} aria-label="più">+</button>
    </span>`}_preview(t){const e=Math.max(...t);return B`<div class="preview">
      ${t.map(t=>B`<div class="pv-shelf">
        <div class="pv-row" style="grid-template-columns: repeat(${t}, 1fr); width: ${t/e*100}%">
          ${Array.from({length:t},()=>B`<i></i>`)}
        </div>
        <div class="pv-board"></div>
      </div>`)}
    </div>`}_renderRack(t){const e=this._draft(t),i=!!this._drafts[t.id],s=this._open===t.id||i,a=e.shelves.every(t=>t===e.shelves[0]),o=e.shelves.reduce((t,e)=>t+e,0);return B`<div class="rack ${s?"open":""}">
      <button class="rack-sum" @click=${()=>this._open=s&&!i?null:t.id}>
        <span class="rack-name">${e.name}</span>
        <span class="note">${e.shelves.length} mensole · ${o} posti · ${this._count(t.id)} bottiglie</span>
        <span class="chev">${s?"▴":"▾"}</span>
      </button>
      ${s?B`<div class="rack-edit">
            <div class="cols">
              <div class="controls">
                <label class="field">Nome
                  <input .value=${e.name} @input=${e=>this._edit(t,t=>t.name=e.target.value)} />
                </label>
                <div class="line"><span>Mensole</span>${this._stepper(e.shelves.length,e=>this._setShelfCount(t,e))}</div>
                <div class="line">
                  <span>Bottiglie per mensola${a?"":B` <em class="note">(diverse)</em>`}</span>
                  ${this._stepper(a?e.shelves[0]:Math.max(...e.shelves),e=>this._setAll(t,e))}
                </div>
                <details ?open=${!a}>
                  <summary>Personalizza ogni mensola</summary>
                  ${e.shelves.map((i,s)=>B`<div class="line small">
                    <span>Mensola ${s+1}${0===s?" (in alto)":s===e.shelves.length-1?" (in basso)":""}</span>
                    ${this._stepper(i,e=>this._setShelf(t,s,e))}
                  </div>`)}
                </details>
              </div>
              ${this._preview(e.shelves)}
            </div>
            <div class="rack-foot">
              <button class="btn small danger" @click=${()=>this._delete(t)}>Elimina scaffale</button>
              <span>
                ${i?B`<button class="btn small" @click=${()=>{const e={...this._drafts};delete e[t.id],this._drafts=e}}>Annulla</button>`:W}
                <button class="btn small primary" ?disabled=${!i} @click=${()=>this._save(t)}>Salva</button>
              </span>
            </div>
          </div>`:W}
    </div>`}async _inventory(t){await this.card.ws({type:"tapon/inventory_start",rack_id:t}),this.card.toast("Inventario avviato: scansiona le bottiglie"),this._close()}render(){const t=this.data.settings,e=this.data.racks.reduce((t,e)=>t+mt(e),0);return B`
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <div class="dialog-head">
            <div>
              <div class="eyebrow">La tua cantina</div>
              <div class="dialog-title">Scaffali e impostazioni</div>
            </div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="section" style="margin-top:4px">Scaffali · ${e} posti</div>
            ${this.data.racks.map(t=>this._renderRack(t))}
            <button class="btn" @click=${this._add}>＋ Nuovo scaffale</button>

            <div class="section">Etichette</div>
            <div class="types" style="margin-bottom:12px">
              ${[["qr","Solo QR · 23 × 23 mm"],["qr30","Solo QR · 30 × 30 mm"],["full","QR e dati del vino · 50 × 30 mm"]].map(([e,i])=>B`<button class="chip ${t.label_format===e?"active":""}"
                  @click=${()=>this._setting("label_format",e)}>${i}</button>`)}
            </div>
            <label class="check">
              <input type="checkbox" .checked=${t.auto_labels}
                @change=${t=>this._setting("auto_labels",t.target.checked)} />
              Stampa l'etichetta QR quando aggiungo una bottiglia
            </label>

            <div class="section">Controllo inventario</div>
            <div class="note" style="margin-bottom:8px">
              Scansiona una per una le bottiglie (con il telefono o con lo scanner): in questa modalità
              non viene tolto nulla, alla fine vedi cosa manca, cosa è fuori posto e cosa risultava già bevuto.
            </div>
            <div class="types" style="margin-bottom:12px">
              <button class="chip" @click=${()=>this._inventory(null)}>Tutta la cantina</button>
              ${this.data.racks.length>1?this.data.racks.map(t=>B`<button class="chip" @click=${()=>this._inventory(t.id)}>Solo ${t.name}</button>`):W}
            </div>

            <div class="section">Finestra di beva</div>
            <div class="note" style="margin-bottom:8px">Avvisami prima che si chiuda:</div>
            <div class="types">
              ${[[90,"3 mesi"],[180,"6 mesi"],[365,"1 anno"]].map(([e,i])=>B`<button class="chip ${t.alert_days===e?"active":""}"
                  @click=${()=>this._setting("alert_days",e)}>${i}</button>`)}
            </div>
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}};jt.styles=[Et,r`
      .rack {
        border: 1px solid var(--tb-line);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.025);
        margin-bottom: 10px;
        overflow: hidden;
      }
      .rack.open {
        background: rgba(255, 255, 255, 0.04);
      }
      .rack-sum {
        width: 100%;
        display: flex;
        align-items: baseline;
        gap: 10px;
        padding: 14px 16px;
        background: none;
        border: none;
        color: var(--tb-ink);
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .rack-name {
        font-family: var(--tb-serif);
        font-size: 1.15em;
        font-weight: 600;
      }
      .chev {
        margin-left: auto;
        color: var(--tb-ink-2);
      }
      .rack-edit {
        padding: 0 16px 14px;
      }
      .cols {
        display: grid;
        grid-template-columns: 1fr 160px;
        gap: 18px;
        align-items: start;
      }
      .controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        font-size: 0.92em;
      }
      .line.small {
        font-size: 0.85em;
        margin-top: 8px;
        color: var(--tb-ink-2);
      }
      details summary {
        cursor: pointer;
        color: var(--tb-gold);
        font-size: 0.85em;
      }
      .preview {
        padding: 12px 10px 10px;
        border-radius: 12px;
        background: linear-gradient(180deg, #1d1a1a, #110f10);
        border: 1px solid var(--tb-line);
        display: flex;
        flex-direction: column;
        gap: 7px;
        align-items: center;
      }
      .pv-shelf {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .pv-row {
        display: grid;
        gap: 2px;
      }
      .pv-row i {
        display: block;
        height: 12px;
        border-radius: 2px 2px 1px 1px;
        background: linear-gradient(180deg, rgba(216, 180, 106, 0.25), rgba(155, 44, 63, 0.55));
      }
      .pv-board {
        width: 100%;
        height: 2px;
        margin-top: 2px;
        background: rgba(255, 255, 255, 0.18);
        border-radius: 1px;
      }
      .rack-foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 14px;
      }
      .check {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      @media (max-width: 480px) {
        .cols {
          grid-template-columns: 1fr;
        }
      }
    `],t([bt({attribute:!1})],jt.prototype,"card",void 0),t([bt({attribute:!1})],jt.prototype,"data",void 0),t([gt()],jt.prototype,"_drafts",void 0),t([gt()],jt.prototype,"_open",void 0),jt=t([pt("tb-racks-dialog")],jt);let qt=class extends dt{constructor(){super(...arguments),this._items=null,this._editing=null,this._stars=null,this._tasting=""}connectedCallback(){super.connectedCallback(),this._load()}async _load(){const t=await this.card.ws({type:"tapon/get_history"});this._items=t.history}_close(){this.dispatchEvent(new CustomEvent("close"))}async _restore(t){const e=await this.card.ws({type:"tapon/restore",history_id:t.history_id});this.card.toast(e.bottle.rack_id?"Rimessa al suo posto":'Rimessa in cantina, in "Da sistemare"'),this._load()}_edit(t){this._editing=this._editing===t.history_id?null:t.history_id,this._stars=t.rating??null,this._tasting=t.tasting_notes||""}async _saveRating(t){const e=await this.card.ws({type:"tapon/rate_history",history_id:t.history_id,rating:this._stars,tasting_notes:this._tasting.trim()});this._editing=null,this.card.toast(e?.wishlisted?"Voto salvato. Era l'ultima: messa nei desideri da ricomprare ♡":"Voto salvato"),this._load()}render(){return B`
      ${Rt}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Bottiglie stappate e non solo</div><div class="dialog-title">Storico</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${null===this._items?B`<div class="note">Carico…</div>`:this._items.length?this._items.map(t=>this._renderItem(t)):B`<div class="note">Ancora nessuna bottiglia tolta dalla cantina.</div>`}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}_renderItem(t){const e="drank"===t.reason,i=this._editing===t.history_id;return B`<div class="item ${i?"open":""}">
      <div class="line">
        <span class="mini">${zt(t.type)}</span>
        <div class="text">
          <div>${_t(t)}</div>
          <div class="note">${this.data.reasons[t.reason]||t.reason} · ${new Date(t.removed_at).toLocaleDateString("it-IT")}
            ${t.producer?B` · ${t.producer}`:W}</div>
          ${e&&!i?B`<button class="vote" @click=${()=>this._edit(t)} title="Vota o scrivi una nota">
                ${t.rating?Dt(t.rating):B`<span class="add-vote">☆ Vota</span>`}
                ${t.tasting_notes?B`<span class="tn">«${t.tasting_notes}»</span>`:W}
              </button>`:W}
        </div>
        <button class="btn small" @click=${()=>this._restore(t)}>Rimetti</button>
      </div>
      ${i?B`<div class="editor">
            ${Dt(this._stars,t=>this._stars=t,!0)}
            <textarea rows="2" maxlength="1000" placeholder="Note di degustazione…" .value=${this._tasting}
              @input=${t=>this._tasting=t.target.value}></textarea>
            <div class="row">
              <button class="btn small" @click=${()=>this._editing=null}>Annulla</button>
              <button class="btn small primary" @click=${()=>this._saveRating(t)}>Salva</button>
            </div>
          </div>`:W}
    </div>`}};qt.styles=[Et,r`
      .item {
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .line {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .vote {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-top: 4px;
        padding: 0;
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        min-width: 0;
      }
      .add-vote {
        font-size: 0.82em;
        color: #e3b341;
      }
      .tn {
        font-size: 0.82em;
        font-style: italic;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 10px 0 4px;
      }
      .editor textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.04);
        color: var(--primary-text-color);
        font: inherit;
      }
      .editor .row {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        width: 100%;
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .mini {
        width: 14px;
        flex: none;
      }
      .mini svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .item {
        border-bottom-color: var(--tb-line) !important;
      }
    `],t([bt({attribute:!1})],qt.prototype,"card",void 0),t([bt({attribute:!1})],qt.prototype,"data",void 0),t([gt()],qt.prototype,"_items",void 0),t([gt()],qt.prototype,"_editing",void 0),t([gt()],qt.prototype,"_stars",void 0),t([gt()],qt.prototype,"_tasting",void 0),qt=t([pt("tb-history-dialog")],qt);const Lt=["Antipasto","Primo","Secondo","Dolce"],Ft=["Brasato","Pesce al forno","Crudi di mare","Pizza","Formaggi stagionati","Risotto ai funghi","Dolce"];let Ht=class extends dt{constructor(){super(...arguments),this._dish="",this._busy=!1,this._result=null,this._asked="",this._mode="dish",this._courses=["","","",""]}firstUpdated(){this.renderRoot.querySelector("input")?.focus()}_close(){this.dispatchEvent(new CustomEvent("close"))}async _ask(t=this._dish){if((t=t.trim())&&!this._busy){this._dish=t,this._busy=!0,this._result=null;try{this._result=await this.card.ws({type:"tapon/pair",dish:t}),this._asked=t}catch{}finally{this._busy=!1}}}async _askMenu(){const t=this._courses.map(t=>t.trim()).filter(Boolean);if(t.length&&!this._busy){this._busy=!0,this._result=null;try{this._result=await this.card.ws({type:"tapon/pair",courses:t}),this._asked=t.join(" · ")}catch{}finally{this._busy=!1}}}_setMode(t){this._mode!==t&&(this._mode=t,this._result=null)}async _light(t,e){t.length&&(await this.card.ws({type:"tapon/highlight",source:e,query:this._asked,groups:t}),this.card.toast("Illuminate sullo scaffale: si spengono quando ne prendi una"),this._close())}_open(t){this.dispatchEvent(new CustomEvent("open-bottle",{detail:{bottleId:t.bottle_ids[0]}}))}render(){const t=this._result;return B`
      ${Rt}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Dalla tua cantina</div><div class="dialog-title">Cosa si mangia?</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="modes">
              <button class="chip ${"dish"===this._mode?"active":""}" @click=${()=>this._setMode("dish")}>Un piatto</button>
              <button class="chip ${"menu"===this._mode?"active":""}" @click=${()=>this._setMode("menu")}>Menu della serata</button>
            </div>
            ${"dish"===this._mode?this._renderDishForm(t):this._renderMenuForm()}
            ${this._busy?B`<div class="note waiting">Il sommelier sta guardando gli scaffali…</div>`:W}
            ${t?t.courses?this._renderMenuResult(t):this._renderResult(t):W}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}_renderDishForm(t){return B`
      <form class="ask" @submit=${t=>{t.preventDefault(),this._ask()}}>
        <input class="dish" type="text" placeholder="Es. tagliata al rosmarino, spaghetti alle vongole…"
          .value=${this._dish} maxlength="300"
          @input=${t=>this._dish=t.target.value} />
        <button class="btn primary" type="submit" ?disabled=${this._busy||!this._dish.trim()}>
          ${this._busy?"Ci penso…":"Consiglia"}
        </button>
      </form>
      ${t||this._busy?W:B`<div class="quick">
            ${Ft.map(t=>B`<button class="chip" @click=${()=>this._ask(t)}>${t}</button>`)}
          </div>`}
    `}_renderMenuForm(){const t=(t,e)=>this._courses=this._courses.map((i,s)=>s===t?e:i),e=this._courses.some(t=>t.trim());return B`
      <form class="menu" @submit=${t=>{t.preventDefault(),this._askMenu()}}>
        ${this._courses.map((e,i)=>B`<div class="course">
          <span class="num">${i+1}</span>
          <input class="dish" type="text" maxlength="200" .value=${e}
            placeholder=${`${Lt[i]||"Portata"}${0===i?", es. crudi di mare":1===i?", es. risotto ai funghi":2===i?", es. brasato":", es. crostata"}`}
            @input=${e=>t(i,e.target.value)} />
          ${this._courses.length>1?B`<button type="button" class="close mini-x" title="Togli portata"
                @click=${()=>this._courses=this._courses.filter((t,e)=>e!==i)}>✕</button>`:W}
        </div>`)}
        <div class="menu-actions">
          ${this._courses.length<8?B`<button type="button" class="btn small" @click=${()=>this._courses=[...this._courses,""]}>＋ Portata</button>`:B`<span></span>`}
          <button class="btn primary" type="submit" ?disabled=${this._busy||!e}>
            ${this._busy?"Ci penso…":"Componi i vini"}
          </button>
        </div>
        <div class="note">Lascia vuote le portate che non ci sono.</div>
      </form>
    `}_wineCard(t,e={}){const i={closing:"Da bere presto",past:"Oltre la finestra",wait:"Ancora giovane"},s=e.reason??t.reason;return B`<button class="pick ${e.best?"best":""} ${e.compact?"compact":""}" @click=${()=>this._open(t)}>
      <span class="mini">${zt(t.type,"closing"===t.status||"past"===t.status?t.status:null)}</span>
      <div class="text">
        <div class="wine">
          ${e.best?B`<span class="badge">Il migliore</span>`:W}
          ${_t(t)}
          ${i[t.status]?B`<span class="state ${t.status}">${i[t.status]}</span>`:W}
          ${t.opened?B`<span class="state open">🍾 già aperta</span>`:W}
        </div>
        ${t.producer||t.rating?B`<div class="note">${t.producer||""}${t.rating?B`<span class="your">${t.producer?" · ":""}il tuo voto ${Dt(t.rating)} ${Ot(t.rating)}</span>`:W}</div>`:W}
        ${s?B`<div class="reason">${s}</div>`:W}
        ${kt(t).length?B`<div class="svc-line">${kt(t).join(" · ")}</div>`:W}
        <div class="where">📍 ${t.locations[0]}${t.bottles>1?B` · ${t.bottles} bottiglie`:W}</div>
      </div>
      <span class="go">›</span>
    </button>`}_renderMenuResult(t){const e=t.courses||[];return B`
      <div class="eyebrow small">Il percorso</div>
      <div class="path">
        ${e.map((t,e)=>B`<div class="step">
          <div class="step-head"><span class="num" style="--c:${wt[e%wt.length]}">${e+1}</span>${t.course.charAt(0).toUpperCase()+t.course.slice(1)}</div>
          ${t.wine?this._wineCard(t.wine,{compact:!0,reason:t.reason}):B`<div class="note nothing">Nessun vino della cantina è adatto a questa portata.</div>`}
        </div>`)}
      </div>
      ${e.some(t=>t.wine)?B`<button class="btn primary light" @click=${()=>this._light(e.map((t,e)=>({label:t.course,color:wt[e%wt.length],bottle_ids:t.wine?.bottle_ids||[]})).filter(t=>t.bottle_ids.length),"menu")}>💡 Illumina il percorso sullo scaffale</button>`:W}
      ${t.one?B`<div class="eyebrow small">Oppure un vino per tutta la cena</div>${this._wineCard(t.one,{best:!0})}
            <button class="btn small light" @click=${()=>this._light([{label:"Tutta la cena",color:xt,bottle_ids:t.one.bottle_ids}],"pair")}>💡 Illumina questo</button>`:W}
      ${t.advice?B`<div class="advice ${t.source}">${"ai"===t.source?"🍷 ":"ℹ️ "}${t.advice}</div>`:W}
    `}_renderResult(t){return B`
      ${(t.picks||[]).length?B`<div class="eyebrow small">Per «${this._asked}»</div>`:B`<div class="note">Nessun vino della cantina è davvero adatto a «${this._asked}».</div>`}
      ${(t.picks||[]).map((t,e)=>this._wineCard(t,{best:0===e}))}
      ${(t.picks||[]).length?B`<button class="btn primary light" @click=${()=>this._light([{label:this._asked,color:xt,bottle_ids:(t.picks||[]).flatMap(t=>t.bottle_ids)}],"pair")}>
            💡 Illumina sullo scaffale</button>`:W}
      ${t.advice?B`<div class="advice ${t.source}">${"ai"===t.source?"🍷 ":"ℹ️ "}${t.advice}</div>`:W}
    `}};Ht.styles=[Et,r`
      .ask {
        display: flex;
        gap: 8px;
      }
      .dish {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.04);
        color: var(--primary-text-color);
        font: inherit;
      }
      .modes {
        display: flex;
        gap: 6px;
        margin-bottom: 12px;
      }
      .menu {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .course {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .light {
        display: block;
        margin: 4px 0 12px auto;
      }
      .step-head .num {
        background: color-mix(in srgb, var(--c) 22%, transparent);
        color: var(--c);
        box-shadow: 0 0 10px -2px var(--c);
      }
      .num {
        flex: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: inline-grid;
        place-items: center;
        font-size: 0.8em;
        font-weight: 600;
        background: rgba(227, 179, 65, 0.16);
        color: #e3b341;
      }
      .mini-x {
        flex: none;
        width: 30px;
        height: 30px;
        font-size: 0.8em;
      }
      .menu-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
      }
      .path {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }
      .step-head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        margin: 6px 0;
      }
      .pick.compact {
        margin-left: 32px;
        width: calc(100% - 32px);
        margin-bottom: 4px;
      }
      .nothing {
        margin-left: 32px;
      }
      .your {
        white-space: nowrap;
      }
      .quick {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 12px;
      }
      .waiting {
        margin-top: 16px;
        animation: pulse 1.4s ease-in-out infinite;
      }
      @keyframes pulse {
        50% {
          opacity: 0.45;
        }
      }
      .eyebrow.small {
        margin: 18px 0 8px;
      }
      .pick {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        text-align: left;
        margin-bottom: 10px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.03);
        color: inherit;
        font: inherit;
        cursor: pointer;
      }
      .pick:hover {
        background: rgba(255, 255, 255, 0.06);
      }
      .pick.best {
        border-color: rgba(201, 162, 39, 0.55);
        background: linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(255, 255, 255, 0.02));
      }
      .mini {
        width: 22px;
        flex: none;
      }
      .mini svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .wine {
        font-weight: 600;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }
      .badge,
      .state {
        font-size: 0.72em;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        letter-spacing: 0.02em;
      }
      .badge {
        background: rgba(201, 162, 39, 0.22);
        color: #e8c766;
      }
      .state {
        background: rgba(255, 255, 255, 0.08);
        color: var(--secondary-text-color);
      }
      .state.open {
        background: rgba(129, 199, 132, 0.2);
        color: #a5d6a7;
      }
      .svc-line {
        margin-top: 4px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      .state.closing {
        background: rgba(201, 162, 39, 0.18);
        color: #e8c766;
      }
      .state.past {
        background: rgba(229, 57, 53, 0.18);
        color: #ef7a77;
      }
      .reason {
        margin-top: 6px;
        line-height: 1.4;
      }
      .where {
        margin-top: 6px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      .go {
        font-size: 1.6em;
        color: var(--secondary-text-color);
      }
      .advice {
        margin-top: 6px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.04);
        font-size: 0.9em;
        line-height: 1.4;
      }
      .advice.local {
        color: var(--secondary-text-color);
      }
    `],t([bt({attribute:!1})],Ht.prototype,"card",void 0),t([bt({attribute:!1})],Ht.prototype,"data",void 0),t([gt()],Ht.prototype,"_dish",void 0),t([gt()],Ht.prototype,"_busy",void 0),t([gt()],Ht.prototype,"_result",void 0),t([gt()],Ht.prototype,"_asked",void 0),t([gt()],Ht.prototype,"_mode",void 0),t([gt()],Ht.prototype,"_courses",void 0),Ht=t([pt("tb-pair-dialog")],Ht);let Bt=class extends dt{_close(){this.dispatchEvent(new CustomEvent("close"))}async _remove(t){await this.card.ws({type:"tapon/wishlist_remove",wish_id:t.id}),this.card.toast(`${_t(t)} tolto dai desideri`)}render(){const t=this.data.wishlist||[];return B`
      ${Rt}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Da comprare</div><div class="dialog-title">Lista dei desideri</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${t.length?t.map(t=>this._renderWish(t)):B`<div class="empty-wish">
                  <div class="big">♡</div>
                  <div>Ancora vuota.</div>
                  <div class="note">Aggiungi i vini assaggiati al ristorante o da amici: basta una foto dell'etichetta.
                    Anche quando finisci l'ultima bottiglia di un vino a cui hai dato 4 o 5 stelle, finisce qui da solo.</div>
                </div>`}
          </div>
          <div class="dialog-foot">
            <button class="btn" @click=${this._close}>Chiudi</button>
            <button class="btn primary" @click=${()=>this.dispatchEvent(new CustomEvent("add-wish"))}>＋ Aggiungi desiderio</button>
          </div>
        </div>
      </div>
    `}_renderWish(t){const e=this.data.types[t.type];return B`<div class="wish">
      <span class="mini">${zt(t.type)}</span>
      <div class="text">
        <div class="title">
          ${_t(t)}
          ${"rebuy"===t.source?B`<span class="tag">Da ricomprare</span>`:W}
        </div>
        <div class="note">${[t.producer,e?.label,t.region].filter(Boolean).join(" · ")}</div>
        ${t.rating?B`<div class="note">Il tuo voto ${Dt(t.rating)}</div>`:W}
        ${t.where?B`<div class="note">📍 ${t.where}</div>`:W}
        ${t.wish_notes?B`<div class="note italic">${t.wish_notes}</div>`:W}
      </div>
      <div class="acts">
        <button class="btn small primary" title="L'ho comprato: mettilo in cantina"
          @click=${()=>this.dispatchEvent(new CustomEvent("buy",{detail:{wish:t}}))}>🛒 Comprato</button>
        <button class="btn small" title="Togli dalla lista" @click=${()=>this._remove(t)}>✕</button>
      </div>
    </div>`}};Bt.styles=[Et,r`
      .wish {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid var(--tb-line, var(--divider-color));
      }
      .mini {
        width: 18px;
        flex: none;
      }
      .mini svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .title {
        font-weight: 600;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .tag {
        font-size: 0.72em;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        background: rgba(227, 179, 65, 0.2);
        color: #e3b341;
      }
      .italic {
        font-style: italic;
      }
      .acts {
        display: flex;
        gap: 6px;
        flex: none;
      }
      .empty-wish {
        text-align: center;
        padding: 18px 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .empty-wish .big {
        font-size: 2.4em;
        color: #e3b341;
      }
    `],t([bt({attribute:!1})],Bt.prototype,"card",void 0),t([bt({attribute:!1})],Bt.prototype,"data",void 0),Bt=t([pt("tb-wishlist-dialog")],Bt);let Vt=class extends dt{constructor(){super(...arguments),this._history=[],this._done=new Set,this._busy=!1}connectedCallback(){super.connectedCallback(),this.report?.found_taken.length&&this.card.ws({type:"tapon/get_history"}).then(t=>this._history=t.history)}_close(){this.dispatchEvent(new CustomEvent("close"))}async _removeMissing(t){this._busy=!0;try{const e=await this.card.ws({type:"tapon/remove_bottles",bottle_ids:t,reason:"missing"});t.forEach(t=>this._done.add(t)),this._done=new Set(this._done),this.card.toast(`${e.removed} bottiglie tolte come "non trovate": le ritrovi nello storico`)}finally{this._busy=!1}}async _restore(t){this._busy=!0;try{for(const e of t)await this.card.ws({type:"tapon/restore",history_id:e});t.forEach(t=>this._done.add(t)),this._done=new Set(this._done),this.card.toast(t.length>1?`${t.length} bottiglie rimesse in cantina`:"Rimessa in cantina")}finally{this._busy=!1}}render(){const t=this.report,e=new Map(this.data.bottles.map(t=>[t.id,t])),i=t.missing.filter(t=>!this._done.has(t)).map(t=>e.get(t)).filter(Boolean),s=t.misplaced.map(t=>e.get(t)).filter(Boolean),a=t.found_taken.filter(t=>!this._done.has(t)).map(t=>this._history.find(e=>e.history_id===t)).filter(Boolean),o=this.data.racks.find(e=>e.id===t.rack_id),r=!(i.length||s.length||t.found_taken.length||t.unknown);return B`
      ${Rt}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Inventario${o?` · ${o.name}`:""}</div>
              <div class="dialog-title">${t.seen} su ${t.total} trovate</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${r?B`<div class="ok">✓ Tutto in ordine: la cantina corrisponde all'app.</div>`:W}

            ${i.length?B`<div class="section">Non trovate (${i.length})</div>
                  <div class="note">Sono nell'app ma non le hai scansionate. Se sono davvero sparite, toglile.</div>
                  ${i.map(t=>this._row(t,$t(t,this.data.racks)))}
                  <button class="btn small danger" ?disabled=${this._busy} @click=${()=>this._removeMissing(i.map(t=>t.id))}>
                    Togli tutte le ${i.length} come "non trovate"</button>`:W}

            ${a.length?B`<div class="section">Risultavano già tolte (${a.length})</div>
                  <div class="note">Le hai scansionate, quindi sono ancora in cantina: rimettile.</div>
                  ${a.map(t=>this._row(t,`Tolta il ${new Date(t.removed_at).toLocaleDateString("it-IT")}`))}
                  <button class="btn small primary" ?disabled=${this._busy}
                    @click=${()=>this._restore(a.map(t=>t.history_id))}>Rimetti in cantina</button>`:W}

            ${s.length?B`<div class="section">Fuori posto (${s.length})</div>
                  <div class="note">Trovate in ${o?.name||"questo scaffale"}, ma registrate altrove. Tocca per aprirle e spostarle.</div>
                  ${s.map(t=>this._row(t,`Registrata in: ${$t(t,this.data.racks)}`,!0))}`:W}

            ${t.unknown?B`<div class="section">Codici sconosciuti</div>
                  <div class="note">${t.unknown} QR non corrispondono a nessuna bottiglia: forse etichette vecchie da sostituire.</div>`:W}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}_row(t,e,i=!1){return B`<div class="row ${i?"link":""}"
      @click=${i?()=>this.dispatchEvent(new CustomEvent("open-bottle",{detail:{bottleId:t.id}})):null}>
      <span class="mini">${zt(t.type)}</span>
      <div class="text"><div>${_t(t)}${t.producer?B` <span class="note">· ${t.producer}</span>`:W}</div>
        <div class="note">${e}</div></div>
      ${i?B`<span class="go">›</span>`:W}
    </div>`}};Vt.styles=[Et,r`
      .ok {
        padding: 14px;
        border-radius: 12px;
        background: rgba(46, 125, 50, 0.16);
        color: #a5d6a7;
        text-align: center;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 7px 0;
        border-bottom: 1px solid var(--tb-line, var(--divider-color));
      }
      .row.link {
        cursor: pointer;
      }
      .mini {
        width: 12px;
        flex: none;
      }
      .mini svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .go {
        color: var(--secondary-text-color);
        font-size: 1.4em;
      }
      .note + .btn,
      .row + .btn {
        margin-top: 10px;
      }
    `],t([bt({attribute:!1})],Vt.prototype,"card",void 0),t([bt({attribute:!1})],Vt.prototype,"data",void 0),t([bt({attribute:!1})],Vt.prototype,"report",void 0),t([gt()],Vt.prototype,"_history",void 0),t([gt()],Vt.prototype,"_done",void 0),t([gt()],Vt.prototype,"_busy",void 0),Vt=t([pt("tb-inventory-dialog")],Vt);let Gt=class extends dt{constructor(){super(...arguments),this._text="",this._busy="",this._photo="",this._result=null}_close(){this.dispatchEvent(new CustomEvent("close"))}async _onPhoto(t){const e=t.target,i=e.files?.[0];e.value="",i&&(this._photo=await Nt(i),this._check({image:this._photo},"Leggo l'etichetta…"))}_onText(t){t.preventDefault();const e=this._text.trim();if(!e)return;const i=e.match(/\b(19|20)\d\d\b/),s=e.replace(/\b(19|20)\d\d\b/,"").replace(/\s+/g," ").trim();this._photo="",this._check({wine:{name:s,...i?{vintage:Number(i[0])}:{}}},"Cerco…")}async _check(t,e){this._busy=e,this._result=null;try{this._result=await this.card.ws({type:"tapon/check_wine",...t})}catch{}finally{this._busy=""}}async _wish(){const t=this._result.wine;await this.card.ws({type:"tapon/wishlist_add",wine:t,where:"",wish_notes:""}),this.card.toast(`${_t(t)} aggiunto ai desideri`),this._result={...this._result,wished:[{...t,match:"same",wish_id:"",source:"manual"}]}}async _light(){const t=this._result.cellar.flatMap(t=>t.bottle_ids);await this.card.ws({type:"tapon/highlight",source:"search",query:_t(this._result.wine),groups:[{label:_t(this._result.wine),color:xt,bottle_ids:t}]}),this._close()}render(){return B`
      ${Rt}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">In enoteca o al ristorante</div><div class="dialog-title">Ce l'ho già?</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="ask">
              <label class="shot ${this._photo?"has":""} ${this.data.ai?"":"off"}"
                title=${this.data.ai?"Fotografa l'etichetta":"Serve la chiave Gemini nelle opzioni"}>
                ${this._photo?B`<img src=${this._photo} alt="Etichetta" />`:B`<span>📷</span>`}
                <span class="shot-label">${this._photo?"Un'altra":"Fotografa l'etichetta"}</span>
                <input type="file" accept="image/*" capture="environment" ?disabled=${!this.data.ai||!!this._busy}
                  @change=${this._onPhoto} />
              </label>
              <form class="by-name" @submit=${this._onText}>
                <span class="note">oppure scrivi nome e annata</span>
                <div class="row">
                  <input class="dish" type="text" placeholder="Es. Barolo Cannubi 2016" .value=${this._text}
                    @input=${t=>this._text=t.target.value} />
                  <button class="btn primary" type="submit" ?disabled=${!!this._busy||!this._text.trim()}>Cerca</button>
                </div>
              </form>
            </div>
            ${this._busy?B`<div class="note waiting">${this._busy}</div>`:W}
            ${this._result?this._renderResult(this._result):W}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}_renderResult(t){const e=t.wine,i=t.cellar.filter(t=>"same"===t.match),s=i.reduce((t,e)=>t+e.bottles,0),a=t.drunk.find(t=>"same"===t.match)||t.drunk.find(t=>"vintage"===t.match);let o;o=s?["yes","Sì, ce l'hai: "+(1===s?"1 bottiglia":`${s} bottiglie`)]:t.cellar.some(t=>"vintage"===t.match)?["almost","Hai lo stesso vino, ma di un'altra annata"]:t.cellar.length?["almost","Non proprio questo, ma qualcosa di simile"]:a?["no","Non in cantina, ma l'hai già bevuto"]:["no","No, non ce l'hai"];const r=t.wished.some(t=>"same"===t.match);return B`
      <div class="seen">
        <span class="mini">${zt(e.type||"red")}</span>
        <div><div class="seen-title">${_t(e)}</div>
          <div class="note">${[e.producer,e.region].filter(Boolean).join(" · ")}</div></div>
      </div>
      <div class="verdict ${o[0]}">${o[1]}</div>

      ${t.cellar.length?B`<div class="section">In cantina</div>
            ${t.cellar.map(t=>B`<div class="found">
              <div><b>${_t(t)}</b>${t.producer?B` <span class="note">· ${t.producer}</span>`:W}
                ${"similar"===t.match?B`<span class="pill">simile</span>`:W}</div>
              <div class="note">${t.bottles} ${1===t.bottles?"bottiglia":"bottiglie"} · 📍 ${[...new Set(t.locations)].slice(0,2).join("; ")}
                ${t.reserved?B` · 🔒 ${t.reserved} riservat${1===t.reserved?"a":"e"}`:W}</div>
            </div>`)}`:W}

      ${t.drunk.length?B`<div class="section">Già bevuto</div>
            ${t.drunk.map(t=>B`<div class="found">
              <div><b>${_t(t)}</b> <span class="note">· ${1===t.times?"una volta":`${t.times} volte`}, l'ultima il
                ${new Date(t.last).toLocaleDateString("it-IT")}</span></div>
              ${t.rating?B`<div>${Dt(t.rating)} <span class="note">${Ot(t.rating)}</span></div>`:W}
              ${t.notes?B`<div class="note italic">«${t.notes}»</div>`:W}
            </div>`)}`:W}

      ${t.wished.length?B`<div class="section">Nella lista dei desideri</div>
            ${t.wished.map(t=>B`<div class="found"><b>${_t(t)}</b>
              ${"rebuy"===t.source?B`<span class="pill gold">da ricomprare</span>`:W}</div>`)}`:W}

      <div class="acts">
        ${t.cellar.length?B`<button class="btn small" @click=${this._light}>💡 Illumina</button>`:W}
        ${r?W:B`<button class="btn small" @click=${this._wish}>♡ Aggiungi ai desideri</button>`}
        <button class="btn small primary" @click=${()=>this.dispatchEvent(new CustomEvent("buy",{detail:{wine:e}}))}>
          🛒 L'ho comprato</button>
      </div>
    `}};Gt.styles=[Et,r`
      .ask {
        display: flex;
        gap: 14px;
        align-items: stretch;
      }
      .shot {
        flex: none;
        width: 110px;
        min-height: 110px;
        border-radius: 14px;
        border: 1px dashed rgba(255, 255, 255, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        font-size: 1.6em;
        text-align: center;
      }
      .shot.off {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .shot img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.45;
      }
      .shot-label {
        font-size: 0.5em;
        position: relative;
        padding: 0 6px;
      }
      .shot input {
        display: none;
      }
      .by-name {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
      }
      .by-name .row {
        display: flex;
        gap: 8px;
      }
      .dish {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid var(--tb-line, var(--divider-color));
        background: rgba(255, 255, 255, 0.04);
        color: var(--primary-text-color);
        font: inherit;
      }
      .waiting {
        margin-top: 16px;
        animation: pulse 1.4s ease-in-out infinite;
      }
      @keyframes pulse {
        50% {
          opacity: 0.45;
        }
      }
      .seen {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-top: 18px;
      }
      .mini {
        width: 18px;
        flex: none;
      }
      .mini svg {
        width: 100%;
        display: block;
        overflow: visible;
      }
      .seen-title {
        font-weight: 600;
        font-size: 1.05em;
      }
      .verdict {
        margin: 12px 0 4px;
        padding: 12px 14px;
        border-radius: 12px;
        font-weight: 600;
      }
      .verdict.yes {
        background: rgba(46, 125, 50, 0.18);
        color: #a5d6a7;
      }
      .verdict.almost {
        background: rgba(227, 179, 65, 0.14);
        color: #e3b341;
      }
      .verdict.no {
        background: rgba(255, 255, 255, 0.05);
      }
      .found {
        padding: 8px 0;
        border-bottom: 1px solid var(--tb-line, var(--divider-color));
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .pill {
        font-size: 0.72em;
        padding: 1px 7px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        margin-left: 6px;
      }
      .pill.gold {
        background: rgba(227, 179, 65, 0.2);
        color: #e3b341;
      }
      .italic {
        font-style: italic;
      }
      .acts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 14px;
      }
      @media (max-width: 480px) {
        .ask {
          flex-direction: column;
        }
        .shot {
          width: 100%;
          min-height: 90px;
        }
      }
    `],t([bt({attribute:!1})],Gt.prototype,"card",void 0),t([bt({attribute:!1})],Gt.prototype,"data",void 0),t([gt()],Gt.prototype,"_text",void 0),t([gt()],Gt.prototype,"_busy",void 0),t([gt()],Gt.prototype,"_photo",void 0),t([gt()],Gt.prototype,"_result",void 0),Gt=t([pt("tb-check-dialog")],Gt);let Wt=class extends dt{constructor(){super(...arguments),this._config={type:"custom:tapon-card"},this._data=null,this._error="",this._typeFilter="",this._query="",this._dialog=null,this._moving=null,this._toast="",this._subscribing=!1,this._startMove=t=>{this._moving=t.detail.bottle,this._dialog=null}}setConfig(t){this._config={...t}}static getStubConfig(){return{type:"custom:tapon-card"}}getCardSize(){return 8}getGridOptions(){return{columns:"full",min_columns:6}}connectedCallback(){super.connectedCallback(),this.hass&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}updated(t){t.has("hass")&&this.hass&&!this._unsub&&!this._subscribing&&this._subscribe()}async _subscribe(){if(!this._unsub&&!this._subscribing&&this.hass?.connection){this._subscribing=!0;try{this._unsub=await this.hass.connection.subscribeMessage(t=>{this._data=t,this._error=""},{type:"tapon/subscribe"})}catch(t){this._error="unknown_command"===t?.code?"L'integrazione Tapon non è installata: aggiungila da Impostazioni → Dispositivi e servizi.":`Impossibile caricare la cantina: ${t?.message||t}`}finally{this._subscribing=!1}}}async ws(t){try{return await this.hass.callWS(t)}catch(t){throw this.toast(t?.message||"Operazione non riuscita"),t}}toast(t){this._toast=t,clearTimeout(this._toastTimer),this._toastTimer=window.setTimeout(()=>this._toast="",3500)}_onCell(t,e,i,s){if(this._data?.inventory)s&&this.ws({type:"tapon/take_code",code:`tapon-${s.code}`});else{if(this._moving){const a=this._moving;if(this._moving=null,s?.id===a.id)return;return void this.ws({type:"tapon/move_bottle",bottle_id:a.id,rack_id:t.id,row:e,col:i}).then(()=>this.toast(s?"Bottiglie scambiate di posto":"Bottiglia spostata"))}this._dialog=s?{kind:"bottle",bottleId:s.id}:{kind:"add",rackId:t.id,row:e,col:i}}}render(){const t=this._data;return B`
      <ha-card>
        ${Rt}
        ${this._error?B`<div class="empty">${this._error}</div>`:t?this._renderBody(t):B`<div class="empty">Carico la cantina…</div>`}
        ${this._toast?B`<div class="toast">${this._toast}</div>`:W}
      </ha-card>
      ${t?this._renderDialog(t):W}
    `}_renderBody(t){const e=t.bottles.length,i=t.racks.reduce((t,e)=>t+mt(e),0),s=t.bottles.filter(t=>"closing"===t.alert).length,a=t.bottles.filter(t=>"past"===t.alert).length,o=t.bottles.filter(t=>!t.rack_id&&!t.opened_at),r=t.bottles.filter(t=>t.opened_at).sort((t,e)=>(e.opened_days??0)-(t.opened_days??0)),n=Object.fromEntries(Object.keys(t.types).map(e=>[e,t.bottles.filter(t=>t.type===e).length])),l=Math.round(Number(this._config.columns))||0,d=l?Math.max(1,Math.min(6,l,t.racks.length||1)):0;return B`
      <div class="header">
        <div class="title">
          <span class="logo">🍷</span>
          <div>
            <div class="name">${this._config.title||"Tapon"}</div>
            <div class="sub">${e} bottiglie · ${i-t.racks.reduce((e,i)=>e+this._inRack(t,i).length,0)} posti liberi${this._renderValue(t)}</div>
          </div>
        </div>
        ${this._renderClimate(t)}
        <div class="actions">
          <button class="btn primary" @click=${()=>this._dialog={kind:"add",rackId:null,row:null,col:null}}>
            ＋ Aggiungi
          </button>
          <button class="btn" title="Che vino apro con questo piatto?" @click=${()=>this._dialog={kind:"pair"}}>🍽 Abbina</button>
          <button class="btn" title="In enoteca: ce l'ho già?" @click=${()=>this._dialog={kind:"check"}}>📷 Ce l'ho?</button>
          <button class="btn" title="Lista dei desideri" @click=${()=>this._dialog={kind:"wishlist"}}>
            ♡ Desideri${t.wishlist?.length?B` <span class="count">${t.wishlist.length}</span>`:W}
          </button>
          <button class="btn" title="Storico" @click=${()=>this._dialog={kind:"history"}}>🕓 Storico</button>
          <button class="btn" title="Scaffali e impostazioni" @click=${()=>this._dialog={kind:"racks"}}>⚙︎</button>
        </div>
      </div>

      ${s||a?B`<div class="banner">
            ${s?B`<span>🍷 <b>${s}</b> da bere presto</span>`:W}
            ${a?B`<span>⚠️ <b>${a}</b> oltre la finestra di beva</span>`:W}
            <span class="hint">cartellino dorato: da bere presto · rosso: oltre la finestra</span>
          </div>`:W}

      ${t.inventory?this._renderInventoryBanner(t,t.inventory):W}

      ${this._moving?B`<div class="banner moving">
            Tocca la nuova posizione per <b>${_t(this._moving)}</b>
            <button class="btn small" @click=${()=>this._moving=null}>Annulla</button>
          </div>`:W}

      <div class="filters">
        <button class="chip ${this._typeFilter?"":"active"}" @click=${()=>this._typeFilter=""}>Tutti ${e}</button>
        ${Object.entries(t.types).map(([t,e])=>B`<button
            class="chip ${this._typeFilter===t?"active":""}"
            @click=${()=>this._typeFilter=this._typeFilter===t?"":t}
          ><span class="dot" style="background:${e.color}"></span>${e.label} ${n[t]||0}</button>`)}
        <input class="search" type="search" placeholder="Cerca vino, produttore, annata…"
          .value=${this._query} @input=${t=>this._query=t.target.value} />
        ${this._renderLightButton(t)}
      </div>

      ${t.highlight?.groups.length?this._renderLitBanner(t):W}

      <div class="racks ${d?"fixed":""}" style=${d?`--tb-columns:${d}`:""}>
        ${t.racks.map(e=>this._renderRack(t,e))}
      </div>

      ${r.length?B`<div class="unplaced">
            <div class="section-title">🍾 Aperte (${r.length})</div>
            <div class="list">
              ${r.map(e=>B`<button class="list-item opened ${e.opened_state||""}"
                  @click=${()=>this._dialog={kind:"bottle",bottleId:e.id}}>
                  <span class="dot" style="background:${t.types[e.type]?.color}"></span>${_t(e)}
                  <span class="od">${At(e)}</span>
                </button>`)}
            </div>
          </div>`:W}
      ${o.length?B`<div class="unplaced">
            <div class="section-title">Da sistemare (${o.length})</div>
            <div class="list">
              ${o.map(e=>B`<button class="list-item ${this._dims(e)?"dim":""}"
                  @click=${()=>this._dialog={kind:"bottle",bottleId:e.id}}>
                  <span class="dot" style="background:${t.types[e.type]?.color}"></span>${_t(e)}
                </button>`)}
            </div>
          </div>`:W}
      ${t.racks.length?W:B`<div class="empty">Nessuno scaffale: creane uno da ⚙︎.</div>`}
    `}_renderLightButton(t){if(!this._query.trim()&&!this._typeFilter)return W;const e=t.bottles.filter(t=>!this._dims(t));if(!e.length||t.inventory)return W;const i=[this._typeFilter?t.types[this._typeFilter]?.label:"",this._query.trim()].filter(Boolean).join(" · ");return B`<button class="btn small light-btn" title="Evidenzia sullo scaffale finché non ne prendi una"
      @click=${async()=>{await this.ws({type:"tapon/highlight",source:"search",query:i,groups:[{label:i,color:xt,bottle_ids:e.map(t=>t.id)}]}),this._query="",this._typeFilter=""}}>💡 Illumina ${e.length}</button>`}_renderLitBanner(t){const e=t.highlight;return B`<div class="banner lit">
      <span>💡</span>
      <div class="legend">
        ${e.groups.map(t=>B`<span class="lg"><span class="lgdot" style="--hl:${t.color}"></span>${t.label||"Selezione"}
          <span class="muted">${t.bottle_ids.length}</span></span>`)}
      </div>
      <span class="hint">restano accese finché non ne prendi una</span>
      <button class="btn small" @click=${()=>this.ws({type:"tapon/highlight_clear"})}>Spegni</button>
    </div>`}_renderInventoryBanner(t,e){const i=t.racks.find(t=>t.id===e.rack_id),s=e.last;return B`<div class="banner inventory">
      <div class="inv-text">
        <b>📋 Inventario${i?` · ${i.name}`:""}</b>
        <span class="inv-count">${e.seen}/${e.total} trovate</span>
        ${s?B`<span class="hint">Ultima: ${s.name?`${s.name}${s.vintage?` ${s.vintage}`:""} `:""}${{ok:"✓",again:"↺ già contata",misplaced:"⚠ fuori posto",found_taken:"↩ risultava già tolta",unknown:"? codice sconosciuto"}[s.result]||""}</span>`:B`<span class="hint">Scansiona i QR, o tocca le bottiglie che vedi</span>`}
      </div>
      <div class="inv-progress"><span style="width:${e.total?Math.round(e.seen/e.total*100):0}%"></span></div>
      <div class="inv-actions">
        <button class="btn small" @click=${()=>this.ws({type:"tapon/inventory_stop"}).then(()=>this.toast("Inventario annullato"))}>Annulla</button>
        <button class="btn small primary" @click=${async()=>{const t=await this.ws({type:"tapon/inventory_stop"});this._dialog={kind:"inventory",report:t.inventory}}}>Fine: vedi risultato</button>
      </div>
    </div>`}_renderValue(t){const e=t.value;if(!e||!e.priced)return W;const i=e.total.toLocaleString("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:0}),s=e.bottles-e.priced;return B` · <span class="value" title=${s?`Valore delle ${e.priced} bottiglie con prezzo (${s} senza prezzo)`:"Valore della cantina"}>${i}${s?"*":""}</span>`}_renderClimate(t){const e=t.climate;if(!e||!e.temperature_entity&&!e.humidity_entity)return W;const i=(t,e,i,s,a,o)=>{if(!t)return W;const r=this.hass?.states?.[t],n=r?Number(r.state):NaN,l=!isNaN(n),d=l?n<s?"low":n>a?"high":"ok":"na",c=l?n.toLocaleString("it-IT",{maximumFractionDigits:1}):"—";return B`<button class="climate ${d}" title=${"ok"===d?`${o} ideale (${s}–${a} ${i})`:"na"===d?`${o} non disponibile`:`${o} troppo ${"low"===d?"bassa":"alta"}: ideale ${s}–${a} ${i}`}
        @click=${()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}>
        <span class="ci">${e}</span><b>${c}</b><span class="cu">${i}</span>
      </button>`};return B`<div class="climates">
      ${i(e.temperature_entity,"🌡","°C",e.temperature_min,e.temperature_max,"Temperatura")}
      ${i(e.humidity_entity,"💧","%",e.humidity_min,e.humidity_max,"Umidità")}
    </div>`}_invClass(t,e){const i=t.inventory;return!i||i.rack_id&&e.rack_id!==i.rack_id?"":i.missing.includes(e.id)?"unseen":"seen"}_inRack(t,e){return t.bottles.filter(t=>t.rack_id===e.id&&null!=t.row&&null!=t.col)}_dims(t){return this._typeFilter&&t.type!==this._typeFilter||!function(t,e){if(!e)return!0;const i=yt([t.name,t.producer,t.vintage,t.region,t.country,t.grape,t.notes,t.code].filter(Boolean).join(" "));return yt(e).split(/\s+/).every(t=>i.includes(t))}(t,this._query)}_renderRack(t,e){const i=this._inRack(t,e),s=new Map(i.map(t=>[`${t.row}:${t.col}`,t])),a=vt(e),o=new Map;for(const e of t.highlight?.groups||[])for(const t of e.bottle_ids)o.has(t)||o.set(t,e.color);return B`
      <div class="rack ${o.size?"lighting":""}">
        <div class="rack-head"><span>${e.name}</span><span class="muted">${i.length}/${mt(e)}</span></div>
        <div class="shelves">
          ${a.map((i,a)=>B`<div class="shelf">
            <div class="grid" style="grid-template-columns: repeat(${i}, minmax(0, 34px))">
              ${Array.from({length:i},(i,r)=>{const n=s.get(`${a}:${r}`);return B`<button
                  class="cell ${n?"full":"free"} ${n&&this._dims(n)?"dim":""} ${n&&this._moving?.id===n.id?"moving":""} ${n?.reserved_for?"reserved":""} ${n?this._invClass(t,n):""} ${n&&o.has(n.id)?"lit":""}"
                  style=${n&&o.has(n.id)?`--hl:${o.get(n.id)}`:""}
                  title=${n?`${_t(n)}${n.producer?` · ${n.producer}`:""}${n.reserved_for?` · 🔒 ${n.reserved_for}`:""}`:`Mensola ${a+1}, posto ${r+1}: libero`}
                  @click=${()=>this._onCell(e,a,r,n)}
                >${n?zt(n.type,n.alert):Mt}</button>`})}
            </div>
            <div class="board"></div>
          </div>`)}
        </div>
      </div>
    `}_renderDialog(t){const e=this._dialog;if(!e)return W;const i=()=>this._dialog=null;switch(e.kind){case"add":return B`<tb-add-dialog .card=${this} .data=${t} .rackId=${e.rackId} .row=${e.row} .col=${e.col}
          .mode=${e.mode||"cellar"} .prefill=${e.prefill||null} .wishId=${e.wishId||null} @close=${i}></tb-add-dialog>`;case"wishlist":return B`<tb-wishlist-dialog .card=${this} .data=${t} @close=${i}
          @add-wish=${()=>this._dialog={kind:"add",rackId:null,row:null,col:null,mode:"wish"}}
          @buy=${t=>this._dialog={kind:"add",rackId:null,row:null,col:null,mode:"cellar",prefill:t.detail.wish,wishId:t.detail.wish.id}}></tb-wishlist-dialog>`;case"check":return B`<tb-check-dialog .card=${this} .data=${t} @close=${i}
          @buy=${t=>this._dialog={kind:"add",rackId:null,row:null,col:null,mode:"cellar",prefill:t.detail.wine}}></tb-check-dialog>`;case"inventory":return B`<tb-inventory-dialog .card=${this} .data=${t} .report=${e.report} @close=${i}
          @open-bottle=${t=>this._dialog={kind:"bottle",bottleId:t.detail.bottleId}}></tb-inventory-dialog>`;case"bottle":{const s=t.bottles.find(t=>t.id===e.bottleId);return s?B`<tb-bottle-dialog .card=${this} .data=${t} .bottle=${s} @close=${i} @move=${this._startMove}></tb-bottle-dialog>`:W}case"racks":return B`<tb-racks-dialog .card=${this} .data=${t} @close=${i}></tb-racks-dialog>`;case"pair":return B`<tb-pair-dialog .card=${this} .data=${t} @close=${i}
          @open-bottle=${t=>this._dialog={kind:"bottle",bottleId:t.detail.bottleId}}></tb-pair-dialog>`;case"history":return B`<tb-history-dialog .card=${this} .data=${t} @close=${i}></tb-history-dialog>`}}};Wt.styles=[Et,r`
      :host {
        display: block;
        min-width: 0;
        max-width: 100%;
      }
      ha-card {
        overflow: hidden;
        position: relative;
        container-type: inline-size;
        container-name: tb;
        max-width: 100%;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 16px 16px 8px;
        flex-wrap: wrap;
      }
      .title {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .logo {
        font-size: 1.8em;
      }
      .name {
        font-family: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif;
        font-size: 1.55em;
        font-weight: 600;
        letter-spacing: 0.01em;
      }
      .value {
        color: #e3b341;
        font-variant-numeric: tabular-nums;
      }
      .sub,
      .muted {
        color: var(--secondary-text-color);
        font-size: 0.85em;
      }
      .climates {
        display: flex;
        gap: 6px;
        margin-left: auto;
        margin-right: 6px;
      }
      .climate {
        display: inline-flex;
        align-items: baseline;
        gap: 4px;
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid var(--tb-line);
        background: rgba(255, 255, 255, 0.04);
        color: var(--tb-ink, var(--primary-text-color));
        font: inherit;
        cursor: pointer;
      }
      .climate b {
        font-size: 1.05em;
        font-variant-numeric: tabular-nums;
      }
      .climate .cu,
      .climate .ci {
        font-size: 0.8em;
        color: var(--tb-ink-2);
      }
      .climate.low,
      .climate.high {
        border-color: rgba(255, 160, 0, 0.6);
        background: rgba(255, 160, 0, 0.12);
      }
      .climate.na {
        opacity: 0.5;
      }
      @container tb (max-width: 599px) {
        .climates {
          margin-left: 0;
          order: 3;
          width: 100%;
        }
      }
      .actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .banner {
        margin: 4px 16px 8px;
        padding: 8px 12px;
        border-radius: 10px;
        background: rgba(255, 152, 0, 0.12);
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        align-items: center;
        font-size: 0.9em;
      }
      .banner.moving {
        background: rgba(33, 150, 243, 0.15);
        justify-content: space-between;
      }
      .hint {
        color: var(--secondary-text-color);
        font-size: 0.85em;
      }
      .filters {
        display: flex;
        gap: 6px;
        padding: 4px 16px 10px;
        flex-wrap: wrap;
        align-items: center;
      }
      .search {
        flex: 1 1 180px;
        min-width: 150px;
        padding: 7px 10px;
        border-radius: 18px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
      }
      .racks {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
        gap: 14px;
        padding: 4px 16px 16px;
      }
      /* Colonne decise dalla larghezza reale della scheda (non dello schermo):
         al massimo --tb-columns, ma vanno a capo quando ogni rastrelliera
         scenderebbe sotto i 240px (es. barra laterale di HA aperta). */
      .racks.fixed {
        grid-template-columns: repeat(
          auto-fit,
          minmax(max(min(240px, 100%), calc((100% - (var(--tb-columns) - 1) * 14px) / var(--tb-columns))), 1fr)
        );
      }
      .rack {
        min-width: 0;
        border-radius: 18px;
        padding: 14px 14px 18px;
        background:
          radial-gradient(120% 60% at 50% 0%, rgba(255, 255, 255, 0.06), transparent 60%),
          linear-gradient(180deg, #1d1a1a, #121011);
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 10px 30px rgba(0, 0, 0, 0.35);
      }
      .rack-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        color: #f1e9df;
        font-weight: 600;
        letter-spacing: 0.02em;
        padding: 0 2px 14px;
      }
      .rack-head .muted {
        color: #9b928a;
        font-variant-numeric: tabular-nums;
      }
      .shelves {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .shelf {
        position: relative;
      }
      .board {
        height: 5px;
        margin: 2px -6px 0;
        border-radius: 2px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04) 60%, rgba(0, 0, 0, 0.4));
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.35);
      }
      .grid {
        display: grid;
        gap: 7px;
        justify-content: center;
      }
      .cell {
        aspect-ratio: 24 / 64;
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        position: relative;
        transition: transform 0.18s ease, opacity 0.2s, filter 0.2s;
      }
      .cell svg {
        width: 100%;
        height: 100%;
        display: block;
        overflow: visible;
      }
      .cell.full {
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.5));
      }
      .cell.full:hover {
        transform: translateY(-5px);
        filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.6));
      }
      .cell.free:hover svg path {
        fill: rgba(255, 255, 255, 0.08);
        stroke: rgba(255, 255, 255, 0.45);
      }
      .cell .tag {
        transform-box: fill-box;
        transform-origin: 0 0;
        animation: tb-sway 4s ease-in-out infinite;
      }
      @keyframes tb-sway {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-4deg); }
      }
      .light-btn {
        flex: none;
      }
      .banner.lit {
        background: rgba(255, 226, 176, 0.08);
        border: 1px solid rgba(255, 226, 176, 0.18);
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        flex: 1;
      }
      .lg {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .lgdot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--hl);
        box-shadow: 0 0 8px 2px var(--hl);
      }
      .rack.lighting .cell.full:not(.lit) {
        opacity: 0.35;
      }
      .cell.lit {
        z-index: 1;
        filter: drop-shadow(0 0 5px var(--hl)) drop-shadow(0 0 12px var(--hl));
        animation: tb-glow 2.2s ease-in-out infinite;
      }
      .cell.lit::before {
        content: "";
        position: absolute;
        left: -40%;
        right: -40%;
        bottom: -10px;
        height: 14px;
        border-radius: 50%;
        background: radial-gradient(closest-side, var(--hl), transparent);
        opacity: 0.85;
        pointer-events: none;
      }
      @keyframes tb-glow {
        50% {
          filter: drop-shadow(0 0 3px var(--hl)) drop-shadow(0 0 7px var(--hl));
        }
      }
      .cell.reserved::after {
        content: "🔒";
        position: absolute;
        top: -2px;
        right: -4px;
        font-size: 9px;
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.8));
      }
      .cell.unseen {
        opacity: 0.28;
        filter: grayscale(0.6);
      }
      .cell.seen::before {
        content: "✓";
        position: absolute;
        left: 50%;
        bottom: -3px;
        transform: translateX(-50%);
        z-index: 1;
        font-size: 10px;
        font-weight: 700;
        line-height: 14px;
        width: 14px;
        border-radius: 50%;
        text-align: center;
        background: #2e7d32;
        color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
      }
      .count {
        display: inline-block;
        min-width: 18px;
        padding: 0 5px;
        border-radius: 999px;
        background: rgba(227, 179, 65, 0.2);
        color: #e3b341;
        font-size: 0.8em;
        line-height: 18px;
        text-align: center;
      }
      .banner.inventory {
        background: rgba(46, 125, 50, 0.16);
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
      .inv-text {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        align-items: baseline;
      }
      .inv-count {
        font-variant-numeric: tabular-nums;
      }
      .inv-progress {
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }
      .inv-progress span {
        display: block;
        height: 100%;
        background: #4caf50;
        transition: width 0.3s ease;
      }
      .inv-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }
      .cell.dim {
        opacity: 0.15;
        filter: grayscale(0.7);
      }
      .cell.moving {
        outline: 2px solid #2196f3;
        outline-offset: 2px;
        border-radius: 4px;
      }
      .unplaced {
        padding: 0 16px 16px;
      }
      .section-title {
        font-weight: 600;
        margin-bottom: 6px;
      }
      .list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .list-item {
        display: flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--divider-color);
        background: none;
        color: inherit;
        border-radius: 16px;
        padding: 5px 10px;
        cursor: pointer;
        font: inherit;
      }
      .list-item .od {
        font-size: 0.8em;
        color: var(--secondary-text-color);
      }
      .list-item.opened.today {
        border-color: rgba(227, 179, 65, 0.6);
      }
      .list-item.opened.today .od {
        color: #e3b341;
      }
      .list-item.opened.late {
        border-color: rgba(229, 57, 53, 0.6);
      }
      .list-item.opened.late .od {
        color: #ef7a77;
      }
      .list-item.dim {
        opacity: 0.3;
      }
      .empty {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
      }
      .toast {
        position: fixed;
        left: 50%;
        bottom: 28px;
        max-width: min(520px, 90vw);
        text-align: center;
        transform: translateX(-50%);
        background: rgba(20, 16, 17, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
        color: #f2ebe3;
        padding: 10px 18px;
        border-radius: 999px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1001;
        font-size: 0.9em;
        z-index: 2;
      }
    `],t([bt({attribute:!1})],Wt.prototype,"hass",void 0),t([gt()],Wt.prototype,"_config",void 0),t([gt()],Wt.prototype,"_data",void 0),t([gt()],Wt.prototype,"_error",void 0),t([gt()],Wt.prototype,"_typeFilter",void 0),t([gt()],Wt.prototype,"_query",void 0),t([gt()],Wt.prototype,"_dialog",void 0),t([gt()],Wt.prototype,"_moving",void 0),t([gt()],Wt.prototype,"_toast",void 0),Wt=t([pt("tapon-card")],Wt),window.customCards=window.customCards||[],window.customCards.push({type:"tapon-card",name:"Tapon",description:"La tua cantina: scaffali, bottiglie, QR e finestre di beva",preview:!1});export{Wt as TaponCard};
