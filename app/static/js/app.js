// class Dropdown{
//     constructor( dropdown ){
//         this.dropdown = dropdown;
//     }
//     execute(){
        
//         let Parent_Block_Dropdown = document.querySelector( `.${this.dropdown}` );

//         let items = Parent_Block_Dropdown.querySelectorAll( `.vr-subcat` );

//         items.forEach( item => {

//             let Subelements = item.querySelector( `.vr-sub` );

//             Array.from( Subelements.querySelectorAll( `a` ) ).forEach( a => {

//                 let serparatorhref =  a.href.split( "/" );

//                 if( typeof parseInt( serparatorhref[serparatorhref.length - 1] ) == "number" && 1 <= parseInt( serparatorhref[serparatorhref.length - 1] ) ){
                    
//                     serparatorhref.splice( serparatorhref.length - 1, 1 );

//                     if( location.href.includes( serparatorhref.join("/") ) ){
//                         a.classList.add( `active-link` );

//                         a.parentNode.parentNode.parentNode.classList.add( `current` );
//                     }
//                 }
//                 else{ 
//                     if( a.href == window.location.href ){
//                         a.classList.add( `active-link` );

//                         a.parentNode.parentNode.parentNode.classList.add( `current` );
//                     }
//                 }
//             } );

//             if( item.classList.contains( `current` ) ){

//                 let subEl = item.querySelector( `.vr-sub` );
//                 subEl.classList.add( `show-d-i-f` );

//                 let ic = item.querySelector( `.dr-arrow ` );
//                 ic.classList.add( `R-90-r` )
//             }

//             let parent = item.querySelector( `.vr-parent` );
//             parent.addEventListener( `click`, e => {

//                 let subElement = e.target.closest( `.vr-subcat` ).querySelector( `.vr-sub` );
                
//                 let icon = e.target.closest( `.vr-subcat` ).querySelector( `.dr-arrow ` );

//                 subElement.classList.toggle( `show-d-i-f` );
//                 icon.classList.toggle( `R-90-r` );
//             } );
//         } );
//     }
// }

// class UserDropdown{
//     constructor( element ){
//         this.element = element;
//     }
//     execute(){

//         let parent =  document.querySelector( this.element );

//         let dropdownBtn = parent.querySelector( `#u-dropdown-btn` );
//         let dropdownContent = parent.querySelector( `.user-dropdown` );
//         dropdownBtn.addEventListener( `click`, e => {

//             dropdownContent.classList.toggle( `hidden` );
//         } );
        
//         window.addEventListener( `mousedown`, e => {

//             let userContainer =  parent.querySelector( `.icon-block-user` );
            
//             if( !userContainer.contains( e.target ) ){

//                 if( !dropdownContent.classList.contains( `hidden` ) ){
//                     dropdownContent.classList.add( `hidden` );
//                 }
//             }
//         } );
//     }
// }

// class CustomForms{
//     constructor( parent ){
//         this.parent = parent;
//     }
//     execute(){
        
//         let parent = document.querySelector( this.parent );

//         let inputs = parent.querySelectorAll( `[type="file"]` );


//         Array.from( inputs ).forEach( input => {

//             let inputHeight = parent.querySelector( `input` ).offsetHeight;
//             let inputWidth = parent.querySelector( `input` ).offsetWidth;
            
//             let customInput = document.createElement( `SPAN` );
//             customInput.classList.add( `new-custom-input` );
//             customInput.style.height = ``;
          
//             customInput.style = `
//                 min-height :${inputHeight ? inputHeight: 40}px !important;
//                 max-width: ${inputWidth ? inputWidth: 350}px !important;
//                 min-width: ${100}px !important;
//             `
//             customInput.textContent = `Выбрать файлы`;
            
//             input.addEventListener( `change`, e =>{

//                 var inputFiles = e.target.files;

//                 if( inputFiles && inputFiles.length ){

//                     e.target.previousSibling.innerHTML = ``;

//                     for( let file of inputFiles ){
    
//                         let fileNameTag = document.createElement( `SPAN` );
//                         fileNameTag.style = `
//                             margin-left: 5px;
//                         `
//                         fileNameTag.innerHTML = file.name;
//                         fileNameTag.style = `padding: 5px;`
//                         fileNameTag.classList.add( `db` );
                        
//                         e.target.previousSibling.classList.add( `fww` );
//                         e.target.previousSibling.appendChild(fileNameTag);
//                     }
//                 }
//                 else{
//                     customInput.textContent = `Выбрать файлы`;
//                 }
                
//             } );
//             customInput.addEventListener( `click`, e =>{
//                 input.click();
//             } );

//             let Inputsparent = input.parentNode;

//             Inputsparent.insertBefore( customInput, input );
//         } );
//     }
// }
// let textarea = document.querySelectorAll( `textarea` );
// Array.from( textarea ).forEach( h => {
//     h.addEventListener( `keyup`, e => {
//         h.style.height = "20px";
//         h.style.height = (h.scrollHeight)+"px";
//     } );
// } );

class Search{
    constructor( input ){

        this.input = input;
    }
    execute(){

        
        const input = document.querySelector( this.input );

        // console.log( input );
        // const select = parent.querySelector( `select` );
        // //search-result
        const resultBlock = document.querySelector( `#search-result` );
        input.addEventListener( `keyup`, e => {

            if(  input.value.length > 2 && /\w+/.test( input.value ) ){
            
                const data = {
                    searchBy: 'client',
                    data: input.value,
                }
            
                let formData = new FormData();
            
                formData.append( `data`, data );
            
                fetch( '/api/search', {
            
                    method: 'POST',
                    body: JSON.stringify( data ),
                    headers: new Headers( {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    } )
                } )
                .then( response => response.json() )
                .then( response => {

                    resultBlock.innerHTML = ` `;
                    resultBlock.classList.remove( `search-hide` );
        
                    if( response.length > 0 ){
        
                        response.forEach( data => {
                        
                            let list = document.createElement( `LI` );
                            let a = document.createElement( `A` );
                            a.textContent = data.fname + ` ` + data.lname;

                            a.href = `/clients/profile/${ data._id }`;

                            list.appendChild( a );
                            resultBlock.appendChild( list );
                        } );
                    }
                    else{
        
                        let list = document.createElement( `LI` );
                        let a = document.createElement( `A` );
                        a.textContent = `Клиент не найден`;
                        list.appendChild( a );
                        resultBlock.appendChild( list );
                    }
                } );
            }
            else{
                resultBlock.classList.add( `search-hide` );
            }
        } );
        input.addEventListener( `focus`, () => {
            if( input.value.length > 0 ){
                resultBlock.classList.remove( `search-hide` );
            }
        } );
        window.addEventListener( `click`, e => {
            
            if( 
                !document.querySelector( `#search-result` ).contains( e.target )
                && !e.target.classList.contains( `fa-search` ) 
                && !e.target.classList.contains( `app-search__button` ) 
                &&!e.target.classList.contains( `app-search__input` ) 
            ){
                resultBlock.classList.add( `search-hide` );
            }
            // 
        } );
    }
}

// let hambuergerButton = document.querySelector( `.hambuerger > SVG` );

// hambuergerButton.addEventListener( `click`, e => {
//     const verticalMenu = document.querySelector( `.vertical-menu` );
    
//     const logoMenu = document.querySelector( `.logo-block` );
//     verticalMenu.classList.toggle( `show-f` );

//     // console.log( window.innerWidth );
//     // if( window.getComputedStyle( verticalMenu ).display == "none" ){
//     //     verticalMenu.style.display = "flex";
//     // }
//     // else{
//     //     verticalMenu.style.display = "none";
//     // }

//     const coloneLogo = logoMenu.cloneNode( true );
//     coloneLogo.style = `
//         display:block; 
//         width:auto; 
//         box-shadow: none; 
//         border: none;
//         padding-left:25%; 
//         `;
//     const mobileLogo = verticalMenu.querySelector( `.mobile-logo` );
//     mobileLogo.style = `margin-left:auto; margin-right:auto;`;

//     if( mobileLogo.childElementCount == 0 ){
//         mobileLogo.appendChild( coloneLogo );
//     }

    

// } );
