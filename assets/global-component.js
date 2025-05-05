(()=>{
    customElements.define("section-add-cart", class SectionAddCart extends HTMLElement{
        constructor(){
            super()
        }
        connectedCallback(){
            console.log("id", this.id)
        }
        
    })
})()