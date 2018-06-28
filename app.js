//All constaants declaration
const ACCESS_TOKEN = "218780472070536|WibTPz1AII11iWyrkTipRsGGj8Q";
const FACEBOOK_SEARCH_URL = "https://graph.facebook.com/search?type=place&q=";
const FACEBOOK_SEARCH_FIELDS = "&fields=name,about,description,link,category_list";
const FACEBOOK_SEARCH_ACCESS_TOKEN = "&access_token=";
const HTTP_DONE = 4;
const HTTP_OK = 200;

// Local storage related code

/**
 * Set item in local storage
 * @param {String} key 
 * @param {Object} value
 */
 function setItem(key, value) {
    return window.localStorage.setItem(key, value);
  }

  /**
   * Get value from local storage
   * @param {String} key 
   */
   function getItem(key) {
    return window.localStorage.getItem(key);
  }

  /**
     * Create given element with innerHTML
     * @param {String} type 
     * @param {String} innerHTML 
     */
    function createElement(type, innerHTML) {
        let element = document.createElement(type); 
        element.innerHTML = innerHTML;
        return element;  
    }

    /**
     * 
     * @param {String} className 
     */
    function clearElement(className) {
        let resultDiv = document.getElementsByClassName(className)[0];
        resultDiv.innerHTML = "";
    }

    /**
     * Convert any array( ex: domtokenlist) to Array
     * @param {Object} arrayFrom 
     */
    function convertToArray(arrayFrom) {
        return Array.from(arrayFrom);
    }

  // Get page result and display the result on the UI
/**
 * 
 */
async function getData(removeLoadMore) {
    setItem('fbSearchResponse', '');
    setItem('nextPageUrl', '');
    let fb_response = {};
    if(!removeLoadMore){
        clearElement('page-results');
    }
    // get the query text from document
    let queryInput = document.getElementById("searchPages");
    if(!queryInput.value){
        return;
    }
    let searchString = encodeURIComponent(queryInput.value);    
     // my access token here
    let url = FACEBOOK_SEARCH_URL + searchString +FACEBOOK_SEARCH_FIELDS + FACEBOOK_SEARCH_ACCESS_TOKEN + ACCESS_TOKEN;
    let http = new XMLHttpRequest();   
    http.open("GET", url, true);
    http.onreadystatechange = function () {
        let done = 4, ok = 200;
        if (http.readyState == done && http.status == ok) {
            processResponse(http.responseText);
        }
    };
    http.send(null);
    };

    /**
     * Process response and call display result.
     * @param {Object} response 
     */
    function processResponse (response) {
        fb_response = JSON.parse(response);
        setItem('fbSearchResponse', JSON.stringify(fb_response.data));
        let nextUrl = fb_response.paging ? fb_response.paging.next : "";
        setItem('nextPageUrl', nextUrl);
        // let showNext = nextUrl ? true : false;
        displayResults();
    }

    /**
     * set the page and create results
     */
    function displayResults(){
        let pages = JSON.parse(getItem('fbSearchResponse'));
        let loadMore = getItem('nextPageUrl');
        let resultDiv = document.getElementsByClassName('page-results')[0];
        let loadMoreDiv = document.getElementsByClassName('load-more')[0];        
        if(!pages.length){
            resultDiv.innerHTML = "No results found";
        }
        for(let i=0; i<pages.length; i++) {
            let { name, category_list, id, about, description, link } = pages[i];
            about = about ? about : '';
            description = description ? description : '';
            let pageLink = "<a class='redirect' target='_blank' href='"+link + "' > Link</a>";  
            let heartIcon = '<div class="heart1"><svg class="heart" id='+ id +' viewBox="0 0 32 29.6"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/></div>';        
            let divItem = "<div class='collapsible'>"+name+ "<div>"+ about + "</div></div><div class='content'><p>" +description+ "</p>"+ pageLink +heartIcon +"</div>";
            let page = createElement("div", divItem);
            resultDiv.appendChild(page);
        }

         if(loadMore && loadMore != '') {
            loadMoreDiv.style.display = "block";
        }else{
            loadMoreDiv.style.display = "none";
        }
         addEventListener();
        };

    /**
     * render favourites from local storage
     */
    function filterFavourites (){
        let favouriteResults = getItem('favouriteResults') ? JSON.parse(getItem('favouriteResults')) : {data:[]};
        clearElement('favourite-results');
        let parentDiv = document.getElementsByClassName('favourite-results')[0];
        for(let i=0; i<favouriteResults.data.length; i++) {
            let { name, category_list, id, about, description, link } = favouriteResults.data[i];
            about = about ? about : '';
            description = description ? description : '';
            let pageLink = "<a class='redirect' target='_blank' href='"+link + "' > Link</a>";  
            // let heartIcon = '<div class="heart1"><svg class="heart" id='+ id +' viewBox="0 0 32 29.6"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/></div>';        
            let divItem = "<div class='details'>"+name+ "<div>"+ about + "</div></div><div class='content-fav'><p>" +description+ "</p>"+ pageLink +"</div>";
            let page = createElement("div", divItem);
            parentDiv.appendChild(page);
        }
        // addEventListener();
    }

    /**
     * Event listeners for the page
     */
        function addEventListener (){
        let pages = JSON.parse(getItem('fbSearchResponse')); 
        let favouriteResults = getItem('favouriteResults') ? JSON.parse(getItem('favouriteResults')) : {data:[]};                               
        let coll = document.getElementsByClassName("collapsible");
        let heart = document.getElementsByClassName("heart");
        // Click for collapsible divs
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
        // click effect for the heart/favourites
        for (let i = 0; i < heart.length; i++) {
            heart[i].addEventListener("click", function() {
                let id = this.id;
                this.classList.toggle("favourite");
                if(convertToArray(this.classList).indexOf('favourite') > -1){
                    favouriteResults.data.push(pages[i]);
                }else{
                    let index = favouriteResults.data.findIndex(x => x.id==id);
                    favouriteResults.data.splice(index, 1);
                }
                setItem('favouriteResults', JSON.stringify(favouriteResults));
            });
        }
    }
