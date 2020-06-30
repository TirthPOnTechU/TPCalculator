const display=document.querySelector('.display-screen');
const numberBtns=[...document.querySelectorAll('.number')];
const pointBtn=document.querySelector('.point');
let calculation={
    prevNum:'',
    prevOperand:'',
    currentNum:'',
    currentOperand:'',
    displayNum:'',
    answer:'',
    isSpaceAvailabe:true,
    isPrevAvailable:true,
    solveAgain:false,
    equalsClicked:false
}
document.addEventListener('DOMContentLoaded',(e)=>{
    document.addEventListener('click',(e)=>{
        let className=e.target.className;
        //number selected
        if(className.indexOf('number')>-1){
            if(calculation.equalsClicked){
                reset();
            }
            if(e.target.textContent=='.'){
                e.target.disabled=true;
                if(calculation.displayNum=='' ||calculation.displayNum=='-'){
                    calculation.displayNum+='0';
                }
            }
            calculation.displayNum+=e.target.textContent;
            display.textContent=calculation.displayNum;
            if(display.textContent.length>10){
                disableNumberBtns();
            }

        }
        //operand selected
        if(className.indexOf('operator')>-1){
            if(calculation.displayNum=='' && e.target.textContent=='-'){
                calculation.displayNum+='-';
                display.textContent=calculation.displayNum;
                return;
            }else if(calculation.displayNum=='-' || calculation.displayNum==''){
                showError();
                return;
            }

            calculation.equalsClicked=false;
            if(calculation.isSpaceAvailabe){
                calculation.currentNum=calculation.displayNum;
                calculation.currentOperand=e.target.textContent;
            }else{
                if(solveSomething(e)=='error'){
                    showError();
                    return;
                };
            }
            rearangeMemoryIfNeeded();
            if(calculation.solveAgain){
                if(solveSomething(e)=='error'){
                    showError();
                    return;
                };
            }
            pointBtn.disabled=false;
            calculation.displayNum='';
            display.textContent='';
        }
        //equals selected
        if(className.indexOf('equals')>-1){
            if(calculation.displayNum=='' || (calculation.isPrevAvailable && calculation.isSpaceAvailabe)){
                showError();
                return;
            }
            calculation.equalsClicked=true;
            if(!calculation.isPrevAvailable && calculation.isSpaceAvailabe){
                calculation.currentNum=display.textContent;
                calculation.currentOperand=calculation.prevOperand;
                if(solveSomething(e)=='error'){
                    showError();
                    return;
                };
            }else if(calculation.isPrevAvailable && !calculation.isSpaceAvailabe){
                if(solveSomething(e)=='error'){
                    showError();
                    return;
                };
            }else if(!calculation.isPrevAvailable && !calculation.isSpaceAvailabe){
                if(solveSomething(e)=='error'){
                    showError();
                    return;
                };
                calculation.currentOperand=calculation.prevOperand;
                if(solveSomething(e)=='error'){
                    showError();
                    return;
                };
            }
            let tempAnswerStorage=calculation.currentNum;
            reset();
            calculation.equalsClicked=true;
            if(tempAnswerStorage.length>10){
                tempAnswerStorage=parseFloat(tempAnswerStorage).toExponential(6).toString();
            }
            calculation.displayNum=tempAnswerStorage;
            display.textContent=tempAnswerStorage;
        }
        //clear selected
        if(className.indexOf('clear')>-1){
            reset();
        }
        if(className.indexOf('delete')>-1){
            calculation.equalsClicked=false;
           calculation.displayNum=calculation.displayNum.substring(0,calculation.displayNum.length-1);
           display.textContent=calculation.displayNum;
        }
    })
})

function solveSomething(e){
    if(calculation.currentOperand=='*'||calculation.currentOperand=='/'){
        if(calculation.currentOperand=='/' && calculation.displayNum=='0'){
            return 'error';
        }
        let answer=solve(calculation.currentNum,calculation.currentOperand,calculation.displayNum);
        
        if(!calculation.equalsClicked){
            calculation.currentOperand=e.target.textContent;
        }
        calculation.currentNum=answer;
    }else{
        let answer=solve(calculation.prevNum,calculation.prevOperand,calculation.currentNum);
        if(!calculation.equalsClicked){
            calculation.prevNum=answer;
            calculation.prevOperand=calculation.currentOperand;
        }else{
            calculation.currentNum=answer;
        }
        calculation.isSpaceAvailabe=true;
        calculation.isPrevAvailable=false;
    }
}
function rearangeMemoryIfNeeded(){
    if((calculation.currentOperand=='+'||calculation.currentOperand=='-')&& calculation.isPrevAvailable){
        calculation.prevNum=calculation.currentNum;
        calculation.currentNum='';
        calculation.prevOperand=calculation.currentOperand;
        calculation.currentOperand='';
        calculation.isPrevAvailable=false;
        calculation.isSpaceAvailabe=true;
        calculation.solveAgain=false;
    }else{
        if((calculation.currentOperand=='+'||calculation.currentOperand=='-')&& !calculation.isPrevAvailable){
            calculation.solveAgain=true;
        }else{
            calculation.solveAgain=false;
        }
        calculation.isSpaceAvailabe=false;
    }
}
function solve(num1,operator,num2){
    num1=parseFloat(num1);
    num2=parseFloat(num2);
    switch(operator){
        case '*':
            return (num1*num2).toString();
        case '/':
            return (num1/num2).toString();
        case '+':
            return (num1+num2).toString();
        case '-':
            return (num1-num2).toString();
    }
}
function reset(){
    calculation.prevNum='';
    calculation.prevOperand='';
    calculation.currentNum='';
    calculation.currentOperand='';
    calculation.displayNum='';
    calculation.answer='';
    calculation.isSpaceAvailabe=true;
    calculation.isPrevAvailable=true;
    calculation.solveAgain=false;
    calculation.equalsClicked=false;
    display.textContent='';
    enableNumberBtns();
}
function disableNumberBtns(){
    numberBtns.forEach(btn=>{
        btn.disabled=true;
    });
}

function enableNumberBtns(){
    numberBtns.forEach(btn=>{
        btn.disabled=false;
    });
}
function showError(){
    reset();
    display.textContent='ERROR';
}