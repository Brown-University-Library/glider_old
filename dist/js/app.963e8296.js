(function(t){function e(e){for(var a,n,o=e[0],c=e[1],u=e[2],l=0,p=[];l<o.length;l++)n=o[l],r[n]&&p.push(r[n][0]),r[n]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(t[a]=c[a]);h&&h(e);while(p.length)p.shift()();return s.push.apply(s,u||[]),i()}function i(){for(var t,e=0;e<s.length;e++){for(var i=s[e],a=!0,o=1;o<i.length;o++){var c=i[o];0!==r[c]&&(a=!1)}a&&(s.splice(e--,1),t=n(n.s=i[0]))}return t}var a={},r={app:0},s=[];function n(e){if(a[e])return a[e].exports;var i=a[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=a,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(i,a,function(e){return t[e]}.bind(null,a));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var u=0;u<o.length;u++)e(o[u]);var h=c;s.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},"034f":function(t,e,i){"use strict";var a=i("c21b"),r=i.n(a);r.a},"56d7":function(t,e,i){"use strict";i.r(e);i("cadf"),i("551c"),i("097d");var a=i("2b0e"),r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("router-view")],1)},s=[],n=(i("034f"),i("2877")),o={},c=Object(n["a"])(o,r,s,!1,null,null,null);c.options.__file="App.vue";var u=c.exports,h=i("8c4f"),l=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:t.placeId,class:["glider-root",t.placeId]},[i("Phase",{attrs:{id:"phase1"}},[i("Put",{attrs:{on:"DXLWall",region:"r1c1w1h1"}},[i("Part",{ref:"part1",attrs:{id:"part1"}},[i("h1",[t._v("Blahdeeblah I'm Part1")]),i("p",[t._v("And some content and stuff.")]),i("img",{attrs:{src:"http://placekitten.com/200/200"}})])],1),i("Put",{attrs:{on:"DXLWall",region:"r2c2w1h1"}},[i("Part",{ref:"part2",attrs:{id:"part2"}},[i("h1",[t._v("I'm part number two!")]),i("p",[t._v("And some additional content.")])])],1),i("Put",{attrs:{on:"mobile"}},[i("Part",{ref:"forMobile",attrs:{id:"forMobile"}},[i("h1",[t._v("Here's some content on Mobile.")])])],1)],1),i("Phase",{attrs:{id:"phase2"}},[i("Put",{attrs:{on:"DXLWall",region:"r1c1w1h1",part:"part2"}}),i("Put",{attrs:{on:"DXLWall",region:"r1c2w1h1",part:"part1"}}),i("Put",{attrs:{on:"mobile"}},[i("Part",{ref:"forMobile2",attrs:{id:"forMobile2"}},[i("h1",[t._v("I forget if there's stuff on Mobile right now.")])])],1)],1),i("Phase",{attrs:{id:"phase3"}},[i("Put",{attrs:{on:"DXLWall",region:"r1c1w2h2",part:"part1"}}),i("Put",{attrs:{on:"mobile"}},[i("Part",{ref:"forMobile3",attrs:{id:"forMobile3"}},[i("h2",[t._v("Here's a kitten!")]),i("img",{attrs:{src:"http://placekitten.com/400/400"}})])],1)],1)],1)},p=[],f=(i("7f7f"),i("c5f6"),function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:"active"==t.state,expression:"state=='active'"}],class:["part","part-"+this.id],style:t.styleObject},[t._t("default",[t._v("\n    "+t._s(t.id)+"\n  ")])],2)}),d=[],v=(i("7514"),i("c93e")),P=i("2f62"),m={name:"Part",inherit:!0,props:{id:String,shared:String},data:function(){return{views:[],styleObject:{},state:"inactive",activeView:null}},computed:Object(v["a"])({},Object(P["b"])({partAttrs:"getSharedPartAttributes"}),{attrs:function(t){return t.partAttrs(t.id)}}),updated:function(){this.populateViews();var t=this.getViewById(this.activeView);void 0!==t&&t.updateState("active"),console.log("component updated")},mounted:function(){var t=this;if(void 0!=t.shared){t.id,JSON.parse(t.shared);this.styleObject.backgroundColor=this.attrs.bgColor}this.$store.commit("registerPart",this)},methods:{populateViews:function(){this.views=this.$children},getViewById:function(t){var e=this.views.find(function(e){return e.id==t});return e},updateState:function(t){this.state=t},deactivate:function(){this.state="inactive"},activate:function(t){this.state="active"},updateSharedAttribute:function(t,e){this.attrs[t]=e}}},g=m,b=Object(n["a"])(g,f,d,!1,null,null,null);b.options.__file="Part.vue";var w=b.exports,y=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:"active"==t.state,expression:"state=='active'"}],class:["phase",t.placeId]},[t._t("default")],2)},_=[],O={name:"Phase",props:{id:String,duration:String,first:String,placeId:String},data:function(){return{phaseDuration:this.duration,state:"inactive",type:String,nextPhase:Object,timer:Object}},mounted:function(){this.puts=this.$children,this.$store.dispatch("registerPhase",this)},computed:{childPhases:function(){this.$children.filter(function(t){return"Phase"===t.$options.name})}},methods:{start:function(){this.notifyActive();for(var t=[],e=0;e<this.puts.length;e++){var i=this.puts[e],a=i.content,r=i.region,s=i.on;t.push({put:i,part:a,place:s,region:r})}this.$store.dispatch("updateActivePuts",t),void 0!==this.duration&&this.doTimeout()},doTimeout:function(){console.log("triggering timeout");var t=this,e=function(){t.complete()},i=+this.duration;this.timer=setTimeout(e,i)},complete:function(){clearTimeout(this.timer),this.notifyInactive()},notifyActive:function(){this.state="active",this.$store.dispatch("phaseActive",this)},notifyInactive:function(){for(var t=0;t<this.puts.length;t++)console.log("kill da puts");this.state="inactive",this.$store.dispatch("phaseInactive",this)}}},S=O,$=Object(n["a"])(S,y,_,!1,null,null,null);$.options.__file="Phase.vue";var j=$.exports,x=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:"active"==t.state,expression:"state=='active'"}],staticClass:"put",style:t.styleObject},[t._t("default")],2)},A=[],I=(i("28a5"),{name:"Put",props:{part:String,place:String,on:String,region:String},data:function(){return{styleObject:{},state:"active",referencesAnotherPart:!1}},methods:{getParsedRegionObject:function(t){var e=t.split("r")[1].split("c")[0],i=t.split("w")[0].split("c")[1],a=t.split("w")[1].split("h")[0],r=t.split("h")[1],s=e+" / span "+r,n=i+" / span "+a;return{gridRow:s,gridColumn:n}},applyRegionStyles:function(){var t=this.getParsedRegionObject(this.region);this.styleObject["display"]="grid",this.styleObject["gridRow"]=t.gridRow,this.styleObject["gridColumn"]=t.gridColumn}},computed:{content:function(){if(void 0!=this.part){var t={part:this.part,ref:!0};return t}var e={part:this.$children[0].id,ref:!1};return e}},mounted:function(){this.styleObject={},void 0!=this.region&&this.applyRegionStyles()}}),k=I,C=Object(n["a"])(k,x,A,!1,null,null,null);C.options.__file="Put.vue";var M=C.exports,R=function(){var t=this,e=t.$createElement,i=t._self._c||e;return"inactive"==t.state?i("div",{class:["place","place-"+this.id,"state-"+t.state]},[t._t("default")],2):t._e()},T=[],D={name:"Place",props:{id:String,type:String,rows:String,columns:String},data:function(){return{state:"active"}},methods:{setupLayout:function(){},activate:function(){this.state="active"},deactivate:function(){this.state="inactive"}},mounted:function(){}},E=D,L=Object(n["a"])(E,R,T,!1,null,null,null);L.options.__file="Place.vue";var N=L.exports,V={name:"home",props:{placeId:String,canControl:{type:String}},components:{Part:w,Phase:j,Put:M,Place:N},data:function(){return{initialPhaseIndex:Number,outerPhases:[]}},methods:{killAllParts:function(t){for(var e=0;e<t.length;e++)t[e].deactivate()},mapPhases:function(){for(var t=0;t<this.outerPhases.length;t++)this.outerPhases[t].nextPhase=this.outerPhases[t+1]}},computed:{inFlight:function(){return this.$store.state.inFlight},pusher:function(){return"true"==this.canControl},activePhase:function(){return this.$store.state.activePhase},activePuts:function(){return this.$store.state.activePuts}},watch:{activePhase:function(){this.activePhase.start()},activePuts:function(){this.killAllParts(this.$store.state.parts);for(var t=0;t<this.activePuts.length;t++){var e=this.activePuts[t],i=this.activePuts[t].place,a=this.activePuts[t].part,r=this.activePuts[t].region;if(console.log("Place ".concat(i,".").concat(r," gets Part ").concat(a.part)),void 0!=this.$refs[i]){var s=this.$refs[a.part];1==a.ref&&(s.$el.parentNode.removeChild(s.$el),e.put.$el.appendChild(s.$el)),s.activate()}}}},mounted:function(){var t=this;if(this.outerPhases=this.$children.filter(function(t){return"Phase"===t.$options.name}),this.$store.dispatch("registerPusherStatus",this.pusher),this.pusher){console.log("doing a keyboard controller");var e=this;document.onkeydown=function(t){t=t||window.event,"39"==t.keyCode?e.activePhase.complete():t.keyCode}}this.mapPhases(),this.$store.dispatch("registerOuterPhases",this.outerPhases).then(function(e){t.$store.dispatch("updatePhase",t.outerPhases[0])},function(t){console.error("Got nothing from store for some reason.")})}},W=V,X=Object(n["a"])(W,l,p,!1,null,null,null);X.options.__file="Home.vue";var H=X.exports;a["a"].use(h["a"]);var B=new h["a"]({routes:[{path:"/",name:"home",component:H},{path:"/place/:placeId/:canControl?",name:"Home",component:H,props:!0}]});a["a"].use(P["a"]);var F={activePhase:Object,isPusher:!1,inFlight:!1,activePuts:[],parts:[],activeParts:[],places:[],allPhases:{},outerPhases:[]},J={updatePhase:function(t,e){q("phase",e.id);var i=firebase.database().ref().child("phase");i.on("value",function(e){var i=e.val();t.activePhase=t.allPhases[i]}),t.activePhase=e},registerPhase:function(t,e){t.allPhases[e.id]=e},updateActivePuts:function(t,e){t.activePuts=e},updateActiveParts:function(t,e){t.activeParts=e},registerPart:function(t,e){t.parts.push(e)},registerOuterPhases:function(t,e){t.outerPhases=e},registerPusherStatus:function(t,e){t.isPusher=e}},G={updatePhase:function(t,e){t.commit("updatePhase",e)},phaseInactive:function(t){void 0!=this.state.activePhase.nextPhase&&this.commit("updatePhase",this.state.activePhase.nextPhase)},phaseActive:function(t,e){t.commit("updatePhase",e)},updateActivePuts:function(t,e){t.commit("updateActivePuts",e)},registerPart:function(t,e){t.commit("registerPart",e)},registerOuterPhases:function(t,e){t.commit("registerOuterPhases",e)},registerPusherStatus:function(t,e){t.commit("registerPusherStatus",e)},registerPhase:function(t,e){t.commit("registerPhase",e)}};function q(t,e){F.isPusher&&firebase.database().ref().child(t).set(e)}var z=new P["a"].Store({state:F,mutations:J,actions:G});a["a"].config.productionTip=!1,new a["a"]({router:B,store:z,render:function(t){return t(u)}}).$mount("#app")},c21b:function(t,e,i){}});
//# sourceMappingURL=app.963e8296.js.map