(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{329:function(t,e,r){"use strict";r.r(e);var n=r(284),c=r(290),o=r(285),h=r(283),d=r(282),m=r(289),l={components:{QuerentsCard:r(287).a,PatientsSummaryCard:m.a,PatientsCard:d.a,InspectionsCard:h.a,DischargesCard:o.a,ContactsCard:c.a,CurrentPatientsCard:n.a},data:function(){return{title:""}},created:function(){switch(this.$route.params.card){case"contacts":this.title=this.$t("新型コロナコールセンター相談件数(札幌市保健所値)");break;case"current-patients":this.title=this.$t("現在患者数");break;case"discharges-summary":this.title=this.$t("治療終了者数");break;case"inspections":this.title=this.$t("検査数");break;case"patients":this.title=this.$t("陽性患者の属性");break;case"patients-summary":this.title=this.$t("陽性患者数");break;case"querents":this.title=this.$t("帰国者・接触者電話相談センター相談件数(札幌市保健所値)")}},mounted:function(){"true"!==this.$route.query.embed&&"true"!==this.$route.query.ogp&&this.$router.push({path:this.localePath("/"),hash:this.$route.params.card})},head:function(){var t="https://stopcovid19.hokkaido.dev/",e=(new Date).getTime(),r="ja"===this.$i18n.locale?"".concat(t,"/api/").concat(this.$route.params.card,".png?t=").concat(e):"".concat(t,"/api/").concat(this.$i18n.locale,"/").concat(this.$route.params.card,".png?t=").concat(e),n="".concat(this.$t("当サイトは、道内の新型コロナウイルス感染症（COVID-19）に関する最新情報を提供するために作成されました。開発は、ICTエンジニアやデザイナーなどによって結成された「JUST道IT」が行っています。"));return{title:this.title,meta:[{hid:"og:url",property:"og:url",content:t+this.$route.path+"/"},{hid:"og:title",property:"og:title",content:this.title+" | "+this.$t("北海道")+" "+this.$t("新型コロナウイルス{mobileBreak}まとめサイト",{mobileBreak:""})},{hid:"description",name:"description",content:n},{hid:"og:description",property:"og:description",content:n},{hid:"og:image",property:"og:image",content:r},{hid:"twitter:image",name:"twitter:image",content:r}]}}},$=r(4),component=Object($.a)(l,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",{directives:[{name:"show",rawName:"v-show",value:"true"===this.$route.query.embed||"true"===this.$route.query.ogp,expression:"\n    this.$route.query.embed === 'true' || this.$route.query.ogp === 'true'\n  "}]},["current-patients"===this.$route.params.card?e("current-patients-card"):"contacts"===this.$route.params.card?e("contacts-card"):"discharges-summary"===this.$route.params.card?e("discharges-card"):"inspections"===this.$route.params.card?e("inspections-card"):"patients"===this.$route.params.card?e("patients-card"):"patients-summary"===this.$route.params.card?e("patients-summary-card"):"querents"===this.$route.params.card?e("querents-card"):this._e()],1)}),[],!1,null,null,null);e.default=component.exports}}]);