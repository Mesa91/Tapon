var p=function(t,e,i,s){var r=arguments.length,l=r<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,i):s,d;if(typeof Reflect==="object"&&typeof Reflect.decorate==="function")l=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)if(d=t[n])l=(r<3?d(l):r>3?d(e,i,l):d(e,i))||l;return r>3&&l&&Object.defineProperty(e,i,l),l};var Z=globalThis,tt=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,nt=Symbol(),Et=new WeakMap;class et{constructor(t,e,i){if(this._$cssResult$=!0,i!==nt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(tt&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=Et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Et.set(e,t))}return t}toString(){return this.cssText}}var St=(t)=>new et(typeof t=="string"?t:t+"",void 0,nt),f=(t,...e)=>{let i=t.length===1?t[0]:e.reduce((s,r,l)=>s+((d)=>{if(d._$cssResult$===!0)return d.cssText;if(typeof d=="number")return d;throw Error("Value passed to 'css' function must be a 'css' function result: "+d+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[l+1],t[0]);return new et(i,t,nt)},At=(t,e)=>{if(tt)t.adoptedStyleSheets=e.map((i)=>i instanceof CSSStyleSheet?i:i.styleSheet);else for(let i of e){let s=document.createElement("style"),r=Z.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}},ot=tt?(t)=>t:(t)=>t instanceof CSSStyleSheet?((e)=>{let i="";for(let s of e.cssRules)i+=s.cssText;return St(i)})(t):t;var{is:Zt,defineProperty:te,getOwnPropertyDescriptor:ee,getOwnPropertyNames:ie,getOwnPropertySymbols:se,getPrototypeOf:ae}=Object,it=globalThis,Ct=it.trustedTypes,re=Ct?Ct.emptyScript:"",ne=it.reactiveElementPolyfillSupport,N=(t,e)=>t,F={toAttribute(t,e){switch(e){case Boolean:t=t?re:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=t!==null;break;case Number:i=t===null?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(s){i=null}}return i}},st=(t,e)=>!Zt(t,e),Rt={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:st};Symbol.metadata??=Symbol("metadata"),it.litPropertyMetadata??=new WeakMap;class z extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Rt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&te(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){let{get:s,set:r}=ee(this.prototype,t)??{get(){return this[e]},set(l){this[e]=l}};return{get:s,set(l){let d=s?.call(this);r?.call(this,l),this.requestUpdate(t,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Rt}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let t=ae(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let e=this.properties,i=[...ie(e),...se(e)];for(let s of i)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let s of i)e.unshift(ot(s))}else t!==void 0&&e.push(ot(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t)=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t)=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return At(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t)=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t)=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:F).toAttribute(e,i.type);this._$Em=t,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){let i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),l=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:F;this._$Em=s;let d=l.fromAttribute(e,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(t!==void 0){let l=this.constructor;if(s===!1&&(r=this[t]),i??=l.getPropertyOptions(t),!((i.hasChanged??st)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(l._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},l){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,l??e??this[t]),r!==!0||l!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:l}=r,d=this[s];l!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((i)=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e)=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e)=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}}z.elementStyles=[],z.shadowRootOptions={mode:"open"},z[N("elementProperties")]=new Map,z[N("finalized")]=new Map,ne?.({ReactiveElement:z}),(it.reactiveElementVersions??=[]).push("2.1.2");var lt=globalThis,zt=(t)=>t,at=lt.trustedTypes,Tt=at?at.createPolicy("lit-html",{createHTML:(t)=>t}):void 0;var T=`lit$${Math.random().toFixed(9).slice(2)}$`,Ht="?"+T,oe=`<${Ht}>`,I=document,D=()=>I.createComment(""),j=(t)=>t===null||typeof t!="object"&&typeof t!="function",dt=Array.isArray,le=(t)=>dt(t)||typeof t?.[Symbol.iterator]=="function";var U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Mt=/-->/g,Pt=/>/g,M=RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),It=/'/g,Lt=/"/g,Bt=/^(?:script|style|textarea|title)$/i,ct=(t)=>(e,...i)=>({_$litType$:t,strings:e,values:i}),a=ct(1),S=ct(2),ke=ct(3),L=Symbol.for("lit-noChange"),o=Symbol.for("lit-nothing"),Ot=new WeakMap,P=I.createTreeWalker(I,129);function Nt(t,e){if(!dt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Tt!==void 0?Tt.createHTML(e):e}var de=(t,e)=>{let i=t.length-1,s=[],r,l=e===2?"<svg>":e===3?"<math>":"",d=U;for(let n=0;n<i;n++){let h=t[n],_,c,b=-1,E=0;for(;E<h.length&&(d.lastIndex=E,c=d.exec(h),c!==null);)E=d.lastIndex,d===U?c[1]==="!--"?d=Mt:c[1]!==void 0?d=Pt:c[2]!==void 0?(Bt.test(c[2])&&(r=RegExp("</"+c[2],"g")),d=M):c[3]!==void 0&&(d=M):d===M?c[0]===">"?(d=r??U,b=-1):c[1]===void 0?b=-2:(b=d.lastIndex-c[2].length,_=c[1],d=c[3]===void 0?M:c[3]==='"'?Lt:It):d===Lt||d===It?d=M:d===Mt||d===Pt?d=U:(d=M,r=void 0);let R=d===M&&t[n+1].startsWith("/>")?" ":"";l+=d===U?h+oe:b>=0?(s.push(_),h.slice(0,b)+"$lit$"+h.slice(b)+T+R):h+T+(b===-2?n:R)}return[Nt(t,l+(t[i]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,l=0,d=t.length-1,n=this.parts,[h,_]=de(t,e);if(this.el=q.createElement(h,i),P.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=P.nextNode())!==null&&n.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith("$lit$")){let b=_[l++],E=s.getAttribute(c).split(T),R=/([.?@])?(.*)/.exec(b);n.push({type:1,index:r,name:R[2],strings:E,ctor:R[1]==="."?Ut:R[1]==="?"?Dt:R[1]==="@"?jt:G}),s.removeAttribute(c)}else c.startsWith(T)&&(n.push({type:6,index:r}),s.removeAttribute(c));if(Bt.test(s.tagName)){let c=s.textContent.split(T),b=c.length-1;if(b>0){s.textContent=at?at.emptyScript:"";for(let E=0;E<b;E++)s.append(c[E],D()),P.nextNode(),n.push({type:2,index:++r});s.append(c[b],D())}}}else if(s.nodeType===8)if(s.data===Ht)n.push({type:2,index:r});else{let c=-1;for(;(c=s.data.indexOf(T,c+1))!==-1;)n.push({type:7,index:r}),c+=T.length-1}r++}}static createElement(t,e){let i=I.createElement("template");return i.innerHTML=t,i}}function H(t,e,i=t,s){if(e===L)return e;let r=s!==void 0?i._$Co?.[s]:i._$Cl,l=j(e)?void 0:e._$litDirective$;return r?.constructor!==l&&(r?._$AO?.(!1),l===void 0?r=void 0:(r=new l(t),r._$AT(t,i,s)),s!==void 0?(i._$Co??=[])[s]=r:i._$Cl=r),r!==void 0&&(e=H(t,r._$AS(t,e.values),r,s)),e}class Ft{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??I).importNode(e,!0);P.currentNode=s;let r=P.nextNode(),l=0,d=0,n=i[0];for(;n!==void 0;){if(l===n.index){let h;n.type===2?h=new V(r,r.nextSibling,this,t):n.type===1?h=new n.ctor(r,n.name,n.strings,this,t):n.type===6&&(h=new qt(r,this,t)),this._$AV.push(h),n=i[++d]}l!==n?.index&&(r=P.nextNode(),l++)}return P.currentNode=I,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class V{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=o,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=H(this,t,e),j(t)?t===o||t==null||t===""?(this._$AH!==o&&this._$AR(),this._$AH=o):t!==this._$AH&&t!==L&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):le(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==o&&j(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=q.createElement(Nt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let r=new Ft(s,this),l=r.u(this.options);r.p(e),this.T(l),this._$AH=r}}_$AC(t){let e=Ot.get(t.strings);return e===void 0&&Ot.set(t.strings,e=new q(t)),e}k(t){dt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let r of t)s===e.length?e.push(i=new V(this.O(D()),this.O(D()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=zt(t).nextSibling;zt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class G{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=o,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=o}_$AI(t,e=this,i,s){let r=this.strings,l=!1;if(r===void 0)t=H(this,t,e,0),l=!j(t)||t!==this._$AH&&t!==L,l&&(this._$AH=t);else{let d=t,n,h;for(t=r[0],n=0;n<r.length-1;n++)h=H(this,d[i+n],e,n),h===L&&(h=this._$AH[n]),l||=!j(h)||h!==this._$AH[n],h===o?t=o:t!==o&&(t+=(h??"")+r[n+1]),this._$AH[n]=h}l&&!s&&this.j(t)}j(t){t===o?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ut extends G{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===o?void 0:t}}class Dt extends G{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==o)}}class jt extends G{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=H(this,t,e,0)??o)===L)return;let i=this._$AH,s=t===o&&i!==o||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==o&&(i===o||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class qt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}}var ce=lt.litHtmlPolyfillSupport;ce?.(q,V),(lt.litHtmlVersions??=[]).push("3.3.2");var Vt=(t,e,i)=>{let s=i?.renderBefore??e,r=s._$litPart$;if(r===void 0){let l=i?.renderBefore??null;s._$litPart$=r=new V(e.insertBefore(D(),l),l,void 0,i??{})}return r._$AI(t),r};var pt=globalThis;class v extends z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Vt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}v._$litElement$=!0,v.finalized=!0,pt.litElementHydrateSupport?.({LitElement:v});var pe=pt.litElementPolyfillSupport;pe?.({LitElement:v});(pt.litElementVersions??=[]).push("4.2.2");var y=(t)=>(e,i)=>{i!==void 0?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};var he={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:st},ue=(t=he,e,i)=>{let{kind:s,metadata:r}=i,l=globalThis.litPropertyMetadata.get(r);if(l===void 0&&globalThis.litPropertyMetadata.set(r,l=new Map),s==="setter"&&((t=Object.create(t)).wrapped=!0),l.set(i.name,t),s==="accessor"){let{name:d}=i;return{set(n){let h=e.get.call(this);e.set.call(this,n),this.requestUpdate(d,h,t,!0,n)},init(n){return n!==void 0&&this.C(d,void 0,t,n),n}}}if(s==="setter"){let{name:d}=i;return function(n){let h=this[d];e.call(this,n),this.requestUpdate(d,h,t,!0,n)}}throw Error("Unsupported decorator location: "+s)};function g(t){return(e,i)=>typeof i=="object"?ue(t,e,i):((s,r,l)=>{let d=r.hasOwnProperty(l);return r.constructor.createProperty(l,s),d?Object.getOwnPropertyDescriptor(r,l):void 0})(t,e,i)}function u(t){return g({...t,state:!0,attribute:!1})}function W(t){return t.shelves?.length?t.shelves:Array(t.rows).fill(t.cols)}function Y(t){return W(t).reduce((e,i)=>e+i,0)}var Q=[{key:"name",label:"Nome del vino",kind:"text"},{key:"producer",label:"Produttore",kind:"text"},{key:"vintage",label:"Annata",kind:"year"},{key:"region",label:"Regione / denominazione",kind:"text"},{key:"country",label:"Paese",kind:"text"},{key:"grape",label:"Vitigno",kind:"text"},{key:"drink_from",label:"Da bere dal",kind:"year"},{key:"drink_until",label:"Da bere entro il",kind:"year"},{key:"drink_peak",label:"Al suo meglio nel",kind:"year"},{key:"alcohol",label:"Gradazione",kind:"text"},{key:"serve_temp",label:"Temperatura di servizio",kind:"text"},{key:"decant",label:"Decantazione",kind:"text"},{key:"glass",label:"Bicchiere",kind:"text"},{key:"price",label:"Prezzo (€)",kind:"number"},{key:"food_pairings",label:"Abbinamenti",kind:"area"},{key:"description",label:"Descrizione",kind:"area"},{key:"notes",label:"Note personali",kind:"area"}];function m(t){return`${t.name||"Vino"}${t.vintage?` ${t.vintage}`:""}`}function K(t,e){let i=e.find((s)=>s.id===t.rack_id);if(!i||t.row==null||t.col==null)return"Da sistemare";return`${i.name} · mensola ${t.row+1}, posto ${t.col+1}`}function Wt(t){if(t.drink_from&&t.drink_until)return`${t.drink_from}–${t.drink_until}`;if(t.drink_until)return`entro il ${t.drink_until}`;if(t.drink_from)return`dal ${t.drink_from}`;return""}function Gt(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}function Yt(t,e){if(!e)return!0;let i=Gt([t.name,t.producer,t.vintage,t.region,t.country,t.grape,t.notes,t.code].filter(Boolean).join(" "));return Gt(e).split(/\s+/).every((s)=>i.includes(s))}var O="#ffe2b0",X=["#4fc3f7","#81c784","#e0525f","#ffb74d","#ba68c8","#f48fb1","#4db6ac","#fff176"];function Qt(t,e=new Date().getFullYear()){let i=t.drink_from||null,s=t.drink_until||null,r=t.drink_peak||null;if(!s&&!r)return null;if(r&&i&&r<i)r=i;if(r&&s&&r>s)r=s;let l=i??Math.min(r??s,s??r)-3,d=s??r+4,n,h;if(e>d)[n,h]=["past","Oltre la finestra: da bere subito"];else if(e<l)[n,h]=["young","Ancora giovane: meglio aspettare"];else if(r&&Math.abs(e-r)<=1)[n,h]=["peak","Al massimo: è il momento giusto"];else if(r&&e<r)[n,h]=["rising",`In crescita: al meglio nel ${r}`];else if(r)[n,h]=["declining","Dopo il picco: da bere presto"];else[n,h]=["rising","Pronto da bere"];let _=Math.max(1,d-l+1),c=(b)=>Math.min(100,Math.max(0,(b-l+0.5)/_*100));return{start:l,end:d,peak:r,phase:n,label:h,today:c(e),peakPos:r?c(r):null}}function J(t){let e=[];if(t.serve_temp)e.push(`\uD83C\uDF21 ${t.serve_temp}`);if(t.decant)e.push(/^(no|non serve|nessuna)\b/i.test(t.decant.trim())?"⏳ senza decanter":`⏳ decantare ${t.decant}`);if(t.glass)e.push(`\uD83C\uDF77 ${t.glass}`);return e}function rt(t){let e=t.opened_days??0;return e===0?"Aperta oggi":e===1?"Aperta da ieri":`Aperta da ${e} giorni`}var x=f`
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
`;var Kt={red:{shape:"bordeaux",glass:"tb-glass-red",clear:!1,foil:"tb-foil-wine"},white:{shape:"burgundy",glass:"tb-wine-white",clear:!0,foil:"tb-foil-silver"},rose:{shape:"bordeaux",glass:"tb-wine-rose",clear:!0,foil:"tb-foil-rose"},sparkling:{shape:"champagne",glass:"tb-glass-green",clear:!1,foil:"tb-foil-gold"},dessert:{shape:"bordeaux",glass:"tb-glass-amber",clear:!1,foil:"tb-foil-gold"}},ht={bordeaux:{body:"M9.7 1h4.6v16.5c0 3.4 6.7 4.8 6.7 11.5v31.2c0 1.5-1.2 2.8-2.8 2.8H5.8C4.2 63 3 61.7 3 60.2V29c0-6.7 6.7-8.1 6.7-11.5z",foil:"M9.5 1.4c0-.8.5-1.4 1.3-1.4h2.4c.8 0 1.3.6 1.3 1.4V13H9.5z",label:[4.4,35,15.2,16.5],neckY:15,fillY:22},burgundy:{body:"M9.8 1h4.4v13c0 5 7 9 7 18v28.2c0 1.5-1.2 2.8-2.8 2.8H5.6c-1.6 0-2.8-1.3-2.8-2.8V32c0-9 7-13 7-18z",foil:"M9.6 1.4c0-.8.5-1.4 1.3-1.4h2.2c.8 0 1.3.6 1.3 1.4V12H9.6z",label:[4.2,36,15.6,16],neckY:13.5,fillY:19},champagne:{body:"M9.4 1h5.2v11c0 6 7.6 9.5 7.6 19v29.4c0 1.4-1.2 2.6-2.6 2.6H4.4C3 63 1.8 61.8 1.8 60.4V31c0-9.5 7.6-13 7.6-19z",foil:"M9 1.6C9 .7 9.7 0 10.6 0h2.8c.9 0 1.6.7 1.6 1.6V12c0 2.4 2.6 4.4 4.3 6.6l-14.6.1C6.4 16.4 9 14.4 9 12z",label:[3.6,37,16.8,13],neckY:20,fillY:20},half:{body:"M10 20h4v9c0 2.6 5.2 3.6 5.2 8.8v22.6c0 1.4-1.1 2.6-2.5 2.6H7.3c-1.4 0-2.5-1.2-2.5-2.6V37.8c0-5.2 5.2-6.2 5.2-8.8z",foil:"M9.8 20.9c0-.5.4-.9.9-.9h2.6c.5 0 .9.4.9.9V28H9.8z",label:[6,44,12,11],neckY:30,fillY:33}};function k(t,e){let i=Kt[t]||Kt.red,s=ht[i.shape],[r,l,d,n]=s.label,h=r+d/2;return S`<svg viewBox="0 0 24 64" aria-hidden="true">
    <ellipse cx="12" cy="63.2" rx="9.5" ry="1" fill="rgba(0,0,0,.55)" filter="url(#tb-soft)"/>
    ${i.clear?S`<path d=${s.body} fill="url(#tb-glass-clear)"/>
            <path d=${s.body} fill=${`url(#${i.glass})`} clip-path=${`url(#tb-fill-${i.shape})`}/>
            <rect x="0" y=${s.fillY} width="24" height=".5" fill="rgba(255,255,255,.35)" clip-path=${`url(#tb-in-${i.shape})`}/>`:S`<path d=${s.body} fill=${`url(#${i.glass})`}/>`}
    <path d=${s.body} fill="url(#tb-cylinder)"/>
    <path d=${s.body} fill="none" stroke="rgba(255,255,255,.18)" stroke-width=".35"/>
    <ellipse cx="12" cy="61.4" rx="6.5" ry="1.3" fill="rgba(0,0,0,.35)" clip-path=${`url(#tb-in-${i.shape})`}/>
    <g class="label-group">
      <rect x=${r} y=${l} width=${d} height=${n} rx=".5" fill="url(#tb-paper)"/>
      <rect x=${r} y=${l} width=${d} height=${n} rx=".5" fill="url(#tb-label-curve)"/>
      <rect x=${r+0.9} y=${l+0.9} width=${d-1.8} height=${n-1.8} rx=".3" fill="none" stroke="rgba(120,90,50,.55)" stroke-width=".25"/>
      <circle cx=${h} cy=${l+n*0.3} r=${Math.min(d,n)*0.12} fill="none" stroke="rgba(120,80,30,.8)" stroke-width=".3"/>
      <rect x=${h-d*0.3} y=${l+n*0.55} width=${d*0.6} height=".9" rx=".45" fill="rgba(40,20,15,.75)"/>
      <rect x=${h-d*0.22} y=${l+n*0.7} width=${d*0.44} height=".5" rx=".25" fill="rgba(40,20,15,.45)"/>
      <rect x=${h-d*0.15} y=${l+n*0.8} width=${d*0.3} height=".5" rx=".25" fill="rgba(40,20,15,.35)"/>
    </g>
    <path d=${s.foil} fill=${`url(#${i.foil})`}/>
    <path d=${s.foil} fill="url(#tb-cylinder)" opacity=".6"/>
    <path d="M5.4 30c.6-3.8 2.6-5.6 3.6-6.8V59.5H5.4z" fill="url(#tb-spec)" clip-path=${`url(#tb-in-${i.shape})`} opacity=".9"/>
    <rect x="17.6" y="31" width=".9" height="27" rx=".45" fill="rgba(255,255,255,.18)" clip-path=${`url(#tb-in-${i.shape})`}/>
    ${e?ge(s.neckY,e):o}
  </svg>`}function ge(t,e){let i=e==="past"?"url(#tb-tag-past)":"url(#tb-tag-soon)";return S`<g class="tag">
    <path d=${`M12 ${t}c3 .2 4.6 1 5.4 2.6`} fill="none" stroke="rgba(240,230,210,.85)" stroke-width=".35"/>
    <g transform=${`translate(16.4 ${t+2}) rotate(14)`}>
      <rect x="0" y="0" width="6.4" height="8.6" rx="1.1" fill=${i} stroke="rgba(0,0,0,.35)" stroke-width=".25"/>
      <circle cx="3.2" cy="1.4" r=".55" fill="rgba(0,0,0,.45)"/>
      ${e==="past"?S`<path d="M3.2 3.3v2.6M3.2 7v.1" stroke="#fff" stroke-width=".8" stroke-linecap="round"/>`:S`<circle cx="3.2" cy="5.4" r="1.9" fill="none" stroke="#3b2200" stroke-width=".45"/>
              <path d="M3.2 4.3v1.2l.8.6" fill="none" stroke="#3b2200" stroke-width=".45" stroke-linecap="round"/>`}
    </g>
  </g>`}var Xt=S`<svg viewBox="0 0 24 64" aria-hidden="true">
  <path d=${ht.bordeaux.body} fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.16)" stroke-width=".45" stroke-dasharray="1.4 1.2"/>
</svg>`,be=(t)=>{let e=ht[t];return S`
    <clipPath id=${`tb-in-${t}`}><path d=${e.body}/></clipPath>
    <clipPath id=${`tb-fill-${t}`}><rect x="0" y=${e.fillY} width="24" height="64"/></clipPath>`},C=(t,e)=>S`<linearGradient id=${t} x1="0" x2="1" y1="0" y2="0">
  ${e.map(([i,s])=>S`<stop offset=${i} stop-color=${s}/>`)}
</linearGradient>`,w=S`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="tb-soft" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation=".6"/></filter>
  ${["bordeaux","burgundy","champagne","half"].map(be)}

  <!-- glass and wine -->
  ${C("tb-glass-red",[[0,"#060404"],[0.18,"#1c0a0d"],[0.42,"#3b0f18"],[0.6,"#2a0a11"],[1,"#050303"]])}
  ${C("tb-glass-green",[[0,"#030603"],[0.2,"#0e2412"],[0.42,"#1d4223"],[0.62,"#12301a"],[1,"#020402"]])}
  ${C("tb-glass-amber",[[0,"#160902"],[0.2,"#5a2c08"],[0.42,"#9c5714"],[0.62,"#6e3a0c"],[1,"#120701"]])}
  ${C("tb-wine-white",[[0,"#5a4a12"],[0.2,"#b9a043"],[0.42,"#ecd98e"],[0.62,"#cdb158"],[1,"#4d3e0e"]])}
  ${C("tb-wine-rose",[[0,"#b87a6d"],[0.2,"#d9917c"],[0.42,"#f0b3a0"],[0.62,"#e39a83"],[1,"#c48a7c"]])}
  ${C("tb-glass-clear",[[0,"rgba(190,215,200,.30)"],[0.3,"rgba(230,245,235,.10)"],[0.7,"rgba(230,245,235,.08)"],[1,"rgba(160,190,175,.35)"]])}

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
  ${C("tb-foil-wine",[[0,"#1d0508"],[0.3,"#7a1d2b"],[0.45,"#c4515f"],[0.6,"#6a1523"],[1,"#150305"]])}
  ${C("tb-foil-gold",[[0,"#5a3a08"],[0.3,"#c9962e"],[0.45,"#ffe7a1"],[0.6,"#b88421"],[1,"#4a2f05"]])}
  ${C("tb-foil-silver",[[0,"#3c3c3c"],[0.3,"#a9a9a9"],[0.45,"#f2f2f2"],[0.6,"#9a9a9a"],[1,"#2e2e2e"]])}
  ${C("tb-foil-rose",[[0,"#5e2d24"],[0.3,"#c47e6c"],[0.45,"#f6cdbd"],[0.6,"#b46e5d"],[1,"#4d241c"]])}

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
</defs></svg>`;function gt(t,e,i){return a`
    <div class="form">
      <label class="field wide">
        Tipo
        <div class="types">
          ${Object.entries(t.types).map(([s,r])=>a`<button type="button" class="chip ${e.type===s?"active":""}"
              @click=${()=>i("type",s)}><span class="dot" style="background:${r.color}"></span>${r.label}</button>`)}
        </div>
      </label>
      ${Q.map((s)=>{let r=s.key==="name"||s.kind==="area",l=e[s.key]??"",d=(n)=>i(s.key,n.target.value);return a`<label class="field ${r?"wide":""}">
          ${s.label}
          ${s.kind==="area"?a`<textarea rows="2" .value=${l} @input=${d}></textarea>`:a`<input
                type=${s.kind==="text"?"text":"number"}
                inputmode=${s.kind==="text"?"text":"numeric"}
                step=${s.kind==="number"?"0.01":"1"}
                .value=${String(l)}
                @input=${d}
              />`}
        </label>`})}
    </div>
  `}class ut extends v{constructor(){super(...arguments);this.rackId=null;this.row=null;this.col=null;this.mode="cellar";this.prefill=null;this.wishId=null;this._where="";this._wishNotes="";this._prefilled=!1;this._values={type:"red"};this._quantity=1;this._busy=!1;this._reading="";this._front="";this._back=""}static styles=[x,f`
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
    `];_merge(t,e){let i={...this._values};for(let[s,r]of Object.entries(t)){if(r===null||r===void 0||r==="")continue;if(e||i[s]===void 0||i[s]===null||String(i[s]).trim()==="")i[s]=r}this._values=i}async _photo(t,e){let i=t.target,s=i.files?.[0];if(i.value="",!s)return;let r=await bt(s);if(e==="front")this._front=r;else this._back=r;if(this._front)await this._read()}async _read(){this._reading=this._back?"Leggo fronte e retro…":"Leggo l'etichetta…";try{let t=await this.card.ws({type:"tapon/ai_recognize",image:this._front,...this._back?{back_image:this._back}:{}});this._merge(t.wine,!0),this.card.toast(this._back?"Fronte e retro letti: controlla i dati":"Etichetta letta: controlla i dati")}catch{}finally{this._reading=""}}_slot(t){let e=t==="front"?this._front:this._back,i=t==="front"?"Fronte":"Retro",s=!!this._reading||t==="back"&&!this._front;return a`<label class="slot ${e?"has":""} ${s?"off":""}"
        title=${t==="back"&&!this._front?"Prima fotografa il fronte":`Foto ${i.toLowerCase()}`}>
      ${e?a`<img src=${e} alt=${i} />`:a`<span class="plus">📷</span>`}
      <span class="slot-label">${i}${t==="back"&&!e?a`<small>facoltativo</small>`:o}</span>
      <input type="file" accept="image/*" capture="environment" ?disabled=${s}
        @change=${(r)=>this._photo(r,t)} />
    </label>`}async _fill(){if(!String(this._values.name||"").trim()){this.card.toast("Scrivi almeno il nome del vino");return}this._reading="Completo i dati…";try{let t=await this.card.ws({type:"tapon/ai_fill",wine:this._values});this._merge(t.wine,!1),this.card.toast("Dati completati")}catch{}finally{this._reading=""}}_renderAI(){if(!this.data.ai)return a`<div class="ai"><div>
        <div class="ai-title">✨ Compilazione automatica</div>
        <div class="note">Aggiungi una chiave Gemini (gratuita) in Impostazioni → Dispositivi e servizi → Tapon → Configura per leggere le etichette con una foto.</div>
      </div></div>`;return a`<div class="ai">
      <div class="slots">${this._slot("front")}${this._slot("back")}</div>
      <div class="ai-side">
        <div class="ai-title">✨ Compilazione automatica</div>
        <div class="note">${this._reading||(this._front?"Fatto. Se in etichetta mancava qualcosa, aggiungi il retro.":"Fotografa il fronte dell'etichetta; il retro è facoltativo.")}</div>
        <button class="btn small" style="margin-top:8px" ?disabled=${!!this._reading} @click=${this._fill}>Oppure completa dal nome</button>
      </div>
      ${this._reading?a`<div class="reading"></div>`:o}
    </div>`}willUpdate(){if(!this._prefilled&&this.prefill){this._prefilled=!0;let t=new Set(["id","added_at","source","where","wish_notes","rating"]);this._values={type:"red",...Object.fromEntries(Object.entries(this.prefill).filter(([e,i])=>!t.has(e)&&i!=null))}}}_close(){this.dispatchEvent(new CustomEvent("close"))}async _save(){if(!String(this._values.name||"").trim()){this.card.toast("Scrivi almeno il nome del vino");return}if(this.mode==="wish"){this._busy=!0;try{await this.card.ws({type:"tapon/wishlist_add",wine:this._values,where:this._where,wish_notes:this._wishNotes}),this.card.toast("Aggiunto alla lista dei desideri"),this._close()}finally{this._busy=!1}return}this._busy=!0;try{let e=(await this.card.ws({type:"tapon/add_bottles",wine:this._values,quantity:this._quantity,rack_id:this.rackId,row:this.row,col:this.col,wish_id:this.wishId})).bottles,i=e.filter((s)=>!s.rack_id).length;this.card.toast(i?`Aggiunte ${e.length} bottiglie, ${i} da sistemare: scaffale pieno`:e.length>1?`Aggiunte ${e.length} bottiglie`:"Bottiglia aggiunta")+(this.wishId?" e tolta dai desideri":""),this._close()}finally{this._busy=!1}}_renderWishFields(){return a`<div class="form" style="margin-top:10px">
      <label class="field wide">
        Dove l'hai assaggiato
        <input type="text" maxlength="200" placeholder="Es. cena da Marco, Osteria del Ponte…" .value=${this._where}
          @input=${(t)=>this._where=t.target.value} />
      </label>
      <label class="field wide">
        Nota
        <textarea rows="2" maxlength="1000" placeholder="Es. chiedere all'enoteca sotto casa, prezzo visto 25 €…"
          .value=${this._wishNotes} @input=${(t)=>this._wishNotes=t.target.value}></textarea>
      </label>
    </div>`}render(){let t=this.data.racks.find((i)=>i.id===this.rackId),e=t&&this.row!=null&&this.col!=null?`${t.name}, mensola ${this.row+1}, posto ${this.col+1}`:"nel primo posto libero";return a`
      ${w}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(i)=>i.stopPropagation()}>
          <div class="dialog-head">
            <div style="display:flex;gap:16px;align-items:flex-end">
              <div style="width:34px;flex:none;filter:drop-shadow(0 8px 10px rgba(0,0,0,.55))">${k(this._values.type||"red")}</div>
              <div>
                <div class="eyebrow">${this.mode==="wish"?"Lista dei desideri":this.wishId?"Comprato!":"Nuovo in cantina"}</div>
                <div class="dialog-title">${String(this._values.name||"").trim()||"Aggiungi vino"}</div>
              </div>
            </div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${this._renderAI()}
            ${gt(this.data,this._values,(i,s)=>this._values={...this._values,[i]:s})}
            ${this.mode==="wish"?this._renderWishFields():a`            <div class="form" style="margin-top:10px">
              <label class="field">
                Quante bottiglie
                <input type="number" min="1" max="100" .value=${String(this._quantity)}
                  @input=${(i)=>this._quantity=Math.max(1,Math.min(100,Number(i.target.value)||1))} />
              </label>
              <div class="field">Dove<span style="color:var(--tb-ink);text-transform:none;letter-spacing:normal;font-size:1.3em">${e}${this._quantity>1?" e i successivi":""}</span></div>
            </div>
            ${this.data.settings.auto_labels?a`<p class="note">Per ogni bottiglia verrà richiesta la stampa dell'etichetta QR.</p>`:o}`}
          </div>
          <div class="dialog-foot">
            <button class="btn" @click=${this._close}>Annulla</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${this._save}>
              ${this._busy?"Salvo…":this.mode==="wish"?"♡ Aggiungi ai desideri":`Aggiungi ${this._quantity>1?`${this._quantity} bottiglie`:"bottiglia"}`}
            </button>
          </div>
        </div>
      </div>
    `}}p([g({attribute:!1})],ut.prototype,"card",void 0),p([g({attribute:!1})],ut.prototype,"data",void 0),p([g({attribute:!1})],ut.prototype,"rackId",void 0),p([g({attribute:!1})],ut.prototype,"row",void 0),p([g({attribute:!1})],ut.prototype,"col",void 0),p([g({attribute:!1})],ut.prototype,"mode",void 0),p([g({attribute:!1})],ut.prototype,"prefill",void 0),p([g({attribute:!1})],ut.prototype,"wishId",void 0),p([u()],ut.prototype,"_where",void 0),p([u()],ut.prototype,"_wishNotes",void 0),p([u()],ut.prototype,"_values",void 0),p([u()],ut.prototype,"_quantity",void 0),p([u()],ut.prototype,"_busy",void 0),p([u()],ut.prototype,"_reading",void 0),p([u()],ut.prototype,"_front",void 0),p([u()],ut.prototype,"_back",void 0),ut=p([y("tb-add-dialog")],ut);async function bt(t,e=1280){let i=URL.createObjectURL(t);try{let s=new Image;s.src=i,await s.decode();let r=Math.min(1,e/Math.max(s.naturalWidth,s.naturalHeight)),l=document.createElement("canvas");return l.width=Math.round(s.naturalWidth*r),l.height=Math.round(s.naturalHeight*r),l.getContext("2d").drawImage(s,0,0,l.width,l.height),l.toDataURL("image/jpeg",0.85)}finally{URL.revokeObjectURL(i)}}function A(t,e,i=!1){let s=Number(t)||0;return a`<span class="stars ${i?"big":""} ${e?"edit":""}" role=${e?"radiogroup":o}
    aria-label=${s?`${s} su 5`:"Nessun voto"}>
    ${[1,2,3,4,5].map((r)=>{let l=s>=r?"on":s>=r-0.5?"half":"";return e?a`<button type="button" class="star ${l}" title="${r} su 5" @click=${()=>e(s===r?null:r)}>★</button>`:a`<span class="star ${l}">★</span>`})}
  </span>`}function B(t){return t?t.toLocaleString("it-IT",{maximumFractionDigits:1}):""}class mt extends v{constructor(){super(...arguments);this._label=null;this._editing=!1;this._values={};this._sameWine=!0;this._otherReason=!1;this._busy=!1;this._rating=!1;this._stars=null;this._tasting="";this._reserving=!1;this._resFor="";this._resUntil="";this._estimatePeak=()=>this._aiComplete(["drink_peak","drink_from","drink_until"],"drink_peak",(t)=>`Al suo meglio nel ${t.drink_peak}`,"Gemini non ha saputo stimare il picco di questo vino");this._estimateService=()=>this._aiComplete(["serve_temp","decant","glass"],"serve_temp",()=>"Aggiunti i consigli di servizio","Gemini non ha saputo dire come servirlo")}willUpdate(t){if(t.has("data")&&this._label&&this.data.settings.label_format!==this._label.label_format)this._label=null,this._loadLabel();if(t.has("bottle")){if(t.get("bottle")?.id!==this.bottle.id)this._label=null,this._editing=!1,this._rating=!1,this._reserving=!1,this._loadLabel()}}async _loadLabel(){let t=this.bottle.id;try{let e=await this.card.hass.callWS({type:"tapon/get_label",bottle_id:t});if(this.bottle.id===t)this._label=e}catch{}}_close(){this.dispatchEvent(new CustomEvent("close"))}_sameWineCount(){let t=(e)=>`${(e.name||"").trim().toLowerCase()}|${(e.producer||"").trim().toLowerCase()}|${e.vintage||""}`;return this.data.bottles.filter((e)=>t(e)===t(this.bottle)).length}async _remove(t,e=!1){this._busy=!0;try{let i={type:"tapon/remove_bottle",bottle_id:this.bottle.id,reason:t};if(e){if(this._stars)i.rating=this._stars;if(this._tasting.trim())i.tasting_notes=this._tasting.trim()}if((await this.card.ws(i))?.wishlisted){this.card.toast(`${m(this.bottle)} era l'ultima: l'ho messa nella lista dei desideri da ricomprare ♡`),this._close();return}this.card.toast(e&&this._stars?`${m(this.bottle)}: bevuta, voto ${this._stars}/5. Salute!`:`${m(this.bottle)}: ${this.data.reasons[t]?.toLowerCase()||"tolta"}. La trovi nello storico.`),this._close()}finally{this._busy=!1}}async _saveReserve(t=!1){this._busy=!0;try{await this.card.ws({type:"tapon/reserve_bottle",bottle_id:this.bottle.id,reserved_for:t?"":this._resFor.trim()||"Riservata",reserved_until:t?null:this._resUntil||null}),this.card.toast(t?"Riserva tolta":"Bottiglia riservata: non verrà proposta negli abbinamenti"),this._reserving=!1}finally{this._busy=!1}}async _saveEdit(){this._busy=!0;try{let t=await this.card.ws({type:"tapon/update_bottle",bottle_id:this.bottle.id,changes:this._values,same_wine:this._sameWine});this.card.toast(t.updated>1?`Aggiornate ${t.updated} bottiglie`:"Bottiglia aggiornata"),this._editing=!1,this._label=null,this._loadLabel()}finally{this._busy=!1}}async _printOnPrinter(){let t=await this.card.ws({type:"tapon/request_label",bottle_id:this.bottle.id});this.card.toast(t.printed?"Etichetta stampata":this.data.printer?"Stampa non riuscita: guarda le notifiche di Home Assistant":"Richiesta inviata. Per stampare da solo, scegli la stampante nelle opzioni di Tapon.")}_printInBrowser(){if(!this._label)return;let t=window.open("","_blank","width=480,height=360");if(!t){this.card.toast("Il browser ha bloccato la finestra di stampa");return}let{width_mm:e,height_mm:i}=this._label;t.document.write(`<!doctype html><html><head><title>Etichetta ${this._label.code}</title>
      <style>@page{size:${e}mm ${i}mm;margin:0}html,body{margin:0}img{width:${e}mm;height:${i}mm;display:block}</style></head>
      <body><img src="data:image/png;base64,${this._label.png_base64}"
      onload="setTimeout(function(){window.print();window.close();},150)"></body></html>`),t.document.close()}render(){let t=this.bottle,e=this.data.types[t.type];return a`
      ${w}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(i)=>i.stopPropagation()}>
          <div class="hero">
            <div class="hero-bottle">${k(t.type,t.alert)}</div>
            <div class="hero-text">
              <div class="eyebrow">${e?.label||""}${t.region?` · ${t.region}`:""}</div>
              <div class="dialog-title">${t.name||"Vino"}</div>
              ${t.producer?a`<div class="producer">${t.producer}</div>`:o}
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
    `}_renderView(t,e){let i=Wt(t);return a`
      <div class="badges">
        ${t.opened_at?a`<span class="badge opened ${t.opened_state||""}">🍾 ${rt(t)}</span>`:o}
        ${t.alert==="closing"?a`<span class="badge warn">Da bere presto</span>`:o}
        ${t.alert==="past"?a`<span class="badge bad">Oltre la finestra</span>`:o}
        ${t.opened_at?o:a`<span class="where">📍 ${K(t,this.data.racks)}</span>`}
        ${!this._reserving?a`<button class="btn small res-btn" @click=${()=>{this._resFor=t.reserved_for||"",this._resUntil=t.reserved_until||"",this._reserving=!0}}>${t.reserved_for?"\uD83D\uDD12 Modifica riserva":"\uD83D\uDD12 Riserva"}</button>`:o}
      </div>
      ${t.reserved_for&&!this._reserving?a`<div class="reserved">🔒 <b>Riservata</b>: ${t.reserved_for}${t.reserved_until?a` · ${new Date(t.reserved_until+"T12:00").toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"})}`:o}
            <div class="note">Non viene proposta negli abbinamenti${t.reserved_until?"; quel giorno ti arriva un promemoria":""}.</div></div>`:o}
      ${this._reserving?a`<div class="reserve-form">
            <div class="form">
              <label class="field">Per cosa
                <input type="text" maxlength="200" placeholder="Es. anniversario, annata di nascita…" .value=${this._resFor}
                  @input=${(s)=>this._resFor=s.target.value} /></label>
              <label class="field">Quando (facoltativo)
                <input type="date" .value=${this._resUntil}
                  @input=${(s)=>this._resUntil=s.target.value} /></label>
            </div>
            <div class="row" style="justify-content:flex-end;margin-top:10px">
              ${t.reserved_for?a`<button class="btn small" ?disabled=${this._busy} @click=${()=>this._saveReserve(!0)}>Togli riserva</button>`:o}
              <button class="btn small" @click=${()=>this._reserving=!1}>Annulla</button>
              <button class="btn small primary" ?disabled=${this._busy} @click=${()=>this._saveReserve()}>Salva</button>
            </div>
          </div>`:o}
      ${t.past_count||t.past_notes?a`<div class="past">
            <span class="past-head">Già bevuto${t.past_count?a` ${t.past_count===1?"una volta":`${t.past_count} volte`}`:o}</span>
            ${t.past_rating?a`${A(t.past_rating)} <b>${B(t.past_rating)}</b>`:o}
            ${t.past_notes?a`<div class="past-notes">«${t.past_notes}»</div>`:o}
          </div>`:o}
      <dl class="facts">
        ${Q.filter((s)=>!["name","producer","vintage","drink_from","drink_until","drink_peak","serve_temp","decant","glass"].includes(s.key)).map((s)=>{let r=t[s.key];if(r==null||r==="")return o;return a`<dt>${s.label}</dt><dd>${s.key==="price"?`${Number(r).toFixed(2)} €`:r}</dd>`})}
        ${i?a`<dt>Finestra di beva</dt><dd>${i}</dd>`:o}
      </dl>
      ${this._renderService(t)}
      ${this._renderMaturity(t)}
      <div class="label-box">
        ${this._label?a`<img class="label ${this._label.label_format}" alt="Etichetta QR" src="data:image/png;base64,${this._label.png_base64}" />`:a`<div class="note">Preparo l'etichetta…</div>`}
        <div class="note">Inquadra il QR con l'app Home Assistant quando prendi la bottiglia: verrà tolta dalla cantina.</div>
        <div class="row">
          <button class="btn small" @click=${this._printOnPrinter}>🖨️ Stampante etichette</button>
          <button class="btn small" ?disabled=${!this._label} @click=${this._printInBrowser}>Stampa dal browser</button>
        </div>
      </div>
      ${this._otherReason?a`<div class="reasons">
            ${Object.entries(this.data.reasons).filter(([s])=>s!=="drank").map(([s,r])=>a`<button class="btn small ${s==="deleted"?"danger":""}" ?disabled=${this._busy}
                @click=${()=>this._remove(s)}>${r}</button>`)}
          </div>`:o}
    `}_renderViewFoot(){return a`<div class="dialog-foot">
      <button class="btn" @click=${()=>this.dispatchEvent(new CustomEvent("move",{detail:{bottle:this.bottle}}))}>↔ Sposta</button>
      <button class="btn" @click=${()=>{this._values=Object.fromEntries(["type",...Q.map((t)=>t.key)].map((t)=>[t,this.bottle[t]??""])),this._sameWine=!0,this._editing=!0}}>✏️ Modifica</button>
      <button class="btn" @click=${()=>this._otherReason=!this._otherReason}>Altro…</button>
      ${this.bottle.opened_at?o:a`<button class="btn" ?disabled=${this._busy} title="Aperta ma non finita: ti ricordo di finirla"
            @click=${this._open}>🍾 Aperta</button>`}
      <button class="btn primary" ?disabled=${this._busy} @click=${()=>{this._stars=null,this._tasting="",this._rating=!0}}>🍷 ${this.bottle.opened_at?"Finita":"Bevuta"}</button>
    </div>`}_renderMaturity(t){let e=Qt(t),i=this.data.ai&&!t.drink_peak?a`<button class="btn small" ?disabled=${this._busy} @click=${this._estimatePeak}>✨ Stima il picco</button>`:o;if(!e)return this.data.ai?a`<div class="maturity empty">${i}</div>`:o;return a`<div class="maturity ph-${e.phase}">
      <div class="m-head"><span class="m-label">${e.label}</span>${i}</div>
      <div class="m-bar" style=${e.peakPos!=null?`background:linear-gradient(90deg,#5c6bc0 0%,#7cb342 ${Math.max(0,e.peakPos-22)}%,#e3b341 ${Math.max(0,e.peakPos-4)}%,#e3b341 ${Math.min(100,e.peakPos+4)}%,#ef6c00 ${Math.min(100,e.peakPos+22)}%,#8d2b2b 100%)`:""}>
        ${e.peakPos!=null?a`<span class="m-peak" style="left:${e.peakPos}%" title="Picco ${e.peak}"></span>`:o}
        <span class="m-today" style="left:${e.today}%" title="Oggi"></span>
      </div>
      <div class="m-scale"><span>${e.start}</span>
        ${e.peak&&e.peakPos!=null&&e.peakPos>14&&e.peakPos<86?a`<span class="m-peak-label" style="left:${e.peakPos}%">picco ${e.peak}</span>`:o}
        <span>${e.end}</span></div>
    </div>`}async _aiComplete(t,e,i,s){this._busy=!0;try{let r=this.bottle,d=(await this.card.ws({type:"tapon/ai_fill",wine:{name:r.name,producer:r.producer,vintage:r.vintage,type:r.type,region:r.region,grape:r.grape}})).wine||{},n={};for(let h of t)if(d[h]&&!r[h])n[h]=d[h];if("drink_peak"in n){let h=Number(n.drink_from??r.drink_from)||0,_=Number(n.drink_until??r.drink_until)||9999;n.drink_peak=Math.min(_,Math.max(h,Number(n.drink_peak)))}if(!n[e]){this.card.toast(s);return}await this.card.ws({type:"tapon/update_bottle",bottle_id:r.id,changes:n,same_wine:!0}),this.card.toast(i(n))}catch{}finally{this._busy=!1}}_renderService(t){let e=J(t);if(!e.length&&!this.data.ai)return o;return a`<div class="service">
      ${e.length?e.map((i)=>a`<span class="svc">${i}</span>`):a`<button class="btn small" ?disabled=${this._busy} @click=${this._estimateService}>✨ Come servirlo</button>`}
    </div>`}async _open(){this._busy=!0;try{let t=await this.card.ws({type:"tapon/open_bottle",bottle_id:this.bottle.id});this.card.toast(`Segnata come aperta: ti ricordo di finirla entro ${t.limit} giorni`),this._close()}finally{this._busy=!1}}_renderRate(){return a`<div class="rate">
      ${this.bottle.reserved_for?a`<div class="note">🔒 Era riservata: «${this.bottle.reserved_for}»</div>`:o}
      <div class="rate-q">Com'era?</div>
      ${A(this._stars,(t)=>this._stars=t,!0)}
      <div class="rate-hint">${["Tocca le stelle per votarla","Deludente","Così così","Buono","Molto buono","Eccezionale"][this._stars||0]}</div>
      <textarea class="tasting" rows="3" maxlength="1000"
        placeholder="Note di degustazione (facoltative): profumi, con cosa l'avete bevuta, se ricomprarla…"
        .value=${this._tasting} @input=${(t)=>this._tasting=t.target.value}></textarea>
      <div class="note">Il voto resta nello storico e aiuta gli abbinamenti a proporti i vini che ti sono piaciuti di più.</div>
    </div>`}_renderRateFoot(){let t=!this._stars&&!this._tasting.trim();return a`<div class="dialog-foot">
      <button class="btn" ?disabled=${this._busy} @click=${()=>this._rating=!1}>Annulla</button>
      <button class="btn primary" ?disabled=${this._busy} @click=${()=>this._remove("drank",!0)}>
        ${t?"Togli senza voto":"\uD83C\uDF77 Salva e togli"}
      </button>
    </div>`}_renderEdit(){let t=this._sameWineCount();return a`
      ${gt(this.data,this._values,(e,i)=>this._values={...this._values,[e]:i})}
      ${t>1?a`<label class="check"><input type="checkbox" .checked=${this._sameWine}
            @change=${(e)=>this._sameWine=e.target.checked} />
            Applica a tutte le ${t} bottiglie di questo vino</label>`:o}
    `}_renderEditFoot(){return a`<div class="dialog-foot">
      <button class="btn" @click=${()=>this._editing=!1}>Annulla</button>
      <button class="btn primary" ?disabled=${this._busy} @click=${this._saveEdit}>Salva</button>
    </div>`}static styles=[x,f`
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
    `]}p([g({attribute:!1})],mt.prototype,"card",void 0),p([g({attribute:!1})],mt.prototype,"data",void 0),p([g({attribute:!1})],mt.prototype,"bottle",void 0),p([u()],mt.prototype,"_label",void 0),p([u()],mt.prototype,"_editing",void 0),p([u()],mt.prototype,"_values",void 0),p([u()],mt.prototype,"_sameWine",void 0),p([u()],mt.prototype,"_otherReason",void 0),p([u()],mt.prototype,"_busy",void 0),p([u()],mt.prototype,"_rating",void 0),p([u()],mt.prototype,"_stars",void 0),p([u()],mt.prototype,"_tasting",void 0),p([u()],mt.prototype,"_reserving",void 0),p([u()],mt.prototype,"_resFor",void 0),p([u()],mt.prototype,"_resUntil",void 0),mt=p([y("tb-bottle-dialog")],mt);var vt=30;class ft extends v{constructor(){super(...arguments);this._drafts={};this._open=null}_close(){this.dispatchEvent(new CustomEvent("close"))}_draft(t){return this._drafts[t.id]||{name:t.name,shelves:[...W(t)]}}_edit(t,e){let i=this._draft(t),s={name:i.name,shelves:[...i.shelves]};e(s),this._drafts={...this._drafts,[t.id]:s}}_setShelfCount(t,e){this._edit(t,(i)=>{e=Math.max(1,Math.min(vt,e));let s=i.shelves[i.shelves.length-1]||6;while(i.shelves.length<e)i.shelves.push(s);i.shelves.length=e})}_setShelf(t,e,i){this._edit(t,(s)=>s.shelves[e]=Math.max(1,Math.min(vt,i)))}_setAll(t,e){this._edit(t,(i)=>i.shelves=i.shelves.map(()=>Math.max(1,Math.min(vt,e))))}_count(t){return this.data.bottles.filter((e)=>e.rack_id===t).length}async _save(t){let e=this._draft(t),i=await this.card.ws({type:"tapon/save_rack",rack:{id:t.id,name:e.name,shelves:e.shelves}}),s={...this._drafts};delete s[t.id],this._drafts=s,this.card.toast(i.displaced?`Salvato. ${i.displaced} bottiglie sono finite in "Da sistemare".`:"Scaffale salvato")}async _delete(t){let e=this._count(t.id);if(!confirm(`Eliminare "${t.name}"?${e?` Le sue ${e} bottiglie restano in cantina, in "Da sistemare".`:""}`))return;await this.card.ws({type:"tapon/delete_rack",rack_id:t.id}),this.card.toast("Scaffale eliminato")}async _add(){let t=await this.card.ws({type:"tapon/save_rack",rack:{name:`Scaffale ${this.data.racks.length+1}`,shelves:[8,8,8,8,8]}});this._open=t.rack.id}async _setting(t,e){await this.card.ws({type:"tapon/update_settings",[t]:e})}_stepper(t,e){return a`<span class="stepper">
      <button @click=${()=>e(t-1)} aria-label="meno">−</button>
      <span>${t}</span>
      <button @click=${()=>e(t+1)} aria-label="più">+</button>
    </span>`}_preview(t){let e=Math.max(...t);return a`<div class="preview">
      ${t.map((i)=>a`<div class="pv-shelf">
        <div class="pv-row" style="grid-template-columns: repeat(${i}, 1fr); width: ${i/e*100}%">
          ${Array.from({length:i},()=>a`<i></i>`)}
        </div>
        <div class="pv-board"></div>
      </div>`)}
    </div>`}_renderRack(t){let e=this._draft(t),i=!!this._drafts[t.id],s=this._open===t.id||i,r=e.shelves.every((d)=>d===e.shelves[0]),l=e.shelves.reduce((d,n)=>d+n,0);return a`<div class="rack ${s?"open":""}">
      <button class="rack-sum" @click=${()=>this._open=s&&!i?null:t.id}>
        <span class="rack-name">${e.name}</span>
        <span class="note">${e.shelves.length} mensole · ${l} posti · ${this._count(t.id)} bottiglie</span>
        <span class="chev">${s?"▴":"▾"}</span>
      </button>
      ${s?a`<div class="rack-edit">
            <div class="cols">
              <div class="controls">
                <label class="field">Nome
                  <input .value=${e.name} @input=${(d)=>this._edit(t,(n)=>n.name=d.target.value)} />
                </label>
                <div class="line"><span>Mensole</span>${this._stepper(e.shelves.length,(d)=>this._setShelfCount(t,d))}</div>
                <div class="line">
                  <span>Bottiglie per mensola${r?"":a` <em class="note">(diverse)</em>`}</span>
                  ${this._stepper(r?e.shelves[0]:Math.max(...e.shelves),(d)=>this._setAll(t,d))}
                </div>
                <details ?open=${!r}>
                  <summary>Personalizza ogni mensola</summary>
                  ${e.shelves.map((d,n)=>a`<div class="line small">
                    <span>Mensola ${n+1}${n===0?" (in alto)":n===e.shelves.length-1?" (in basso)":""}</span>
                    ${this._stepper(d,(h)=>this._setShelf(t,n,h))}
                  </div>`)}
                </details>
              </div>
              ${this._preview(e.shelves)}
            </div>
            <div class="rack-foot">
              <button class="btn small danger" @click=${()=>this._delete(t)}>Elimina scaffale</button>
              <span>
                ${i?a`<button class="btn small" @click=${()=>{let d={...this._drafts};delete d[t.id],this._drafts=d}}>Annulla</button>`:o}
                <button class="btn small primary" ?disabled=${!i} @click=${()=>this._save(t)}>Salva</button>
              </span>
            </div>
          </div>`:o}
    </div>`}async _inventory(t){await this.card.ws({type:"tapon/inventory_start",rack_id:t}),this.card.toast("Inventario avviato: scansiona le bottiglie"),this._close()}render(){let t=this.data.settings,e=this.data.racks.reduce((i,s)=>i+Y(s),0);return a`
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(i)=>i.stopPropagation()}>
          <div class="dialog-head">
            <div>
              <div class="eyebrow">La tua cantina</div>
              <div class="dialog-title">Scaffali e impostazioni</div>
            </div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="section" style="margin-top:4px">Scaffali · ${e} posti</div>
            ${this.data.racks.map((i)=>this._renderRack(i))}
            <button class="btn" @click=${this._add}>＋ Nuovo scaffale</button>

            <div class="section">Etichette</div>
            <div class="types" style="margin-bottom:12px">
              ${[["qr","Solo QR · 23 × 23 mm"],["qr30","Solo QR · 30 × 30 mm"],["full","QR e dati del vino · 50 × 30 mm"]].map(([i,s])=>a`<button class="chip ${t.label_format===i?"active":""}"
                  @click=${()=>this._setting("label_format",i)}>${s}</button>`)}
            </div>
            <label class="check">
              <input type="checkbox" .checked=${t.auto_labels}
                @change=${(i)=>this._setting("auto_labels",i.target.checked)} />
              Stampa l'etichetta QR quando aggiungo una bottiglia
            </label>

            <div class="section">Controllo inventario</div>
            <div class="note" style="margin-bottom:8px">
              Scansiona una per una le bottiglie (con il telefono o con lo scanner): in questa modalità
              non viene tolto nulla, alla fine vedi cosa manca, cosa è fuori posto e cosa risultava già bevuto.
            </div>
            <div class="types" style="margin-bottom:12px">
              <button class="chip" @click=${()=>this._inventory(null)}>Tutta la cantina</button>
              ${this.data.racks.length>1?this.data.racks.map((i)=>a`<button class="chip" @click=${()=>this._inventory(i.id)}>Solo ${i.name}</button>`):o}
            </div>

            <div class="section">Finestra di beva</div>
            <div class="note" style="margin-bottom:8px">Avvisami prima che si chiuda:</div>
            <div class="types">
              ${[[90,"3 mesi"],[180,"6 mesi"],[365,"1 anno"]].map(([i,s])=>a`<button class="chip ${t.alert_days===i?"active":""}"
                  @click=${()=>this._setting("alert_days",i)}>${s}</button>`)}
            </div>
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}static styles=[x,f`
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
    `]}p([g({attribute:!1})],ft.prototype,"card",void 0),p([g({attribute:!1})],ft.prototype,"data",void 0),p([u()],ft.prototype,"_drafts",void 0),p([u()],ft.prototype,"_open",void 0),ft=p([y("tb-racks-dialog")],ft);class _t extends v{constructor(){super(...arguments);this._items=null;this._editing=null;this._stars=null;this._tasting=""}connectedCallback(){super.connectedCallback(),this._load()}async _load(){let t=await this.card.ws({type:"tapon/get_history"});this._items=t.history}_close(){this.dispatchEvent(new CustomEvent("close"))}async _restore(t){let e=await this.card.ws({type:"tapon/restore",history_id:t.history_id});this.card.toast(e.bottle.rack_id?"Rimessa al suo posto":'Rimessa in cantina, in "Da sistemare"'),this._load()}_edit(t){this._editing=this._editing===t.history_id?null:t.history_id,this._stars=t.rating??null,this._tasting=t.tasting_notes||""}async _saveRating(t){let e=await this.card.ws({type:"tapon/rate_history",history_id:t.history_id,rating:this._stars,tasting_notes:this._tasting.trim()});this._editing=null,this.card.toast(e?.wishlisted?"Voto salvato. Era l'ultima: messa nei desideri da ricomprare ♡":"Voto salvato"),this._load()}render(){return a`
      ${w}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(t)=>t.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Bottiglie stappate e non solo</div><div class="dialog-title">Storico</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${this._items===null?a`<div class="note">Carico…</div>`:!this._items.length?a`<div class="note">Ancora nessuna bottiglia tolta dalla cantina.</div>`:this._items.map((t)=>this._renderItem(t))}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}_renderItem(t){let e=t.reason==="drank",i=this._editing===t.history_id;return a`<div class="item ${i?"open":""}">
      <div class="line">
        <span class="mini">${k(t.type)}</span>
        <div class="text">
          <div>${m(t)}</div>
          <div class="note">${this.data.reasons[t.reason]||t.reason} · ${new Date(t.removed_at).toLocaleDateString("it-IT")}
            ${t.producer?a` · ${t.producer}`:o}</div>
          ${e&&!i?a`<button class="vote" @click=${()=>this._edit(t)} title="Vota o scrivi una nota">
                ${t.rating?A(t.rating):a`<span class="add-vote">☆ Vota</span>`}
                ${t.tasting_notes?a`<span class="tn">«${t.tasting_notes}»</span>`:o}
              </button>`:o}
        </div>
        <button class="btn small" @click=${()=>this._restore(t)}>Rimetti</button>
      </div>
      ${i?a`<div class="editor">
            ${A(this._stars,(s)=>this._stars=s,!0)}
            <textarea rows="2" maxlength="1000" placeholder="Note di degustazione…" .value=${this._tasting}
              @input=${(s)=>this._tasting=s.target.value}></textarea>
            <div class="row">
              <button class="btn small" @click=${()=>this._editing=null}>Annulla</button>
              <button class="btn small primary" @click=${()=>this._saveRating(t)}>Salva</button>
            </div>
          </div>`:o}
    </div>`}static styles=[x,f`
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
    `]}p([g({attribute:!1})],_t.prototype,"card",void 0),p([g({attribute:!1})],_t.prototype,"data",void 0),p([u()],_t.prototype,"_items",void 0),p([u()],_t.prototype,"_editing",void 0),p([u()],_t.prototype,"_stars",void 0),p([u()],_t.prototype,"_tasting",void 0),_t=p([y("tb-history-dialog")],_t);var me=["Antipasto","Primo","Secondo","Dolce"],ve=["Brasato","Pesce al forno","Crudi di mare","Pizza","Formaggi stagionati","Risotto ai funghi","Dolce"];class yt extends v{constructor(){super(...arguments);this._dish="";this._busy=!1;this._result=null;this._asked="";this._mode="dish";this._courses=["","","",""]}firstUpdated(){this.renderRoot.querySelector("input")?.focus()}_close(){this.dispatchEvent(new CustomEvent("close"))}async _ask(t=this._dish){if(t=t.trim(),!t||this._busy)return;this._dish=t,this._busy=!0,this._result=null;try{this._result=await this.card.ws({type:"tapon/pair",dish:t}),this._asked=t}catch{}finally{this._busy=!1}}async _askMenu(){let t=this._courses.map((e)=>e.trim()).filter(Boolean);if(!t.length||this._busy)return;this._busy=!0,this._result=null;try{this._result=await this.card.ws({type:"tapon/pair",courses:t}),this._asked=t.join(" · ")}catch{}finally{this._busy=!1}}_setMode(t){if(this._mode===t)return;this._mode=t,this._result=null}async _light(t,e){if(!t.length)return;await this.card.ws({type:"tapon/highlight",source:e,query:this._asked,groups:t}),this.card.toast("Illuminate sullo scaffale: si spengono quando ne prendi una"),this._close()}_open(t){this.dispatchEvent(new CustomEvent("open-bottle",{detail:{bottleId:t.bottle_ids[0]}}))}render(){let t=this._result;return a`
      ${w}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e)=>e.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Dalla tua cantina</div><div class="dialog-title">Cosa si mangia?</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="modes">
              <button class="chip ${this._mode==="dish"?"active":""}" @click=${()=>this._setMode("dish")}>Un piatto</button>
              <button class="chip ${this._mode==="menu"?"active":""}" @click=${()=>this._setMode("menu")}>Menu della serata</button>
            </div>
            ${this._mode==="dish"?this._renderDishForm(t):this._renderMenuForm()}
            ${this._busy?a`<div class="note waiting">Il sommelier sta guardando gli scaffali…</div>`:o}
            ${t?t.courses?this._renderMenuResult(t):this._renderResult(t):o}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}_renderDishForm(t){return a`
      <form class="ask" @submit=${(e)=>{e.preventDefault(),this._ask()}}>
        <input class="dish" type="text" placeholder="Es. tagliata al rosmarino, spaghetti alle vongole…"
          .value=${this._dish} maxlength="300"
          @input=${(e)=>this._dish=e.target.value} />
        <button class="btn primary" type="submit" ?disabled=${this._busy||!this._dish.trim()}>
          ${this._busy?"Ci penso…":"Consiglia"}
        </button>
      </form>
      ${!t&&!this._busy?a`<div class="quick">
            ${ve.map((e)=>a`<button class="chip" @click=${()=>this._ask(e)}>${e}</button>`)}
          </div>`:o}
    `}_renderMenuForm(){let t=(i,s)=>this._courses=this._courses.map((r,l)=>l===i?s:r),e=this._courses.some((i)=>i.trim());return a`
      <form class="menu" @submit=${(i)=>{i.preventDefault(),this._askMenu()}}>
        ${this._courses.map((i,s)=>a`<div class="course">
          <span class="num">${s+1}</span>
          <input class="dish" type="text" maxlength="200" .value=${i}
            placeholder=${`${me[s]||"Portata"}${s===0?", es. crudi di mare":s===1?", es. risotto ai funghi":s===2?", es. brasato":", es. crostata"}`}
            @input=${(r)=>t(s,r.target.value)} />
          ${this._courses.length>1?a`<button type="button" class="close mini-x" title="Togli portata"
                @click=${()=>this._courses=this._courses.filter((r,l)=>l!==s)}>✕</button>`:o}
        </div>`)}
        <div class="menu-actions">
          ${this._courses.length<8?a`<button type="button" class="btn small" @click=${()=>this._courses=[...this._courses,""]}>＋ Portata</button>`:a`<span></span>`}
          <button class="btn primary" type="submit" ?disabled=${this._busy||!e}>
            ${this._busy?"Ci penso…":"Componi i vini"}
          </button>
        </div>
        <div class="note">Lascia vuote le portate che non ci sono.</div>
      </form>
    `}_wineCard(t,e={}){let i={closing:"Da bere presto",past:"Oltre la finestra",wait:"Ancora giovane"},s=e.reason??t.reason;return a`<button class="pick ${e.best?"best":""} ${e.compact?"compact":""}" @click=${()=>this._open(t)}>
      <span class="mini">${k(t.type,t.status==="closing"||t.status==="past"?t.status:null)}</span>
      <div class="text">
        <div class="wine">
          ${e.best?a`<span class="badge">Il migliore</span>`:o}
          ${m(t)}
          ${i[t.status]?a`<span class="state ${t.status}">${i[t.status]}</span>`:o}
          ${t.opened?a`<span class="state open">🍾 già aperta</span>`:o}
        </div>
        ${t.producer||t.rating?a`<div class="note">${t.producer||""}${t.rating?a`<span class="your">${t.producer?" · ":""}il tuo voto ${A(t.rating)} ${B(t.rating)}</span>`:o}</div>`:o}
        ${s?a`<div class="reason">${s}</div>`:o}
        ${J(t).length?a`<div class="svc-line">${J(t).join(" · ")}</div>`:o}
        <div class="where">📍 ${t.locations[0]}${t.bottles>1?a` · ${t.bottles} bottiglie`:o}</div>
      </div>
      <span class="go">›</span>
    </button>`}_renderMenuResult(t){let e=t.courses||[];return a`
      <div class="eyebrow small">Il percorso</div>
      <div class="path">
        ${e.map((i,s)=>a`<div class="step">
          <div class="step-head"><span class="num" style="--c:${X[s%X.length]}">${s+1}</span>${i.course.charAt(0).toUpperCase()+i.course.slice(1)}</div>
          ${i.wine?this._wineCard(i.wine,{compact:!0,reason:i.reason}):a`<div class="note nothing">Nessun vino della cantina è adatto a questa portata.</div>`}
        </div>`)}
      </div>
      ${e.some((i)=>i.wine)?a`<button class="btn primary light" @click=${()=>this._light(e.map((i,s)=>({label:i.course,color:X[s%X.length],bottle_ids:i.wine?.bottle_ids||[]})).filter((i)=>i.bottle_ids.length),"menu")}>💡 Illumina il percorso sullo scaffale</button>`:o}
      ${t.one?a`<div class="eyebrow small">Oppure un vino per tutta la cena</div>${this._wineCard(t.one,{best:!0})}
            <button class="btn small light" @click=${()=>this._light([{label:"Tutta la cena",color:O,bottle_ids:t.one.bottle_ids}],"pair")}>💡 Illumina questo</button>`:o}
      ${t.advice?a`<div class="advice ${t.source}">${t.source==="ai"?"\uD83C\uDF77 ":"ℹ️ "}${t.advice}</div>`:o}
    `}_renderResult(t){return a`
      ${!(t.picks||[]).length?a`<div class="note">Nessun vino della cantina è davvero adatto a «${this._asked}».</div>`:a`<div class="eyebrow small">Per «${this._asked}»</div>`}
      ${(t.picks||[]).map((e,i)=>this._wineCard(e,{best:i===0}))}
      ${(t.picks||[]).length?a`<button class="btn primary light" @click=${()=>this._light([{label:this._asked,color:O,bottle_ids:(t.picks||[]).flatMap((e)=>e.bottle_ids)}],"pair")}>
            💡 Illumina sullo scaffale</button>`:o}
      ${t.advice?a`<div class="advice ${t.source}">${t.source==="ai"?"\uD83C\uDF77 ":"ℹ️ "}${t.advice}</div>`:o}
    `}static styles=[x,f`
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
    `]}p([g({attribute:!1})],yt.prototype,"card",void 0),p([g({attribute:!1})],yt.prototype,"data",void 0),p([u()],yt.prototype,"_dish",void 0),p([u()],yt.prototype,"_busy",void 0),p([u()],yt.prototype,"_result",void 0),p([u()],yt.prototype,"_asked",void 0),p([u()],yt.prototype,"_mode",void 0),p([u()],yt.prototype,"_courses",void 0),yt=p([y("tb-pair-dialog")],yt);class $t extends v{constructor(){super(...arguments)}_close(){this.dispatchEvent(new CustomEvent("close"))}async _remove(t){await this.card.ws({type:"tapon/wishlist_remove",wish_id:t.id}),this.card.toast(`${m(t)} tolto dai desideri`)}render(){let t=this.data.wishlist||[];return a`
      ${w}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(e)=>e.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Da comprare</div><div class="dialog-title">Lista dei desideri</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${!t.length?a`<div class="empty-wish">
                  <div class="big">♡</div>
                  <div>Ancora vuota.</div>
                  <div class="note">Aggiungi i vini assaggiati al ristorante o da amici: basta una foto dell'etichetta.
                    Anche quando finisci l'ultima bottiglia di un vino a cui hai dato 4 o 5 stelle, finisce qui da solo.</div>
                </div>`:t.map((e)=>this._renderWish(e))}
          </div>
          <div class="dialog-foot">
            <button class="btn" @click=${this._close}>Chiudi</button>
            <button class="btn primary" @click=${()=>this.dispatchEvent(new CustomEvent("add-wish"))}>＋ Aggiungi desiderio</button>
          </div>
        </div>
      </div>
    `}_renderWish(t){let e=this.data.types[t.type];return a`<div class="wish">
      <span class="mini">${k(t.type)}</span>
      <div class="text">
        <div class="title">
          ${m(t)}
          ${t.source==="rebuy"?a`<span class="tag">Da ricomprare</span>`:o}
        </div>
        <div class="note">${[t.producer,e?.label,t.region].filter(Boolean).join(" · ")}</div>
        ${t.rating?a`<div class="note">Il tuo voto ${A(t.rating)}</div>`:o}
        ${t.where?a`<div class="note">📍 ${t.where}</div>`:o}
        ${t.wish_notes?a`<div class="note italic">${t.wish_notes}</div>`:o}
      </div>
      <div class="acts">
        <button class="btn small primary" title="L'ho comprato: mettilo in cantina"
          @click=${()=>this.dispatchEvent(new CustomEvent("buy",{detail:{wish:t}}))}>🛒 Comprato</button>
        <button class="btn small" title="Togli dalla lista" @click=${()=>this._remove(t)}>✕</button>
      </div>
    </div>`}static styles=[x,f`
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
    `]}p([g({attribute:!1})],$t.prototype,"card",void 0),p([g({attribute:!1})],$t.prototype,"data",void 0),$t=p([y("tb-wishlist-dialog")],$t);class xt extends v{constructor(){super(...arguments);this._history=[];this._done=new Set;this._busy=!1}connectedCallback(){if(super.connectedCallback(),this.report?.found_taken.length)this.card.ws({type:"tapon/get_history"}).then((t)=>this._history=t.history)}_close(){this.dispatchEvent(new CustomEvent("close"))}async _removeMissing(t){this._busy=!0;try{let e=await this.card.ws({type:"tapon/remove_bottles",bottle_ids:t,reason:"missing"});t.forEach((i)=>this._done.add(i)),this._done=new Set(this._done),this.card.toast(`${e.removed} bottiglie tolte come "non trovate": le ritrovi nello storico`)}finally{this._busy=!1}}async _restore(t){this._busy=!0;try{for(let e of t)await this.card.ws({type:"tapon/restore",history_id:e});t.forEach((e)=>this._done.add(e)),this._done=new Set(this._done),this.card.toast(t.length>1?`${t.length} bottiglie rimesse in cantina`:"Rimessa in cantina")}finally{this._busy=!1}}render(){let t=this.report,e=new Map(this.data.bottles.map((n)=>[n.id,n])),i=t.missing.filter((n)=>!this._done.has(n)).map((n)=>e.get(n)).filter(Boolean),s=t.misplaced.map((n)=>e.get(n)).filter(Boolean),r=t.found_taken.filter((n)=>!this._done.has(n)).map((n)=>this._history.find((h)=>h.history_id===n)).filter(Boolean),l=this.data.racks.find((n)=>n.id===t.rack_id),d=!i.length&&!s.length&&!t.found_taken.length&&!t.unknown;return a`
      ${w}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(n)=>n.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">Inventario${l?` · ${l.name}`:""}</div>
              <div class="dialog-title">${t.seen} su ${t.total} trovate</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            ${d?a`<div class="ok">✓ Tutto in ordine: la cantina corrisponde all'app.</div>`:o}

            ${i.length?a`<div class="section">Non trovate (${i.length})</div>
                  <div class="note">Sono nell'app ma non le hai scansionate. Se sono davvero sparite, toglile.</div>
                  ${i.map((n)=>this._row(n,K(n,this.data.racks)))}
                  <button class="btn small danger" ?disabled=${this._busy} @click=${()=>this._removeMissing(i.map((n)=>n.id))}>
                    Togli tutte le ${i.length} come "non trovate"</button>`:o}

            ${r.length?a`<div class="section">Risultavano già tolte (${r.length})</div>
                  <div class="note">Le hai scansionate, quindi sono ancora in cantina: rimettile.</div>
                  ${r.map((n)=>this._row(n,`Tolta il ${new Date(n.removed_at).toLocaleDateString("it-IT")}`))}
                  <button class="btn small primary" ?disabled=${this._busy}
                    @click=${()=>this._restore(r.map((n)=>n.history_id))}>Rimetti in cantina</button>`:o}

            ${s.length?a`<div class="section">Fuori posto (${s.length})</div>
                  <div class="note">Trovate in ${l?.name||"questo scaffale"}, ma registrate altrove. Tocca per aprirle e spostarle.</div>
                  ${s.map((n)=>this._row(n,`Registrata in: ${K(n,this.data.racks)}`,!0))}`:o}

            ${t.unknown?a`<div class="section">Codici sconosciuti</div>
                  <div class="note">${t.unknown} QR non corrispondono a nessuna bottiglia: forse etichette vecchie da sostituire.</div>`:o}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}_row(t,e,i=!1){return a`<div class="row ${i?"link":""}"
      @click=${i?()=>this.dispatchEvent(new CustomEvent("open-bottle",{detail:{bottleId:t.id}})):null}>
      <span class="mini">${k(t.type)}</span>
      <div class="text"><div>${m(t)}${t.producer?a` <span class="note">· ${t.producer}</span>`:o}</div>
        <div class="note">${e}</div></div>
      ${i?a`<span class="go">›</span>`:o}
    </div>`}static styles=[x,f`
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
    `]}p([g({attribute:!1})],xt.prototype,"card",void 0),p([g({attribute:!1})],xt.prototype,"data",void 0),p([g({attribute:!1})],xt.prototype,"report",void 0),p([u()],xt.prototype,"_history",void 0),p([u()],xt.prototype,"_done",void 0),p([u()],xt.prototype,"_busy",void 0),xt=p([y("tb-inventory-dialog")],xt);class kt extends v{constructor(){super(...arguments);this._text="";this._busy="";this._photo="";this._result=null}_close(){this.dispatchEvent(new CustomEvent("close"))}async _onPhoto(t){let e=t.target,i=e.files?.[0];if(e.value="",!i)return;this._photo=await bt(i),this._check({image:this._photo},"Leggo l'etichetta…")}_onText(t){t.preventDefault();let e=this._text.trim();if(!e)return;let i=e.match(/\b(19|20)\d\d\b/),s=e.replace(/\b(19|20)\d\d\b/,"").replace(/\s+/g," ").trim();this._photo="",this._check({wine:{name:s,...i?{vintage:Number(i[0])}:{}}},"Cerco…")}async _check(t,e){this._busy=e,this._result=null;try{this._result=await this.card.ws({type:"tapon/check_wine",...t})}catch{}finally{this._busy=""}}async _wish(){let t=this._result.wine;await this.card.ws({type:"tapon/wishlist_add",wine:t,where:"",wish_notes:""}),this.card.toast(`${m(t)} aggiunto ai desideri`),this._result={...this._result,wished:[{...t,match:"same",wish_id:"",source:"manual"}]}}async _light(){let t=this._result.cellar.flatMap((e)=>e.bottle_ids);await this.card.ws({type:"tapon/highlight",source:"search",query:m(this._result.wine),groups:[{label:m(this._result.wine),color:O,bottle_ids:t}]}),this._close()}render(){return a`
      ${w}
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${(t)=>t.stopPropagation()}>
          <div class="dialog-head">
            <div><div class="eyebrow">In enoteca o al ristorante</div><div class="dialog-title">Ce l'ho già?</div></div>
            <button class="close" @click=${this._close}>✕</button>
          </div>
          <div class="dialog-body">
            <div class="ask">
              <label class="shot ${this._photo?"has":""} ${!this.data.ai?"off":""}"
                title=${this.data.ai?"Fotografa l'etichetta":"Serve la chiave Gemini nelle opzioni"}>
                ${this._photo?a`<img src=${this._photo} alt="Etichetta" />`:a`<span>📷</span>`}
                <span class="shot-label">${this._photo?"Un'altra":"Fotografa l'etichetta"}</span>
                <input type="file" accept="image/*" capture="environment" ?disabled=${!this.data.ai||!!this._busy}
                  @change=${this._onPhoto} />
              </label>
              <form class="by-name" @submit=${this._onText}>
                <span class="note">oppure scrivi nome e annata</span>
                <div class="row">
                  <input class="dish" type="text" placeholder="Es. Barolo Cannubi 2016" .value=${this._text}
                    @input=${(t)=>this._text=t.target.value} />
                  <button class="btn primary" type="submit" ?disabled=${!!this._busy||!this._text.trim()}>Cerca</button>
                </div>
              </form>
            </div>
            ${this._busy?a`<div class="note waiting">${this._busy}</div>`:o}
            ${this._result?this._renderResult(this._result):o}
          </div>
          <div class="dialog-foot"><button class="btn" @click=${this._close}>Chiudi</button></div>
        </div>
      </div>
    `}_renderResult(t){let e=t.wine,s=t.cellar.filter((n)=>n.match==="same").reduce((n,h)=>n+h.bottles,0),r=t.drunk.find((n)=>n.match==="same")||t.drunk.find((n)=>n.match==="vintage"),l;if(s)l=["yes",`Sì, ce l'hai: ${s===1?"1 bottiglia":`${s} bottiglie`}`];else if(t.cellar.some((n)=>n.match==="vintage"))l=["almost","Hai lo stesso vino, ma di un'altra annata"];else if(t.cellar.length)l=["almost","Non proprio questo, ma qualcosa di simile"];else if(r)l=["no","Non in cantina, ma l'hai già bevuto"];else l=["no","No, non ce l'hai"];let d=t.wished.some((n)=>n.match==="same");return a`
      <div class="seen">
        <span class="mini">${k(e.type||"red")}</span>
        <div><div class="seen-title">${m(e)}</div>
          <div class="note">${[e.producer,e.region].filter(Boolean).join(" · ")}</div></div>
      </div>
      <div class="verdict ${l[0]}">${l[1]}</div>

      ${t.cellar.length?a`<div class="section">In cantina</div>
            ${t.cellar.map((n)=>a`<div class="found">
              <div><b>${m(n)}</b>${n.producer?a` <span class="note">· ${n.producer}</span>`:o}
                ${n.match==="similar"?a`<span class="pill">simile</span>`:o}</div>
              <div class="note">${n.bottles} ${n.bottles===1?"bottiglia":"bottiglie"} · 📍 ${[...new Set(n.locations)].slice(0,2).join("; ")}
                ${n.reserved?a` · 🔒 ${n.reserved} riservat${n.reserved===1?"a":"e"}`:o}</div>
            </div>`)}`:o}

      ${t.drunk.length?a`<div class="section">Già bevuto</div>
            ${t.drunk.map((n)=>a`<div class="found">
              <div><b>${m(n)}</b> <span class="note">· ${n.times===1?"una volta":`${n.times} volte`}, l'ultima il
                ${new Date(n.last).toLocaleDateString("it-IT")}</span></div>
              ${n.rating?a`<div>${A(n.rating)} <span class="note">${B(n.rating)}</span></div>`:o}
              ${n.notes?a`<div class="note italic">«${n.notes}»</div>`:o}
            </div>`)}`:o}

      ${t.wished.length?a`<div class="section">Nella lista dei desideri</div>
            ${t.wished.map((n)=>a`<div class="found"><b>${m(n)}</b>
              ${n.source==="rebuy"?a`<span class="pill gold">da ricomprare</span>`:o}</div>`)}`:o}

      <div class="acts">
        ${t.cellar.length?a`<button class="btn small" @click=${this._light}>💡 Illumina</button>`:o}
        ${!d?a`<button class="btn small" @click=${this._wish}>♡ Aggiungi ai desideri</button>`:o}
        <button class="btn small primary" @click=${()=>this.dispatchEvent(new CustomEvent("buy",{detail:{wine:e}}))}>
          🛒 L'ho comprato</button>
      </div>
    `}static styles=[x,f`
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
    `]}p([g({attribute:!1})],kt.prototype,"card",void 0),p([g({attribute:!1})],kt.prototype,"data",void 0),p([u()],kt.prototype,"_text",void 0),p([u()],kt.prototype,"_busy",void 0),p([u()],kt.prototype,"_photo",void 0),p([u()],kt.prototype,"_result",void 0),kt=p([y("tb-check-dialog")],kt);class wt extends v{constructor(){super(...arguments);this._config={type:"custom:tapon-card"};this._data=null;this._error="";this._typeFilter="";this._query="";this._dialog=null;this._moving=null;this._toast="";this._subscribing=!1;this._startMove=(t)=>{this._moving=t.detail.bottle,this._dialog=null}}setConfig(t){this._config={...t}}static getStubConfig(){return{type:"custom:tapon-card"}}getCardSize(){return 8}getGridOptions(){return{columns:"full",min_columns:6}}connectedCallback(){if(super.connectedCallback(),this.hass)this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0}updated(t){if(t.has("hass")&&this.hass&&!this._unsub&&!this._subscribing)this._subscribe()}async _subscribe(){if(this._unsub||this._subscribing||!this.hass?.connection)return;this._subscribing=!0;try{this._unsub=await this.hass.connection.subscribeMessage((t)=>{this._data=t,this._error=""},{type:"tapon/subscribe"})}catch(t){this._error=t?.code==="unknown_command"?"L'integrazione Tapon non è installata: aggiungila da Impostazioni → Dispositivi e servizi.":`Impossibile caricare la cantina: ${t?.message||t}`}finally{this._subscribing=!1}}async ws(t){try{return await this.hass.callWS(t)}catch(e){throw this.toast(e?.message||"Operazione non riuscita"),e}}toast(t){this._toast=t,clearTimeout(this._toastTimer),this._toastTimer=window.setTimeout(()=>this._toast="",3500)}_onCell(t,e,i,s){if(this._data?.inventory){if(s)this.ws({type:"tapon/take_code",code:`tapon-${s.code}`});return}if(this._moving){let r=this._moving;if(this._moving=null,s?.id===r.id)return;this.ws({type:"tapon/move_bottle",bottle_id:r.id,rack_id:t.id,row:e,col:i}).then(()=>this.toast(s?"Bottiglie scambiate di posto":"Bottiglia spostata"));return}this._dialog=s?{kind:"bottle",bottleId:s.id}:{kind:"add",rackId:t.id,row:e,col:i}}render(){let t=this._data;return a`
      <ha-card>
        ${w}
        ${this._error?a`<div class="empty">${this._error}</div>`:!t?a`<div class="empty">Carico la cantina…</div>`:this._renderBody(t)}
        ${this._toast?a`<div class="toast">${this._toast}</div>`:o}
      </ha-card>
      ${t?this._renderDialog(t):o}
    `}_renderBody(t){let e=t.bottles.length,i=t.racks.reduce((c,b)=>c+Y(b),0),s=t.bottles.filter((c)=>c.alert==="closing").length,r=t.bottles.filter((c)=>c.alert==="past").length,l=t.bottles.filter((c)=>!c.rack_id&&!c.opened_at),d=t.bottles.filter((c)=>c.opened_at).sort((c,b)=>(b.opened_days??0)-(c.opened_days??0)),n=Object.fromEntries(Object.keys(t.types).map((c)=>[c,t.bottles.filter((b)=>b.type===c).length])),h=Math.round(Number(this._config.columns))||0,_=h?Math.max(1,Math.min(6,h,t.racks.length||1)):0;return a`
      <div class="header">
        <div class="title">
          <span class="logo">🍷</span>
          <div>
            <div class="name">${this._config.title||"Tapon"}</div>
            <div class="sub">${e} bottiglie · ${i-t.racks.reduce((c,b)=>c+this._inRack(t,b).length,0)} posti liberi${this._renderValue(t)}</div>
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
            ♡ Desideri${t.wishlist?.length?a` <span class="count">${t.wishlist.length}</span>`:o}
          </button>
          <button class="btn" title="Storico" @click=${()=>this._dialog={kind:"history"}}>🕓 Storico</button>
          <button class="btn" title="Scaffali e impostazioni" @click=${()=>this._dialog={kind:"racks"}}>⚙︎</button>
        </div>
      </div>

      ${s||r?a`<div class="banner">
            ${s?a`<span>🍷 <b>${s}</b> da bere presto</span>`:o}
            ${r?a`<span>⚠️ <b>${r}</b> oltre la finestra di beva</span>`:o}
            <span class="hint">cartellino dorato: da bere presto · rosso: oltre la finestra</span>
          </div>`:o}

      ${t.inventory?this._renderInventoryBanner(t,t.inventory):o}

      ${this._moving?a`<div class="banner moving">
            Tocca la nuova posizione per <b>${m(this._moving)}</b>
            <button class="btn small" @click=${()=>this._moving=null}>Annulla</button>
          </div>`:o}

      <div class="filters">
        <button class="chip ${this._typeFilter?"":"active"}" @click=${()=>this._typeFilter=""}>Tutti ${e}</button>
        ${Object.entries(t.types).map(([c,b])=>a`<button
            class="chip ${this._typeFilter===c?"active":""}"
            @click=${()=>this._typeFilter=this._typeFilter===c?"":c}
          ><span class="dot" style="background:${b.color}"></span>${b.label} ${n[c]||0}</button>`)}
        <input class="search" type="search" placeholder="Cerca vino, produttore, annata…"
          .value=${this._query} @input=${(c)=>this._query=c.target.value} />
        ${this._renderLightButton(t)}
      </div>

      ${t.highlight?.groups.length?this._renderLitBanner(t):o}

      <div class="racks ${_?"fixed":""}" style=${_?`--tb-columns:${_}`:""}>
        ${t.racks.map((c)=>this._renderRack(t,c))}
      </div>

      ${d.length?a`<div class="unplaced">
            <div class="section-title">🍾 Aperte (${d.length})</div>
            <div class="list">
              ${d.map((c)=>a`<button class="list-item opened ${c.opened_state||""}"
                  @click=${()=>this._dialog={kind:"bottle",bottleId:c.id}}>
                  <span class="dot" style="background:${t.types[c.type]?.color}"></span>${m(c)}
                  <span class="od">${rt(c)}</span>
                </button>`)}
            </div>
          </div>`:o}
      ${l.length?a`<div class="unplaced">
            <div class="section-title">Da sistemare (${l.length})</div>
            <div class="list">
              ${l.map((c)=>a`<button class="list-item ${this._dims(c)?"dim":""}"
                  @click=${()=>this._dialog={kind:"bottle",bottleId:c.id}}>
                  <span class="dot" style="background:${t.types[c.type]?.color}"></span>${m(c)}
                </button>`)}
            </div>
          </div>`:o}
      ${!t.racks.length?a`<div class="empty">Nessuno scaffale: creane uno da ⚙︎.</div>`:o}
    `}_renderLightButton(t){if(!this._query.trim()&&!this._typeFilter)return o;let e=t.bottles.filter((s)=>!this._dims(s));if(!e.length||t.inventory)return o;let i=[this._typeFilter?t.types[this._typeFilter]?.label:"",this._query.trim()].filter(Boolean).join(" · ");return a`<button class="btn small light-btn" title="Evidenzia sullo scaffale finché non ne prendi una"
      @click=${async()=>{await this.ws({type:"tapon/highlight",source:"search",query:i,groups:[{label:i,color:O,bottle_ids:e.map((s)=>s.id)}]}),this._query="",this._typeFilter=""}}>💡 Illumina ${e.length}</button>`}_renderLitBanner(t){let e=t.highlight;return a`<div class="banner lit">
      <span>💡</span>
      <div class="legend">
        ${e.groups.map((i)=>a`<span class="lg"><span class="lgdot" style="--hl:${i.color}"></span>${i.label||"Selezione"}
          <span class="muted">${i.bottle_ids.length}</span></span>`)}
      </div>
      <span class="hint">restano accese finché non ne prendi una</span>
      <button class="btn small" @click=${()=>this.ws({type:"tapon/highlight_clear"})}>Spegni</button>
    </div>`}_renderInventoryBanner(t,e){let i=t.racks.find((l)=>l.id===e.rack_id),s=e.last,r={ok:"✓",again:"↺ già contata",misplaced:"⚠ fuori posto",found_taken:"↩ risultava già tolta",unknown:"? codice sconosciuto"};return a`<div class="banner inventory">
      <div class="inv-text">
        <b>📋 Inventario${i?` · ${i.name}`:""}</b>
        <span class="inv-count">${e.seen}/${e.total} trovate</span>
        ${s?a`<span class="hint">Ultima: ${s.name?`${s.name}${s.vintage?` ${s.vintage}`:""} `:""}${r[s.result]||""}</span>`:a`<span class="hint">Scansiona i QR, o tocca le bottiglie che vedi</span>`}
      </div>
      <div class="inv-progress"><span style="width:${e.total?Math.round(e.seen/e.total*100):0}%"></span></div>
      <div class="inv-actions">
        <button class="btn small" @click=${()=>this.ws({type:"tapon/inventory_stop"}).then(()=>this.toast("Inventario annullato"))}>Annulla</button>
        <button class="btn small primary" @click=${async()=>{let l=await this.ws({type:"tapon/inventory_stop"});this._dialog={kind:"inventory",report:l.inventory}}}>Fine: vedi risultato</button>
      </div>
    </div>`}_renderValue(t){let e=t.value;if(!e||!e.priced)return o;let i=e.total.toLocaleString("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:0}),s=e.bottles-e.priced;return a` · <span class="value" title=${s?`Valore delle ${e.priced} bottiglie con prezzo (${s} senza prezzo)`:"Valore della cantina"}>${i}${s?"*":""}</span>`}_renderClimate(t){let e=t.climate;if(!e||!e.temperature_entity&&!e.humidity_entity)return o;let i=(s,r,l,d,n,h)=>{if(!s)return o;let _=this.hass?.states?.[s],c=_?Number(_.state):NaN,b=!isNaN(c),E=!b?"na":c<d?"low":c>n?"high":"ok",R=b?c.toLocaleString("it-IT",{maximumFractionDigits:1}):"—",Jt=E==="ok"?`${h} ideale (${d}–${n} ${l})`:E==="na"?`${h} non disponibile`:`${h} troppo ${E==="low"?"bassa":"alta"}: ideale ${d}–${n} ${l}`;return a`<button class="climate ${E}" title=${Jt}
        @click=${()=>this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0}))}>
        <span class="ci">${r}</span><b>${R}</b><span class="cu">${l}</span>
      </button>`};return a`<div class="climates">
      ${i(e.temperature_entity,"\uD83C\uDF21","°C",e.temperature_min,e.temperature_max,"Temperatura")}
      ${i(e.humidity_entity,"\uD83D\uDCA7","%",e.humidity_min,e.humidity_max,"Umidità")}
    </div>`}_invClass(t,e){let i=t.inventory;if(!i||i.rack_id&&e.rack_id!==i.rack_id)return"";return i.missing.includes(e.id)?"unseen":"seen"}_inRack(t,e){return t.bottles.filter((i)=>i.rack_id===e.id&&i.row!=null&&i.col!=null)}_dims(t){return this._typeFilter&&t.type!==this._typeFilter||!Yt(t,this._query)}_renderRack(t,e){let i=this._inRack(t,e),s=new Map(i.map((d)=>[`${d.row}:${d.col}`,d])),r=W(e),l=new Map;for(let d of t.highlight?.groups||[])for(let n of d.bottle_ids)if(!l.has(n))l.set(n,d.color);return a`
      <div class="rack ${l.size?"lighting":""}">
        <div class="rack-head"><span>${e.name}</span><span class="muted">${i.length}/${Y(e)}</span></div>
        <div class="shelves">
          ${r.map((d,n)=>a`<div class="shelf">
            <div class="grid" style="grid-template-columns: repeat(${d}, minmax(0, 34px))">
              ${Array.from({length:d},(h,_)=>{let c=s.get(`${n}:${_}`);return a`<button
                  class="cell ${c?"full":"free"} ${c&&this._dims(c)?"dim":""} ${c&&this._moving?.id===c.id?"moving":""} ${c?.reserved_for?"reserved":""} ${c?this._invClass(t,c):""} ${c&&l.has(c.id)?"lit":""}"
                  style=${c&&l.has(c.id)?`--hl:${l.get(c.id)}`:""}
                  title=${c?`${m(c)}${c.producer?` · ${c.producer}`:""}${c.reserved_for?` · \uD83D\uDD12 ${c.reserved_for}`:""}`:`Mensola ${n+1}, posto ${_+1}: libero`}
                  @click=${()=>this._onCell(e,n,_,c)}
                >${c?k(c.type,c.alert):Xt}</button>`})}
            </div>
            <div class="board"></div>
          </div>`)}
        </div>
      </div>
    `}_renderDialog(t){let e=this._dialog;if(!e)return o;let i=()=>this._dialog=null;switch(e.kind){case"add":return a`<tb-add-dialog .card=${this} .data=${t} .rackId=${e.rackId} .row=${e.row} .col=${e.col}
          .mode=${e.mode||"cellar"} .prefill=${e.prefill||null} .wishId=${e.wishId||null} @close=${i}></tb-add-dialog>`;case"wishlist":return a`<tb-wishlist-dialog .card=${this} .data=${t} @close=${i}
          @add-wish=${()=>this._dialog={kind:"add",rackId:null,row:null,col:null,mode:"wish"}}
          @buy=${(s)=>this._dialog={kind:"add",rackId:null,row:null,col:null,mode:"cellar",prefill:s.detail.wish,wishId:s.detail.wish.id}}></tb-wishlist-dialog>`;case"check":return a`<tb-check-dialog .card=${this} .data=${t} @close=${i}
          @buy=${(s)=>this._dialog={kind:"add",rackId:null,row:null,col:null,mode:"cellar",prefill:s.detail.wine}}></tb-check-dialog>`;case"inventory":return a`<tb-inventory-dialog .card=${this} .data=${t} .report=${e.report} @close=${i}
          @open-bottle=${(s)=>this._dialog={kind:"bottle",bottleId:s.detail.bottleId}}></tb-inventory-dialog>`;case"bottle":{let s=t.bottles.find((r)=>r.id===e.bottleId);if(!s)return o;return a`<tb-bottle-dialog .card=${this} .data=${t} .bottle=${s} @close=${i} @move=${this._startMove}></tb-bottle-dialog>`}case"racks":return a`<tb-racks-dialog .card=${this} .data=${t} @close=${i}></tb-racks-dialog>`;case"pair":return a`<tb-pair-dialog .card=${this} .data=${t} @close=${i}
          @open-bottle=${(s)=>this._dialog={kind:"bottle",bottleId:s.detail.bottleId}}></tb-pair-dialog>`;case"history":return a`<tb-history-dialog .card=${this} .data=${t} @close=${i}></tb-history-dialog>`}}static styles=[x,f`
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
    `]}p([g({attribute:!1})],wt.prototype,"hass",void 0),p([u()],wt.prototype,"_config",void 0),p([u()],wt.prototype,"_data",void 0),p([u()],wt.prototype,"_error",void 0),p([u()],wt.prototype,"_typeFilter",void 0),p([u()],wt.prototype,"_query",void 0),p([u()],wt.prototype,"_dialog",void 0),p([u()],wt.prototype,"_moving",void 0),p([u()],wt.prototype,"_toast",void 0),wt=p([y("tapon-card")],wt);window.customCards=window.customCards||[];window.customCards.push({type:"tapon-card",name:"Tapon",description:"La tua cantina: scaffali, bottiglie, QR e finestre di beva",preview:!1});export{wt as TaponCard};
