(()=>{var a={};a.id=895,a.ids=[895],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:a=>{"use strict";a.exports=require("punycode")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},27910:a=>{"use strict";a.exports=require("stream")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55591:a=>{"use strict";a.exports=require("https")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:a=>{"use strict";a.exports=require("zlib")},78335:()=>{},79551:a=>{"use strict";a.exports=require("url")},81630:a=>{"use strict";a.exports=require("http")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},95394:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>C,patchFetch:()=>B,routeModule:()=>x,serverHooks:()=>A,workAsyncStorage:()=>y,workUnitAsyncStorage:()=>z});var d={};c.r(d),c.d(d,{GET:()=>w});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641),v=c(82461);async function w(a,{params:b}){try{let{orderId:a}=await b;console.log("Generating customer invoice for order:",a);let c=(0,v.UU)("https://mhfdvmeaipmuowjujyrc.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZmR2bWVhaXBtdW93anVqeXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MTYyMDIsImV4cCI6MjA3NDE5MjIwMn0.3F2BM5J0di1K5Xidcgpn8tKGZT7McJ5GvUxFbNpCHGs",{auth:{autoRefreshToken:!1,persistSession:!1}});console.log("Fetching order data...");let{data:d,error:e}=await c.from("orders").select("*").eq("id",a).single();if(e||!d)return console.error("Error fetching order:",e),u.NextResponse.json({error:"Order not found: "+(e?.message||"No data")},{status:404});console.log("Order found:",d);let{data:f,error:g}=await c.from("order_items").select(`
        *,
        parts (
          name,
          category,
          description
        )
      `).eq("order_id",a),h=[];!g&&f&&f.length>0?(h=f.map(a=>({product_name:a.parts?.name||"Product",quantity:a.quantity,price:a.price,category:a.parts?.category||"N/A",description:a.parts?.description||""})),console.log("Order items found:",h)):(console.log("No order_items found, using fallback data"),h=[{product_name:d.product_name||"Auto Parts",quantity:d.quantity||1,price:d.product_price||d.total_amount,category:"Auto Parts",description:""}]);let i={...d,order_items:h};return function(a,b){try{let c=a.order_items.reduce((a,b)=>a+b.quantity*b.price,0),d=.2*c,e=c+d,f=a.payment_plan||"full",g=a.amount_paid||0,h=a.remaining_amount||0;console.log("Invoice totals:",{subtotal:c,tax:d,total:e,paymentPlan:f,amountPaid:g});let i=function(a,b,c,d,e,f,g){let h=a=>new Date(a).toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"}),i=a=>new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"}).format(a);return`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice #${a.id}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
                line-height: 1.6;
            }
            .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e5e5e5;
            }
            .company-info h1 {
                color: #dc2626;
                margin: 0;
                font-size: 28px;
            }
            .company-info p {
                margin: 5px 0;
                color: #666;
            }
            .invoice-info {
                text-align: right;
            }
            .invoice-info h2 {
                color: #333;
                margin: 0;
                font-size: 24px;
            }
            .invoice-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 40px;
            }
            .billing-info h3 {
                color: #dc2626;
                margin-bottom: 10px;
                font-size: 16px;
                text-transform: uppercase;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            .items-table th,
            .items-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e5e5e5;
            }
            .items-table th {
                background-color: #f8f9fa;
                font-weight: 600;
                color: #333;
            }
            .items-table td:last-child,
            .items-table th:last-child {
                text-align: right;
            }
            .totals {
                margin-left: auto;
                width: 300px;
            }
            .totals-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e5e5e5;
            }
            .totals-row.total {
                font-weight: 600;
                font-size: 18px;
                border-bottom: 2px solid #333;
                margin-top: 10px;
            }
            .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e5e5e5;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .print-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc2626;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                z-index: 1000;
            }
            .print-button:hover {
                background: #b91c1c;
            }
            @media print {
                body { margin: 0; }
                .no-print { display: none; }
                .print-button { display: none; }
            }
        </style>
    </head>
    <body>
        <button class="print-button no-print" onclick="window.print()">Print Invoice</button>
        
        <div class="invoice-header">
            <div class="company-info">
                <h1>RPM Genuine Auto Parts</h1>
                <p>123 Auto Parts Lane</p>
                <p>Manchester, M1 1AA</p>
                <p>United Kingdom</p>
                <p>Phone: +44 161 123 4567</p>
                <p>Email: support@rpmgenuineautoparts.info</p>
            </div>
            <div class="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>Invoice #:</strong> ${a.id}</p>
                <p><strong>Date:</strong> ${h(a.created_at)}</p>
                <p><strong>Status:</strong> ${a.payment_status.toUpperCase()}</p>
            </div>
        </div>

        <div class="invoice-details">
            <div class="billing-info">
                <h3>Bill To:</h3>
                ${a.user_profiles?`
                    <p><strong>${a.user_profiles.first_name||""} ${a.user_profiles.last_name||""}</strong></p>
                    <p>${a.user_profiles.email}</p>
                `:"<p>Customer Details Not Available</p>"}
                
                ${a.billing_address?`
                    <div style="margin-top: 15px;">
                        <p>${a.billing_address.address_line1}</p>
                        ${a.billing_address.address_line2?`<p>${a.billing_address.address_line2}</p>`:""}
                        <p>${a.billing_address.city}, ${a.billing_address.postcode}</p>
                        <p>${a.billing_address.country}</p>
                    </div>
                `:""}
            </div>
            
            <div class="billing-info">
                <h3>Ship To:</h3>
                ${a.shipping_address?`
                    <p>${a.shipping_address.address_line1}</p>
                    ${a.shipping_address.address_line2?`<p>${a.shipping_address.address_line2}</p>`:""}
                    <p>${a.shipping_address.city}, ${a.shipping_address.postcode}</p>
                    <p>${a.shipping_address.country}</p>
                `:"<p>Same as billing address</p>"}
                
                ${a.tracking_number?`
                    <div style="margin-top: 15px;">
                        <p><strong>Tracking Number:</strong> ${a.tracking_number}</p>
                    </div>
                `:""}
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${a.order_items.map(a=>`
                    <tr>
                        <td>
                            <strong>${a.parts.name}</strong>
                            ${a.parts.description?`<br><small style="color: #666;">${a.parts.description}</small>`:""}
                        </td>
                        <td>${a.parts.category}</td>
                        <td>${a.quantity}</td>
                        <td>${i(a.price)}</td>
                        <td>${i(a.quantity*a.price)}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">
                <span>Subtotal:</span>
                <span>${i(b)}</span>
            </div>
            <div class="totals-row">
                <span>VAT (20%):</span>
                <span>${i(c)}</span>
            </div>
            <div class="totals-row total">
                <span>Total:</span>
                <span>${i(d)}</span>
            </div>
            ${"half"===e?`
                <div class="totals-row" style="background-color: #f0f9ff; margin-top: 10px; padding: 8px;">
                    <span><strong>Payment Plan: 50% Deposit</strong></span>
                    <span></span>
                </div>
                <div class="totals-row">
                    <span>Amount Paid:</span>
                    <span>${i(f)}</span>
                </div>
                ${g>0?`
                    <div class="totals-row">
                        <span>Remaining Balance:</span>
                        <span style="color: #dc2626; font-weight: 600;">${i(g)}</span>
                    </div>
                `:""}
            `:`
                <div class="totals-row">
                    <span>Amount Paid:</span>
                    <span>${i(f)}</span>
                </div>
            `}
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>This invoice was generated on ${h(new Date().toISOString())}</p>
            <p>For support, contact us at support@rpmgenuineautoparts.info</p>
        </div>
    </body>
    </html>
  `}(a,c,d,e,f,g,h);return new u.NextResponse(i,{headers:{"Content-Type":"text/html","Content-Disposition":`inline; filename="invoice-${b}.html"`}})}catch(a){throw console.error("Error in generateInvoiceResponse:",a),a}}(i,a)}catch(a){return console.error("Error generating customer invoice:",a),u.NextResponse.json({error:"Failed to generate invoice: "+a.message},{status:500})}}let x=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/orders/[orderId]/invoice/route",pathname:"/api/orders/[orderId]/invoice",filename:"route",bundlePath:"app/api/orders/[orderId]/invoice/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"C:\\Users\\wisem\\OneDrive\\Desktop\\RPM\\app\\api\\orders\\[orderId]\\invoice\\route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:y,workUnitAsyncStorage:z,serverHooks:A}=x;function B(){return(0,g.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:z})}async function C(a,b,c){var d;let e="/api/orders/[orderId]/invoice/route";"/index"===e&&(e="/");let g=await x.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!y){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||x.isDev||y||(G="/index"===(G=D)?"/":G);let H=!0===x.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>x.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>x.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await x.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await x.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await x.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},96487:()=>{}};var b=require("../../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[586,461,692],()=>b(b.s=95394));module.exports=c})();