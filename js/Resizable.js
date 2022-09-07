export class Resizable{
    /** make DOM(data-resizable="true") Resizable */
    constructor(){
        this.$$dom = Array.from(document.querySelectorAll('[data-resizable]'));
        this.$$dom.forEach($dom => new Resize($dom));
    }//constructor
}//Resizable

export class Resize{
    constructor(DRAG){
        this.DRAG = DRAG;
        this.$dom = this.DRAG.$modal;
        this.$btn = null;
        this.IS_REISZE = false;
        this.POS_START = {x:null, y:null};
        this.init();
    }//constructor

    /** Init Resizable */
    init(){
        this.$btn = this.add_btn();
        this.$btn.addEventListener('mousedown', this.on_down,{once:true});
    }//init

    /** resize 가능한 버튼 추가 
     * @returns <button.btn-resize>
    */
    add_btn(){
        const $btn = document.createElement('BUTTON');
        $btn.classList.add('btn-resize');
        $btn.title = "사이즈조절";
        this.$dom.appendChild($btn);
        return $btn;
    }//add_btn

    on_down = (e) =>{
        this.IS_REISZE = true;
        this.POS_START.x = e.clientX;
        this.POS_START.y = e.clientY;
        window.addEventListener('mousemove', this.on_move);
        window.addEventListener('mouseup', this.cancel,{once:true});
    }//on_down

    cancel = () => {
        this.IS_REISZE = false;
        window.removeEventListener('mousemove', this.on_move);
        this.$btn.addEventListener('mousedown', this.on_down,{once:true});
    }//cancel

    on_move = e =>{
        if(!this.IS_REISZE) return;
        if(!this.DRAG.is_draggable) return;
        const {x,y} = this.POS_START;
        const nowX = e.clientX;
        const nowY = e.clientY;
        const wid = this.$dom.offsetWidth;
        const hei = this.$dom.offsetHeight;
        if(x < nowX){
            const per = (nowX - x);
            this.$dom.style.width = `${wid + per}px`;
        }

        if(x >= nowX){
            const per = (x - nowX);
            this.$dom.style.width = `${wid - per}px`;
        }

        if(y < nowY){
            const per = (nowY - y);
            this.$dom.style.height = `${hei + per}px`;
        }

        if(y >= nowY){
            const per = (y - nowY);
            this.$dom.style.height = `${hei - per}px`;
        }
        this.POS_START.x = nowX;
        this.POS_START.y = nowY;
    }//on_move
}//Resize