
const router=async()=>{
    const routes=[
        {path:"/", view:()=>console.log("viewing dashboard")},
        {path:"/posts", view:()=>console.log("viewing posts")},
        {path:"/settings", view:()=>console.log("viewing settings")},
        {path:"/404",view:()=>{console.log("viewing 404")}}
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

    console.log(match)
};

document.addEventListener("DOMContentLoaded",()=>{
    router();
})