import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import Settings from "./views/Settings.js";

const navigateTo=url=>{
    history.pushState(null,null,url);
    router();
}

const router=async()=>{
    const routes=[
        {path:"/", view: Dashboard},
        {path:"/posts", view:Posts},
        {path:"/settings", view:Settings},
        //{path:"/404",view:()=>{console.log("viewing 404")}}
    ];

    //test units for a potential route-loop through

    const potentialMatches=routes.map(route=>{
        return {route:route,isMatch:location.pathname === route.path }
    })

    let match=potentialMatches.find(match=>match.isMatch);

    if(!match){
        match={
            route:routes[3],
            isMatch:true
        }
    }

    const view = new match.route.view();

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