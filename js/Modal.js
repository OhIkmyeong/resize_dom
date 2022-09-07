import { Resize } from "./Resizable.js";

export class Modal_Ctrl{
    /** 준비 */
    init(){
        //모달 드래그 관련
        const $$modal = document.querySelectorAll('[data-modal]');
        if(!$$modal.length){return;}
        for(let $modal of $$modal){ 
            $modal && new Draggable($modal);
        }//for
    }//init
}//class-Modal_Ctrl

/* ----------- 모달 드래그 ------------ */
/* 윈도우 사이즈 */
const WINDOW_SIZE = {
    wid : window.innerWidth,
    hei : window.innerHeight
};

/** 윈도우 사이즈 업데이트 */
function update_window_size(){
    WINDOW_SIZE.wid = window.innerWidth;
    WINDOW_SIZE.hei = window.innerHeight;
}//update_window_size

/** 윈도우 드래그 해제 
 * @deprecated 원래는 모달 드래그시 셀렉션(드래그 선택)되는 현상을 막으려고 만들어놨으나, 정작 모달 안의 input같은것들이 바로 포커스 해제 되는 문제가 발생하여 사용하지 않습니다.
 * @see https://w3c.github.io/selection-api
 * @see https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
*/
export function clear_selection(){
    if (window.getSelection().empty) {  
        // Chrome
        window.getSelection().empty();
    }else if(window.getSelection().removeAllRanges){  
        // Firefox
        window.getSelection().removeAllRanges();
    }
}//clear_selection

/* CLASS - DRAGGABLE */
class Draggable{
    /** MODAL을 드래그 가능하게 만들어 줍니다.
     * @param $wrap DOM .wrap-modal
     */
    constructor($wrap){
        this.$modal = $wrap;
        console.log(this.$modal);
        this.is_draggable = false;
        this.SIZE = {
            wid : this.$modal.getBoundingClientRect().width,
            hei : this.$modal.getBoundingClientRect().height}
        this.LIMIT = {
            right : WINDOW_SIZE.wid - (this.SIZE.wid / 2),
            bottom : WINDOW_SIZE.hei - (this.SIZE.hei / 2)}
        this.POS = {
            last : {x:null, y:null},
            final : {x:null, y:null}}

        //실행
        this.RESIZE = new Resize(this); 
        this.init();
    }//constructor;

    /** 드래그 기능 실행 시작 */
    init(){
        this.$modal.addEventListener('mousedown', this.ready_to_drag, {once:true});
    }//init

    /** 드래그 준비(mousedown)
     * @param e event
    */
    ready_to_drag = (e) =>{
        this.is_draggable = true;
        this.POS.last.x = e.clientX  - this.$modal.getBoundingClientRect().left;
        this.POS.last.y = e.clientY  - this.$modal.getBoundingClientRect().top;

        /* update limit size.. */
        update_window_size();
        this.LIMIT.right = WINDOW_SIZE.wid - (this.SIZE.wid / 2);
        this.LIMIT.bottom = WINDOW_SIZE.hei - (this.SIZE.hei / 2);

        window.addEventListener('mousemove', this.on_drag);
    }//ready_to_drag
    
    /** 드래그 중(mousemove) 
     * @param e event
    */
    on_drag = (e) => {
        if(!this.is_draggable){return;}
        if(this.RESIZE.IS_REISZE) return;
        const currX = e.clientX - this.POS.last.x;
        const currY = e.clientY - this.POS.last.y;

        /* X축 */
        if(currX <= (this.SIZE.wid / -2)){
            this.POS.final.x = (this.SIZE.wid / -2);
        }else if(currX > this.LIMIT.right){
            this.POS.final.x = this.LIMIT.right;
        }else{
            this.POS.final.x = currX;}
            
        /* Y축 */
        if(currY <= 0){
            this.POS.final.y = 0;
        }else if(currY > this.LIMIT.bottom){
            this.POS.final.y = this.LIMIT.bottom;
        }else{
            this.POS.final.y = currY;}

        /* 최종 css 적용 */
        const {final:{x,y}} = this.POS;
        this.$modal.style.transform = `translate(${x}px,${y}px)`; 

        clear_selection();

        window.addEventListener('mouseup',this.stop_drag);
        window.addEventListener('mouseleave',this.stop_drag);
    }//on_drag

    /** 드래그 끝(mouseup) */
    stop_drag = () => {
        this.is_draggable = false;
        this.POS.last.x = this.$modal.getBoundingClientRect().left;
        this.POS.last.y = this.$modal.getBoundingClientRect().top;

        this.$modal.addEventListener('mousedown', this.ready_to_drag, {once:true});
    }//stop_drag
}//class-Draggable