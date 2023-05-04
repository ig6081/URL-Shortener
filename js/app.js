generateElement();

document.querySelector('.hamburgerIcon').addEventListener('click',()=>{
   element.classList.toggle('change');
   let navbar = document.querySelector('.navbar');
   navbar.classList.toggle('show');
});

let shortenBtn = document.getElementById('shorten');
shortenBtn.addEventListener('click',()=>{
   console.log('Click event has been triggered');
   let enteredLink = document.getElementById('link').value;
   console.log('The link entered by user is -  ',enteredLink);
   let wrongLinkText = document.querySelector('.wrongLinkText');
   if(enteredLink==='' || enteredLink=== undefined){
      wrongLinkText.classList.add('activate'); 
      document.getElementById('link').style.border = '2px solid red';
   }
   else{
      postRequest(enteredLink);
      wrongLinkText.classList.remove('activate');
   }
   
});

function postRequest(enteredLink){
   const  xhr = new XMLHttpRequest();
   xhr.getResponseHeader('Content-type','application/json');

   xhr.open('GET',`https://api.shrtco.de/v2/shorten?url=${enteredLink}`,true);

   xhr.onload = function(){
      let responseJson = JSON.parse(this.responseText);
      console.log(responseJson);
      if(responseJson.ok){
         createElement(responseJson.result.original_link,responseJson.result.full_short_link2);
      }
      else{
         console.log('Something went wrong - ',responseJson.error_code);
      }
   }
   xhr.send();
}

function createElement(originalLink,shortLink){
   let shortenedLinks = localStorage.getItem('shortenedLinks');
   if(shortenedLinks===null){
      shortenedLinksArray=[];
   }   
   else{
      shortenedLinksArray = JSON.parse(shortenedLinks);
   }
   let linkObj = {
      opLink : originalLink,
      shortLink: shortLink
   }
   console.log(linkObj);
   console.log(shortenedLinksArray);
   shortenedLinksArray.push(linkObj);
   localStorage.setItem('shortenedLinks',JSON.stringify(shortenedLinksArray));
   document.getElementById('link').value = '';
   generateElement();
}

function generateElement(){
   console.log('Generate Element is running');
   let shortenedLinks = localStorage.getItem('shortenedLinks');
   if(shortenedLinks===null){
      shortenedLinksArray=[];
   }   
   else{
      shortenedLinksArray = JSON.parse(shortenedLinks);
   }
   let html = '';
   for(let i = 0;i<shortenedLinksArray.length;i++){
      html+=`<div class="shortenedLink">
      <a href="${shortenedLinksArray[i].opLink}" class="originalLink linkItems" target="__blank">${shortenedLinksArray[i].opLink}</a>
      <a href="${shortenedLinksArray[i].shortLink}" class="shortened linkItems" target="__blank">${shortenedLinksArray[i].shortLink}</a>
      <button class="copyLink linkItems">Copy</button>
    </div>`
   }
   document.querySelector('.linksContainer').innerHTML = html;
}

function clipboard(linkToBeCopied){
   let textArea  = document.createElement('textarea');
   textArea.width  = "1px"; 
   textArea.height = "1px";
   textArea.background =  "transparent" ;
   textArea.value = linkToBeCopied;
   document.body.append(textArea);
   textArea.select();
   document.execCommand('copy');
   document.body.removeChild(textArea);
}

document.body.addEventListener('click',function(event){
   let target = event.target;
   if(target.nodeName === "BUTTON" && /copyLink/.test(target.className)){
      copyShortenedLink(target.parentElement,target);      
   }
})

function copyShortenedLink(parentElement,element){
   let shortenedLink = parentElement.childNodes[3].innerText;
   let text = shortenedLink;
   clipboard(text);
   element.innerHTML = "Copied!"
   element.style.backgroundColor = 'hsl(257, 27%, 26%)';
   setTimeout(() => {
      element.innerHTML = 'Copy';
      element.style.backgroundColor = 'hsl(180, 66%, 49%)';   
   }, 3000);  
}


