import{e as D,aD as H,a9 as T,j as k,C as z}from"./main-BSlzRRNT.js";import{R as n}from"./chartjs-b1JVRw0D.js";import"./googlemaps-Dk_mmaZe.js";import"./apexcharts-BosuxZz1.js";import"./vectormaps-BVPPmnbV.js";function $(t,a){var o={};for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&a.indexOf(e)<0&&(o[e]=t[e]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function"){var r=0;for(e=Object.getOwnPropertySymbols(t);r<e.length;r++)a.indexOf(e[r])<0&&Object.prototype.propertyIsEnumerable.call(t,e[r])&&(o[e[r]]=t[e[r]])}return o}function N(t){var a,o,e="";if(typeof t=="string"||typeof t=="number")e+=t;else if(typeof t=="object")if(Array.isArray(t))for(a=0;a<t.length;a++)t[a]&&(o=N(t[a]))&&(e&&(e+=" "),e+=o);else for(a in t)t[a]&&(e&&(e+=" "),e+=a);return e}function B(){for(var t,a,o=0,e="";o<arguments.length;)(t=arguments[o++])&&(a=N(t))&&(e&&(e+=" "),e+=a);return e}const C=n.createContext(null);function j(...t){return B(...t).split(" ").map(a=>`__rrm-${a}`).join(" ")}function V(t,a,o,e){const r=e*Math.cos(t),c=e*Math.sin(t),i=e*Math.cos(a),h=e*Math.sin(a),b=o*Math.cos(t),g=o*Math.sin(t),s=a-t<=180?0:1;return`
            M ${e} ${e}
            m ${b} ${g}
            l ${r-b} ${c-g}
            A ${e} ${e} 0 ${s} 1 ${i+e} ${h+e}
            l ${o*Math.cos(a)-i} ${o*Math.sin(a)-h}
            A ${o} ${o} 0 ${s} 0 ${e+b} ${e+g}
          `}function O(t,a,o){const e=.98*o,r=.95*o,c=e*Math.cos((t+a)/2)+o,i=e*Math.sin((t+a)/2)+o;return`${r*Math.cos((t+a)/2+Math.PI/60)+o},${r*Math.sin((t+a)/2+Math.PI/60)+o} ${c},${i} ${r*Math.cos((t+a)/2-Math.PI/60)+o},${r*Math.sin((t+a)/2-Math.PI/60)+o}`}function A(t,a,o,e,r){const c=Math.min(t/Math.sqrt(2),a*o),i=c;return{objectX:Math.cos(a*e+a/2)*o+(r-c/2),objectY:Math.sin(a*e+a/2)*o+(r-i/2),objectWidth:c,objectHeight:i}}(function(t,a){a===void 0&&(a={});var o=a.insertAt;if(typeof document<"u"){var e=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css",o==="top"&&e.firstChild?e.insertBefore(r,e.firstChild):e.appendChild(r),r.styleSheet?r.styleSheet.cssText=t:r.appendChild(document.createTextNode(t))}})(`:root {
  --__reactRadialMenu__menu-bgColor: #fff;
  --__reactRadialMenu__separator-color: rgba(0, 0, 0, 0.2);
  --__reactRadialMenu__item-color: #333;
  --__reactRadialMenu__zIndex: 666;
  --__reactRadialMenu__activeItem-color: #fff;
  --__reactRadialMenu__activeItem-bgColor: #3498db;
  --__reactRadialMenu__arrow-color: #6f6e77;
  --__reactRadialMenu__activeArrow-color: #fff;
  --__reactRadialMenu__animation-delay: 300ms;
}
/* --------------------------------- Themes --------------------------------- */
.__rrm-light {
  --__reactRadialMenu__menu-bgColor: #fff;
  --__reactRadialMenu__separator-color: rgba(0, 0, 0, 0.2);
  --__reactRadialMenu__item-color: #333;
}
.__rrm-dark {
  --__reactRadialMenu__menu-bgColor: rgba(40, 40, 40, 0.98);
  --__reactRadialMenu__separator-color: #4c4c4c;
  --__reactRadialMenu__item-color: #fff;
}
/* ------------------------------- Animations --------------------------------*/
.__rrm-menu.__rrm-closing.__rrm-fade,
.__rrm-menu.__rrm-opening.__rrm-fade {
  opacity: 0;
}
.__rrm-menu.__rrm-opened.__rrm-fade {
  opacity: 1;
}

.__rrm-menu.__rrm-closing.__rrm-scale,
.__rrm-menu.__rrm-opening.__rrm-scale {
  scale: 0;
}
.__rrm-menu.__rrm-opened.__rrm-scale {
  scale: 1;
}

.__rrm-menu.__rrm-closing.__rrm-rotate,
.__rrm-menu.__rrm-opening.__rrm-rotate {
  rotate: -45deg;
}
.__rrm-menu.__rrm-opened.__rrm-rotate {
  rotate: 0deg;
}
/* ---------------------------------- Menu ---------------------------------- */
.__rrm-menu {
  position: absolute;
  z-index: var(--__reactRadialMenu__zIndex);
  transition: all var(--__reactRadialMenu__animation-delay) ease;
  transform-origin: center;
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
}
.__rrm-menu g {
  cursor: pointer;
}
/* ---------------------------------- Base ---------------------------------- */
.__rrm-base {
  transition: all var(--__reactRadialMenu__animation-delay) ease;
  fill: var(--__reactRadialMenu__menu-bgColor);
  stroke: var(--__reactRadialMenu__separator-color);
}
.__rrm-base.__rrm-active {
  fill: var(--__reactRadialMenu__activeItem-bgColor);
}
/* --------------------------------- Content -------------------------------- */
.__rrm-content {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  pointer-events: none;
  color: var(--__reactRadialMenu__item-color);
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.__rrm-content.__rrm-active {
  color: var(--__reactRadialMenu__activeItem-color);
}
/* ---------------------------------- Arrow --------------------------------- */
.__rrm-arrow {
  stroke: var(--__reactRadialMenu__arrow-color);
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;
}
.__rrm-arrow.__rrm-active {
  stroke: var(--__reactRadialMenu__activeArrow-color);
}
/* --------------------------------- Return --------------------------------- */
.__rrm-return {
  stroke: var(--__reactRadialMenu__arrow-color);
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4px;
}
.__rrm-return.__rrm-active {
  stroke: var(--__reactRadialMenu__activeArrow-color);
}
/* --------------------------------- No Bg --------------------------------- */
.__rrm-no-bg > g > foreignObject {
  border: 1px solid var(--__reactRadialMenu__separator-color);
  border-radius: 50%;
  background-color: var(--__reactRadialMenu__menu-bgColor);
}
.__rrm-no-bg > g > foreignObject:has(.__rrm-active) {
  background-color: var(--__reactRadialMenu__activeItem-bgColor);
}
.__rrm-no-bg .__rrm-arrow {
  stroke: var(--__reactRadialMenu__arrow-color);
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;
}
.__rrm-no-bg .__rrm-arrow.__rrm-active {
  stroke: var(--__reactRadialMenu__arrow-color);
}
`);const U={activeMenuId:"0",deltaRadius:0,innerRadius:0,menuHeight:0,menuWidth:0,middleRadius:0,outerRadius:0,drawBackground:!0},W=t=>{var{centerX:a,centerY:o,innerRadius:e,outerRadius:r,animationTimeout:c,show:i,animateSubMenuChange:h,animation:b,theme:g,drawBackground:s}=t,f=$(t,["centerX","centerY","innerRadius","outerRadius","animationTimeout","show","animateSubMenuChange","animation","theme","drawBackground"]);const[p,u]=n.useState(U);if(e>=r)throw new Error("RadialMenu's innerRadius must be less than outerRadius");const w=n.Children.count(f.children);if(w<2)throw new Error("RadialMenu must have at least 2 children");const E=2*Math.PI/w,M=(e+r)/2,d=r-e,v=2*r,y=v;c=n.useMemo(()=>c||0,[c]),n.useEffect(()=>{u(_=>({innerRadius:e,outerRadius:r,middleRadius:M,deltaRadius:d,menuWidth:v,menuHeight:y,activeMenuId:i?"0":_.activeMenuId,drawBackground:s==null||s}))},[e,r,i,s]);const[I,R]=n.useState("closed"),m=n.useCallback(()=>{document.documentElement.style.setProperty("--__reactRadialMenu__animation-delay",`${c}ms`),i?(R("opening"),setTimeout(()=>R("opened"),c)):(R("closing"),setTimeout(()=>R("closed"),c))},[i,c]),l=n.useCallback(_=>{h?(m(),setTimeout(()=>u(x=>Object.assign(Object.assign({},x),{activeMenuId:_})),c)):u(x=>Object.assign(Object.assign({},x),{activeMenuId:_}))},[m,h]);return n.useEffect(()=>{m()},[i,m]),I==="closed"?n.createElement(n.Fragment,null):n.createElement(C.Provider,{value:{data:p,changeMenu:l}},n.createElement("svg",Object.assign({},f,{width:v,height:y,viewBox:`-3 -3 ${v+6} ${y+6}`,style:Object.assign(Object.assign({},f.style),{width:`${v}px`,height:`${y}px`,left:a-r+"px",top:o-r+"px"}),className:B(f.className,j("menu",I,b,g,!p.drawBackground&&"no-bg"))}),n.Children.map(f.children,(_,x)=>{if(n.isValidElement(_)){let L={__index:x,__angleStep:E,__parentMenuId:"0"};return n.cloneElement(_,L)}return _})))},P=t=>{var{__angleStep:a,__index:o,__parentMenuId:e,data:r,onItemClick:c}=t,i=$(t,["__angleStep","__index","__parentMenuId","data","onItemClick"]);const{data:h}=n.useContext(C),{innerRadius:b,outerRadius:g,middleRadius:s,deltaRadius:f,activeMenuId:p}=h,[u,w]=n.useState(!1),E=a,M=o,d=e,{objectX:v,objectY:y,objectWidth:I,objectHeight:R}=n.useMemo(()=>A(f,E,s,M,g),[f,E,s,M,g]);return d!==p?n.createElement(n.Fragment,null):h.drawBackground?n.createElement("g",Object.assign({},i,{onMouseEnter:m=>{var l;(l=i.onMouseEnter)===null||l===void 0||l.call(i,m),w(!0)},onMouseLeave:m=>{var l;(l=i.onMouseLeave)===null||l===void 0||l.call(i,m),w(!1)},onClick:m=>{m.preventDefault(),m.stopPropagation(),c==null||c(m,M,r)}}),n.createElement("path",{d:V(M*E,(M+1)*E,b,g),className:j("base",{active:u})}),n.createElement("foreignObject",{x:v,y,width:I,height:R},n.createElement("div",{className:j("content",{active:u})},i.children))):n.createElement("g",Object.assign({},i),n.createElement("foreignObject",{x:v,y,width:I,height:R,onMouseEnter:m=>{var l;(l=i.onMouseEnter)===null||l===void 0||l.call(i,m),w(!0)},onMouseLeave:m=>{var l;(l=i.onMouseLeave)===null||l===void 0||l.call(i,m),w(!1)},onClick:m=>{m.preventDefault(),m.stopPropagation(),c==null||c(m,M,r)}},n.createElement("div",{className:j("content",{active:u})},i.children)))},X=t=>{var{__myMenuId:a,__angleStep:o,__index:e,itemView:r,data:c,onItemClick:i}=t,h=$(t,["__myMenuId","__angleStep","__index","itemView","data","onItemClick"]);const{data:b,changeMenu:g}=n.useContext(C),{innerRadius:s,outerRadius:f,middleRadius:p,deltaRadius:u}=b,[w,E]=n.useState(!1),M=o,d=e,v=a,{objectX:y,objectY:I,objectWidth:R,objectHeight:m}=n.useMemo(()=>A(u,M,p,d,f),[u,M,p,d,f]);return b.drawBackground?n.createElement("g",Object.assign({},h,{onMouseEnter:l=>{var _;(_=h.onMouseEnter)===null||_===void 0||_.call(h,l),E(!0)},onMouseLeave:l=>{var _;(_=h.onMouseLeave)===null||_===void 0||_.call(h,l),E(!1)},onClick:l=>{l.preventDefault(),l.stopPropagation(),i==null||i(l,d,c),g(v)}}),n.createElement("path",{d:V(d*M,(d+1)*M,s,f),className:j("base",{active:w})}),n.createElement("foreignObject",{x:y,y:I,width:R,height:m},n.createElement("div",{className:j("content",{active:w})},r)),n.createElement("polyline",{points:O(d*M,(d+1)*M,f),className:j("arrow",{active:w})})):n.createElement("g",Object.assign({},h),n.createElement("foreignObject",{onMouseEnter:l=>{var _;(_=h.onMouseEnter)===null||_===void 0||_.call(h,l),E(!0)},onMouseLeave:l=>{var _;(_=h.onMouseLeave)===null||_===void 0||_.call(h,l),E(!1)},onClick:l=>{l.preventDefault(),l.stopPropagation(),i==null||i(l,d,c),g(v)},x:y,y:I,width:R,height:m},n.createElement("div",{className:j("content",{active:w})},r)),n.createElement("polyline",{points:O(d*M,(d+1)*M,f),className:j("arrow",{active:w})}))},Y=t=>{var{position:a,onClick:o}=t,e=$(t,["position","onClick"]);const{data:r}=n.useContext(C),{innerRadius:c,outerRadius:i,activeMenuId:h}=r,[b,g]=n.useState(!1);let{startAngle:s,endAngle:f,objectX:p,objectY:u,objectWidth:w,objectHeight:E}=n.useMemo(()=>function(M,d,v){let y=0,I=0,R=0,m=0,l=0,_=0;switch(M){case"top":y=Math.PI/6+Math.PI,I=5*Math.PI/6+Math.PI,R=d/2,_=Math.sin(y)*d+v-R,l=Math.cos(y)*d+v,m=Math.cos(I)*d+v-l;break;case"bottom":y=Math.PI/6,I=5*Math.PI/6,R=d/2,_=Math.sin(I)*d+v,l=Math.cos(I)*d+v,m=Math.cos(y)*d+v-l;break;case"left":y=4*Math.PI/6,I=8*Math.PI/6,m=d/2,l=Math.cos(I)*d+v-m,_=Math.sin(I)*d+v,R=Math.sin(y)*d+v-_;break;case"right":y=10*Math.PI/6,I=2*Math.PI/6,m=d/2,l=Math.cos(y)*d+v,_=Math.sin(y)*d+v,R=Math.sin(I)*d+v-_;break;case"center":l=v-d,_=l,m=2*d,R=m;break;default:throw new Error(`Invalid position: ${M}`)}return{startAngle:y,endAngle:I,objectX:l,objectY:_,objectWidth:m,objectHeight:R}}(a,c,i),[a,c,i]);return e.__parentMenuId!==h?n.createElement(n.Fragment,null):r.drawBackground?n.createElement("g",Object.assign({},e,{onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),onClick:M=>{M.preventDefault(),M.stopPropagation(),o(M,a)}}),a!=="center"?n.createElement("path",{d:`M ${Math.cos(s)*c+i}
                ${Math.sin(s)*c+i}
              A ${c} ${c} 0 0 1 
                ${Math.cos(f)*c+i}
                ${Math.sin(f)*c+i}
              Z`,className:j("base",{active:b})}):n.createElement("circle",{cx:i,cy:i,r:c,className:j("base",{active:b})}),n.createElement("foreignObject",{x:p,y:u,width:w,height:E},n.createElement("div",{className:j("content",{active:b})},e.children?e.children:n.createElement("svg",{className:j("return",{active:b}),width:.5*w+"px",height:.5*E+"px",viewBox:"0 0 48 48"},n.createElement("path",{d:"M12.9998 8L6 14L12.9998 21"}),n.createElement("path",{d:"M6 14H28.9938C35.8768 14 41.7221 19.6204 41.9904 26.5C42.2739 33.7696 36.2671 40 28.9938 40H11.9984"}))))):n.createElement("g",Object.assign({},e),n.createElement("foreignObject",{x:p,y:u,width:w,height:E,onMouseEnter:()=>g(!0),onMouseLeave:()=>g(!1),onClick:M=>{M.preventDefault(),M.stopPropagation(),o(M,a)}},n.createElement("div",{className:j("content",{active:b})},e.children?e.children:n.createElement("svg",{className:j("return",{active:b}),width:.5*w+"px",height:.5*E+"px",viewBox:"0 0 48 48"},n.createElement("path",{d:"M12.9998 8L6 14L12.9998 21"}),n.createElement("path",{d:"M6 14H28.9938C35.8768 14 41.7221 19.6204 41.9904 26.5C42.2739 33.7696 36.2671 40 28.9938 40H11.9984"})))))},F=({__myMenuId:t,__parentMenuId:a,displayPosition:o,children:e,displayView:r,onDisplayClick:c})=>{const{changeMenu:i}=n.useContext(C),h=t,b=a,g=n.Children.count(e);if(g<2)throw new Error("RadialMenu must have at least 2 children");const s=2*Math.PI/g;return n.createElement(n.Fragment,null,n.Children.map(e,(f,p)=>{if(n.isValidElement(f)){let u={__index:p,__angleStep:s,__parentMenuId:h};return n.cloneElement(f,u)}return f}),n.createElement(Y,{__parentMenuId:h,position:o,onClick:(f,p)=>{c==null||c(f,p),i(b)}},r))},S=t=>{const{data:a}=n.useContext(C),{activeMenuId:o}=a,e=`${t.__parentMenuId}-${t.__index}`,{__parentMenuId:r,displayPosition:c,children:i,displayView:h,onDisplayClick:b}=t,g=$(t,["__parentMenuId","displayPosition","children","displayView","onDisplayClick"]);return o===t.__parentMenuId?n.createElement(X,Object.assign({},g,{__myMenuId:e})):n.createElement(F,{__myMenuId:e,__parentMenuId:r,displayPosition:c,children:i,displayView:h,onDisplayClick:b})};function Q(){var g;const t=D(),[a,o]=n.useState(!0),{theme:e}=H(),r=s=>{t(s)},c=s=>{},i=T(s=>s==null?void 0:s.threesixty);let h=((g=i==null?void 0:i.props)==null?void 0:g.dashboardItems)||[];h.length===1&&(h=[{title:"Under Implementation",pages:[{href:"#",title:"Under Implementation",isVisible:!1}]},...h]);const b=s=>{let p=s.children||[];return p.length===1&&(p=[{title:"Under Implementation",href:"#",isVisible:!1},...p]),p.length<2?null:k.jsx(S,{onDisplayClick:c,itemView:s.title,displayPosition:"center",style:{fontSize:"1.1rem"},children:p.map(u=>u.isVisible===!1?null:u.children?b(u):k.jsx(P,{onItemClick:()=>r(u.href),style:{fontSize:"1rem"},children:u.title},u.title))},s.title)};return k.jsx(z,{fluid:!0,className:`monkmenu d-flex justify-content-center align-items-center border bg-white ${e==="dark"?"menu-wrapper":"custom-wrapper"}`,children:k.jsx(W,{innerRadius:100,className:"menu",outerRadius:390,show:a,animation:["fade","scale","rotate"],animationTimeout:350,animateSubMenuChange:!0,drawBackground:!0,children:h.filter(s=>s.isVisible!==!1).map(s=>{let p=s.pages||[];if(p.length===1&&(p=[{title:"Under Implementation",href:"#",isVisible:!1},...p]),p.length===2&&p.some(u=>u.title==="Under Implementation")){const u=p.find(w=>w.title!=="Under Implementation");return u?k.jsx(P,{onItemClick:()=>r(u.href),style:{fontSize:"1.2rem"},children:s.title},s.title):null}return s.title!=="Under Implementation"?k.jsx(S,{onDisplayClick:c,itemView:s.title,displayPosition:"center",style:{fontSize:"1.2rem"},children:p.map(u=>u.isVisible===!1?null:u.children?b(u):k.jsx(P,{onItemClick:()=>r(u.href),style:{fontSize:"1.2rem"},children:u.title},u.title))},s.title):null})})})}export{Q as default};
