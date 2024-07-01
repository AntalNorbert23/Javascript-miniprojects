import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import Settings from "./views/Settings.js";
import PostView from "./views/PostView.js"

const pathToRegex=path=> new RegExp("^"+path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") +"$")

const getParams=match=>{
    const values= match.result.slice(1);
    const keys= Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result=>result[1]);

    return Object.fromEntries(keys.map((key,i)=>{
        return [key,values[i]];
    }))
}

const navigateTo=url=>{
    history.pushState(null,null,url);
    router();
}

const router=async()=>{
    const routes=[
        {path:"/", view: Dashboard},
        {path:"/posts", view:Posts},
        {path:"/posts/:id", view:PostView},
        {path:"/settings", view:Settings},
        //{path:"/404",view:()=>{console.log("viewing 404")}}
    ];

    //test units for a potential route-loop through

    const potentialMatches=routes.map(route=>{
        return {
            route:route,
            result:location.pathname.match(pathToRegex(route.path))
        }
    })

    let match=potentialMatches.find(match=>match.result !== null);

    if(!match){
        match={
            route:routes[3],
            result:[location.pathname]
        }
    }

    const view = new match.route.view(getParams(match));

    document.querySelector('#app').innerHTML=await view.getHtml();
    console.log(match)
};

//history preserving
window.addEventListener("popstate",router);

//route navigation
document.addEventListener("DOMContentLoaded",()=>{
    document.body.addEventListener("click",(event)=>{
        if(event.target.matches("[data-link]")){
            event.preventDefault();
            navigateTo(event.target.href);
        }
    })
    router();
})