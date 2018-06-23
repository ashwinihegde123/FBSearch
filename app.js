let next = '';
let getData = function(removeLoadMore){
    let fb_response = {};
    let http = new XMLHttpRequest();
    // get the query text from document
    let queryInput = document.getElementById("searchPages");
    // TODO: validation
    if(!queryInput.value){
        return;
    }
    if(removeLoadMore){
        let element = document.getElementsByClassName('load-more')[0];
        element.parentNode.removeChild(element);
    }
    let str = encodeURIComponent(queryInput.value);    
    let access_token = "218780472070536|WibTPz1AII11iWyrkTipRsGGj8Q"; // my access token here
    let url = next || "https://graph.facebook.com/search?type=place&q="+ str +"&fields=name,about,description,link,category_list&access_token="+access_token;
    http.open("GET", url, true);
    http.onreadystatechange = function () {
        let done = 4, ok = 200;
        if (http.readyState == done && http.status == ok) {
            fb_response = JSON.parse(http.responseText);
            next = fb_response.paging.next;
            let showNext = next ? true : false;
            displayResults(fb_response, showNext);
        }
    };
    http.send(null);
    };
    
    
    let displayResults = function(pages, showNext){
       let resultDiv = document.getElementsByClassName('page-results')[0];
       if(pages.data.length){
        //   resultDiv.innerHTML = "";
       }
       else{
          resultDiv.innerHTML = "No results found";
       }
    //    pages.data.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} ); 
       for(let i=0; i<pages.data.length; i++)
       {
          let { name, category_list, id, about, description, link } = pages.data[i];
          about = about ? about : '';
          description = description ? description : '';
          let pageLink = "<a class='redirect' target='_blank' href='"+link + "' > Link</a>";  
         let heartIcon = '<div class="heart1"><svg class="heart" viewBox="0 0 32 29.6"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/></div>';        
          let divItem = "<div class='collapsible'>"+name+ "<div>"+ about + "</div></div><div class='content'><p>" +description+ "</p>"+ pageLink +heartIcon +"</div>";
          let page = document.createElement("div");
          page.innerHTML = divItem;
          resultDiv.appendChild(page);
         }
         if(showNext) {
             let nextLink = '<button class="search-button load-more" onclick="getData(true)" type="submit">Load More</button>';
             let nextDiv = document.createElement("div");
             nextDiv.innerHTML = nextLink;
             resultDiv.appendChild(nextDiv);
            }
         addEventListener();

        };
    
    let addEventListener = function(){
        let coll = document.getElementsByClassName("collapsible");
        let heart = document.getElementsByClassName("heart");
        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                let content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
        for (let i = 0; i < heart.length; i++) {
            heart[i].addEventListener("click", function() {
                this.classList.toggle("favourite");
                heart[i].parentNode.parentNode.parentNode.classList.toggle('favourites');
                // let content = this.nextElementSibling;
            });
        }
    }

    let filterFavourites = function(){
        let parentDiv = document.getElementsByClassName('favourite-results')[0];
       let resultDiv = document.getElementsByClassName('page-results')[0];        
        let favourites = resultDiv.getElementsByClassName('favourites');
        let favouriteArray = Array.prototype.slice.call( favourites );
        let favourites1 = favouriteArray.reduce(function(a,b){ return a + b.outerHTML}, '');
        parentDiv.innerHTML = favourites1;
    }