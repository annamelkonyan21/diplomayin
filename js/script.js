let linebreak  = "<br >";

function newMatrix(matrixSize){
    let k;
    let matrixIs = new Array(matrixSize);
    for( k = 0; k < matrixSize; k++){
        matrixIs[k] = new Array(matrixSize);
    }
    return matrixIs;
}

function newMatrix2(n,m){
    let k;
    let matrixIs = new Array(n);
    for( k = 0; k < n; k++){
        matrixIs[k] = new Array(m);
    }
    return matrixIs;
}
//---------- qr am -----------------

function AM(a, matrixSize){         
    let s = [], v = [] , myu = [];
    for(let i = 0; i < matrixSize-1; i++) {
        let sum = 0;
        for(let j = i; j < matrixSize; j++) {
            sum += Math.pow(a[j][i], 2);   
        }
        sum = Math.pow(sum,1/2); 
        if ( a[i][i] > 0 ){
            sum *= (-1);
        } else if ( a[i][i] < 0 ) {
            sum *= 1;
        } else {
            sum = 0;
        }
        s.push(sum);
        let vSum = 0;
        vSum = Math.pow(s[i], 2) - s[i]*a[i][i];
        v.push(1/vSum);
        myu.push(Math.sqrt(v[i]));
    }
    
    let ua = [];
    
    for(let i = 0; i < matrixSize-1; i++) {
        var ui = [];
        for(let j = 0; j < matrixSize; j++) {
            if(i == j ){
                ui[i] = a[i][i] - s[i];
                ua.push(ui[i]);
            }
            else if (i < j) {
                ui[i] = a[j][i];
                ua.push(ui[i]);
            } else {
                ui[i] = 0;
                ua.push(ui[i]);    
            }
        }   
    }        
    
    let u = [];
    
    while(ua.length) {
        u.push(ua.splice(0,matrixSize));
    }    
    
    let W = newMatrixUnequal(matrixSize-1,matrixSize);
    
    for(let i = 0; i < matrixSize-1; i++) {
        for(let j = 0; j < matrixSize; j++) {
            W[i][j] = myu[i]*u[i][j];
        }
    }
    
    let wTrans = newMatrixUnequal(matrixSize,matrixSize-1);  
    
    for(let i = 0; i < matrixSize; i++) {
        for(let j = 0; j < matrixSize-1; j++) {
            wTrans[i][j] = W[j][i];
        }
    }
    
    var pn = [];
    
    for(let i = 0; i < matrixSize-1; i++) {
        var pi = newMatrix(matrixSize, matrixSize);
        for(var j = 0; j < matrixSize; j++) {
            for(var k = 0; k < matrixSize; k++) {
                pi[j][k] = W[i][j] * wTrans[k][i];
            }
        }
        pn.push(pi);
    }        
    
    var p = pn;    
    
    for(let i = 0; i < matrixSize-1; i++) {           
        for(let j = 0; j < matrixSize; j++) {
            for(let k = 0; k < matrixSize; k++) {
                if(j === k) {
                    p[i][j][k] = 1 - pn[i][j][k];
                }
                else {
                    p[i][j][k] = 0 - pn[i][j][k];
                }
            }
        }
    }
    
    let p0 = p[matrixSize-2];
    let R = newMatrix(matrixSize,matrixSize);
    
    for(let i =  matrixSize-3; i >= 0; i--) {
        p0 = mul(p0,p[i]);
    }
    R = mul(p0,a);
    let Q =inverseMatrix(p0,matrixSize);
    let Am = mul(R,Q);
    
    return Am;
}

//--------------- condition qr-----------------

function condition(a,matrixSize,tau){
    let tt = [] , t = true;
    
    for(let i = 1; i < matrixSize; i++) {
        for(let j = 0; j < i; j++) {
            if( Math.abs(a[i][j]) < tau) {
                tt.push(true);
            } else {
                tt.push(false);
            }
        }
    }
    return tt;    
}

//----------- print matrix--------------------

function print(matrix,string){
    document.write(string + linebreak);
    for(let i =0; i<matrix.length; i++){
        for(let j =0; j<matrix.length; j++){
            document.write('Matrix['+(i+1)+']['+(j+1)+'] = '+matrix[i][j] + ' ');
        }
        document.write(linebreak);
    }
    document.write(linebreak);
}

//---------------- lambda ----------------------

function lambda(a,matrixSize){
    let lambda = [];
    for(let i = 0; i < matrixSize; i++){
            lambda.push(a[i][i].toFixed(3));
    }
    return lambda;
}

//---------------------print array---------------


function arrayPrint(array,name){
    for(let i =0; i < array.length; i++ ){
        document.write(name + "["+(i+1)+"] = " + array[i] + linebreak);
    }
}

//----------------- newMatrixUnequal -------------

function newMatrixUnequal(matrixSize1,matrixSize2){
    let k;
    let matrixIs = new Array(matrixSize1);
    for( k = 0; k < matrixSize1; k++){
        matrixIs[k] = new Array(matrixSize2);
    }
    return matrixIs;
}
///----------------------- matrix muls ---------
function mul(matrix,matrix2){
    let len = matrix.length;
    let mat = newMatrix(len);
    for(let i = 0; i<len; i++){
        for(let j=0; j<len; j++){
            mat[i][j] = 0;
            for(let k=0; k<len; k++){
                mat[i][j] = mat[i][j]+ matrix[i][k]*matrix2[k][j];
            }
        }
    }
    return mat;
}

//-------------------sub-------------------

function sub2(A,B,size){

    let C = newMatrix(size);
    for(let i = 0; i< size; i++){
        for(let j=0; j<size; j++){
            C[i][j] = A[i][j] - B[i][j];
        }
    }
    return C;
}

//----------- fadev ----------------

function inverseMatrix(A,matrixSize){
    let p = [];
    let p1 = hetq(A);
        p.push(p1); 
    let A1 = A, B1 = newMatrix(matrixSize);      
    for(let k = 1; k < matrixSize; k++ ){
        let E = newMatrix(matrixSize);
        for(let i =0; i < matrixSize; i++){
            for(let j = 0; j<matrixSize; j++){
                if (i === j ){
                    E[i][j] = p[k-1];
                } else {
                    E[i][j] = 0;
                }
            }
        }
        let B = newMatrix(matrixSize);
        B = sub2(A1,E,matrixSize);
        let C = mul(A,B);
        let p2 = hetq(C)/(k+1);
        p.push(p2);
        A1 = C;
        if(k ===  (matrixSize-1)){
            B1 = B;
        }
    }

    let reverseA = newMatrix(matrixSize);
    for(let i=0; i<matrixSize; i++){
        for(let j=0; j<matrixSize; j++){
            reverseA[i][j] = B1[i][j]/p[p.length-1];
        }
    }

    return reverseA;
}

//--------- hetq --------------

function hetq(matrix){
    let hetq = 0;
    for(let i = 0; i<matrix.length; i++){
        for(let j = 0; j<matrix.length; j++){
            if(i===j){
                hetq += matrix[i][j];
            }
        }
    }
    //console.log(typeof hetq);
    return hetq;
}

//------------sub----------------
function sub(matrix,matrix2){
    let len = matrix.length;
    let mat = newMatrix(len);
    for(let i = 0; i<len; i++){
        for(let j=0; j<len; j++){
             mat[i][j] = matrix[i][j]-matrix2[i][j];       
        }
    }
    return mat;
}

//----------leverev --------------
function leveryev(A,matrixSize){
    let s =[], p=[], pi = 0;
    s[0] = hetq(A);
    p[0] = s[0];
    let B = mul(A,A);
    let qq = hetq(B);
    s.push(qq);
    for(let k = 2; k < matrixSize; k++){
        let C = mul(A,B);
        B = C;
        let q = hetq(B);
        s.push(q);
    }
    for(let i = 1; i<matrixSize;i++){
        let sum = 0;
        var k =0;
        for(let j = i; j>0;j--){
            if(k<i){
                sum +=s[j-1]*p[k];
                k++;
            }
        } 
        p[i] = (s[i]-sum)/(i+1);
    }
    return p;
}

//-----fadev calculate-------------
function fadevCalculate(A,matrixSize){
    let p = [];
    let p1 = hetq(A);
    p.push(p1);
    let A1 = A, B1 = newMatrix(matrixSize);    
    for(let k = 1; k < matrixSize; k++ ){
        let E = newMatrix(matrixSize);
        for(let i =0; i < matrixSize; i++){
            for(let j = 0; j<matrixSize; j++){
                if (i ===j ){
                    E[i][j] = p[k-1];
                }else {
                    E[i][j] = 0;
                }
            }
        }
        let B = newMatrix(matrixSize);
        B = sub(A1,E);
        let C = mul(A,B);     
        let p2 = hetq(C)/(k+1);
        p.push(p2);
        A1 = C;   
    }
    return p;
}

//---------------am lr----------------------

function am(A,matrixSize){
    let L = newMatrix(matrixSize);
    let R = newMatrix(matrixSize);
    for(let i = 0; i < matrixSize; i++){
        for(let j = 0; j < matrixSize; j++){
            R[i][j] = 0;
            L[i][j] = 0;
        }
    }
    for(let i = 0; i< matrixSize; i++) {
        R[0][i] = A[0][i];
        L[i][0] = A[i][0]/R[0][0];
    }
    for(let i = 1; i <matrixSize; i++) {
        if (i > 1){
            for(let k = i-1; k < matrixSize; k++){
                let sum2 = 0;
                for(let j = 0; j < k-1; j++){
                    sum2 += L[i][j]*R[j][k];
                }
                L[i][k] = (A[i][k]-sum2)/R[k][k];    
            }
        }
        for(let k = i; k <matrixSize; k++ ){
            let sum1 = 0;
            for(let j = 0; j < i; j++){
                sum1 += L[i][j]*R[j][k];
            } 
            R[i][k] = A[i][k] - sum1;
        }
    }
    for(let i = 0; i < matrixSize; i++){
        for(let j = 0; j < matrixSize; j++){
            if (i == j) {
                L[i][j] = 1
            }
        }
    }
    let Aml =  mul(R,L);
    return Aml;
}

//--------------yakob am --------------
function yakobAm(A,matrixSize){
    let max = Math.abs(A[1][0]);
    let i0 = 1, j0 = 0;
    for(let i = 2 ; i < matrixSize; i++){
        for(let j = 0 ; j < i; j++){
            if(Math.abs(A[i][j])>max){
                max = Math.abs(A[i][j]);
                i0 = i;
                j0 = j;
            }
        }
    }
  
    let fi = 0.5*Math.atan((2*max)/(A[i0][i0]-A[j0][j0]));
    let c = Math.cos(0.5*Math.atan((2*A[i0][j0])/(A[i0][i0]-A[j0][j0])));
    let s = Math.sin(0.5*Math.atan((2*A[i0][j0])/(A[i0][i0]-A[j0][j0])));
  
    let Am = newMatrix(matrixSize);
    for(let i = 0; i < matrixSize; i++){
        Am[i0][i] = A[i][i0]*c + A[i][j0]*s;
        Am[j0][i] = -A[i][i0]*s + A[i][j0]*c;
        Am[i][i0] = Am[i0][i];
        Am[i][j0] = Am[j0][i];
    }
    for(let i = 0; i < matrixSize; i++){
        for(let j = 0; j < matrixSize; j++){
            if(i == j){
                Am[i][j] = A[i][j];
            }    
        }
    }
    Am[i0][i0] = A[i0][i0]*Math.pow(c, 2)+2*A[i0][j0]*s*c+A[j0][j0]*Math.pow(s,2);
    Am[j0][j0] = A[i0][i0]*Math.pow(s,2)-2*A[i0][j0]*s*c+A[j0][j0]*Math.pow(c,2);
    Am[i0][j0] = 0;
    Am[j0][i0] = 0;
    return Am;
}

function yakob(){
    let matrixSize =  prompt("matrix size",);
    matrixSize = parseInt(matrixSize);
    document.write("A"+ linebreak);
    let A = promptMatrix(matrixSize);
}



function displayAndBtn(activeDisplay, array1, array2, array3, array4, array5, array6,array7,array8, activeBtn, array11, array22, array33, array44, array55, array66, array77, array88) {
    document.getElementById(activeDisplay).style.display = "block";
    document.getElementById(array1).style.display = "none";
    document.getElementById(array2).style.display = "none";
    document.getElementById(array3).style.display = "none";
    document.getElementById(array4).style.display = "none";
    document.getElementById(array5).style.display = "none";
    document.getElementById(array6).style.display = "none";
    document.getElementById(array7).style.display = "none";
    document.getElementById(array8).style.display = "none";
    document.getElementById(activeBtn).setAttribute('style', 'background-color: #b39ddb  !important');
    document.getElementById(array11).setAttribute('style', 'background-color: #7e57c2  !important');
    document.getElementById(array22).setAttribute('style', 'background-color: #7e57c2  !important');
    document.getElementById(array33).setAttribute('style', 'background-color: #7e57c2  !important');
    document.getElementById(array33).setAttribute('style', 'background-color: #7e57c2  !important');
    document.getElementById(array44).setAttribute('style', 'background-color: #7e57c2  !important');
    document.getElementById(array55).setAttribute('style', 'background-color: #7e57c2  !important');
    document.getElementById(array66).setAttribute('style', 'background-color: #7e57c2  !important');
    document.getElementById(array77).setAttribute('style', 'background-color: #7e57c2  !important');
    document.getElementById(array88).setAttribute('style', 'background-color: #7e57c2  !important');

}

let addCount = true;
function add1(){
    displayAndBtn("add", "sub", "mul", "inverse", "leverey", "fadev", "qr", "lr", "yakob", "addClick", "subClick", "mulClick", "inverseClick", "levereyClick", "fadevClick", "qrClick", "lrClick", "yakobClick");
    if(addCount){
        location.href = "index.html#addition";
        let divs = document.createElement('div');
        divs.classList = "col s3 offset-s5";
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s4";
        let select1 = document.createElement('select');
        select1.id ="select_id1";
        let option1 = [];
        for(let i = 2; i <= 100; i++){
            option1[i] = document.createElement('option');
            option1[i].setAttribute("value", i);
            option1[i].innerHTML = i;
        }
        let div2 = document.createElement('div');
        div2.classList = "input-fluid col s4";
        let select2 = document.createElement('select');
        select2.id ="select_id2";
        let option2 = [];
        for(let i = 2; i <= 100; i++){
            option2[i] = document.createElement('option');
            option2[i].setAttribute("value", i);
            option2[i].innerHTML = i;
        }
        for(let i = 2; i <= 100; i++){
            select1.appendChild(option1[i]);
            select2.appendChild(option2[i]);
        }
        div1.appendChild(select1);
        div2.appendChild(select2);
        divs.appendChild(div1);
        divs.appendChild(div2);
        document.getElementById("part3").appendChild(divs);  
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "waves-effect waves-light btn";
        creatMatrix.addEventListener('click',getValue);
        let size = [];
        let table1 = document.createElement("table");
        let table2 = document.createElement("table");
        let header1 = document.createElement('h4');
        let header2 = document.createElement('h4');
        let table3 = document.createElement('table');
        let header3 = document.createElement('h4');
        let tr1 = [];
        let tr2 = [];
        function getValue(){
            size[0] = select1.value;
            size[1] = select2.value;
            size[0] = parseInt(size[0]);
            size[1] = parseInt(size[1]);
            let A = newMatrix2(size[0],size[1]);
            let B = newMatrix2(size[0],size[1]);
            let td1 = newMatrix2(size[0],size[1]);
            let td2 = newMatrix2(size[0],size[1]);    
            header1.classList = "center-align purple-text text-darken-4";
            header1.innerHTML = "A matrix";
            document.getElementById("part1").appendChild(header1);        
            header2.classList = "center-align purple-text text-darken-4";
            header2.innerHTML = "B matrix";
            document.getElementById("part2").appendChild(header2);
            let div1 = newMatrix2(size[0],size[1]);
            let div2 = newMatrix2(size[0],size[1]);
            let input1 = newMatrix2(size[0],size[1]);
            let input2 = newMatrix2(size[0],size[1]);
            let label1 = newMatrix2(size[0],size[1]);
            let label2 = newMatrix2(size[0],size[1]);
            for(let i = 0; i < size[0]; i++){
                tr1[i] = document.createElement('tr');
                tr2[i] = document.createElement('tr');
                for(let j = 0; j < size[1]; j++){
                    td1[i][j] = document.createElement('td');
                    td2[i][j] = document.createElement('td');
                    div1[i][j] = document.createElement('div');
                    div2[i][j] = document.createElement('div');
                    label1[i][j] = document.createElement('label');
                    label2[i][j] = document.createElement('label');
                    input1[i][j] = document.createElement('input');
                    input2[i][j] = document.createElement('input');
                    let inputValue1 = "A["+(i+1)+"]["+(j+1)+"]";
                    let inputValue2 = "B["+(i+1)+"]["+(j+1)+"]";    
                    div1[i][j].classList = "input-field";
                    div2[i][j].classList = "input-field";
                    label1[i][j].id = inputValue1;
                    label1[i][j].innerHTML =  inputValue1;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue1); 
                    input1[i][j].setAttribute("name", inputValue1);  
                    label2[i][j].id = inputValue2;
                    label2[i][j].innerHTML =  inputValue2;
                    input2[i][j].setAttribute('type', 'number');
                    input2[i][j].setAttribute("id", inputValue2); 
                    input2[i][j].setAttribute("name", inputValue2);  
                    div1[i][j].appendChild(label1[i][j]);
                    div2[i][j].appendChild(label2[i][j]);
                    div1[i][j].appendChild(input1[i][j]);
                    div2[i][j].appendChild(input2[i][j]);
                    td1[i][j].appendChild(div1[i][j]);
                    td2[i][j].appendChild(div2[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                    tr2[i].appendChild(td2[i][j]);
                }
            table1.appendChild(tr1[i]);
            table2.appendChild(tr2[i]);
            }
            document.getElementById("part1").appendChild(table1);        
            document.getElementById("part2").appendChild(table2);        
            
            let done = document.createElement('input');
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            done.addEventListener('click', calculate);
            let done2 = document.createElement('input');
            function calculate() { 
                let C = newMatrix2(size[0],size[1]);            
                let tr3 = [];
                let td3 = newMatrix2(size[0],size[1]);
                for(let i = 0; i < size[0]; i++){
                    tr3[i] = document.createElement('tr');
                    for(let j = 0; j < size[1]; j++){
                        A[i][j] = parseFloat(input1[i][j].value);
                        B[i][j] = parseFloat(input2[i][j].value);
                        C[i][j] = A[i][j] + B[i][j];    
                        td3[i][j] = document.createElement('td');
                        td3[i][j].innerHTML = "C[" + (i+1) + "][" + (j+1) + "] = " + C[i][j];
                        td3[i][j].classList = "center-align";
                        tr3[i].appendChild(td3[i][j])
                    }
                    table3.appendChild(tr3[i]);
                }
                
                header3.innerHTML = "C = A + B";
                header3.classList = "center-align purple-text text-darken-4";
                document.getElementById('part5').appendChild(header3);
                document.getElementById('part5').appendChild(table3);                      
            }
            document.getElementById("part12").appendChild(done);        
            done2.setAttribute('value', 'clear');
            done2.setAttribute('type','button');
            done2.classList = 'btn';
            done2.addEventListener('click', clear);
            function clear(){
                for(let i = 0; i < size[0]; i++){
                    table2.removeChild(tr2[i]);
                    table1.removeChild(tr1[i]);
                }
                document.getElementById("part12").removeChild(done);
                document.getElementById("part12").removeChild(done2);
                document.getElementById("part1").removeChild(header1);
                document.getElementById("part2").removeChild(header2);
                document.getElementById("part1").removeChild(table1);        
                document.getElementById("part2").removeChild(table2);        
                document.getElementById("part5").removeChild(header3);
                document.getElementById("part5").removeChild(table3);
            }
            document.getElementById("part12").appendChild(done2);     
        }     
        document.getElementById("part3").appendChild(creatMatrix);        
        addCount = false;        
    }
}

let subCount = true;
function sub1(){
    displayAndBtn("sub", "add", "mul", "inverse", "leverey", "fadev", "qr", "lr", "yakob","subClick", "addClick", "mulClick", "inverseClick", "levereyClick", "fadevClick", "qrClick", "lrClick", "yakobClick");
    if(subCount){
        location.href = "index.html#sub";
        let divs = document.createElement('div');
        divs.classList = "col s3 offset-s5";
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s4";
        let select1 = document.createElement('select');
        select1.id ="select_id1";
        let option1 = [];
        for(let i = 2; i <= 100; i++){
            option1[i] = document.createElement('option');
            option1[i].setAttribute("value", i);
            option1[i].innerHTML = i;
        }
        let div2 = document.createElement('div');
        div2.classList = "input-fluid col s4";
        let select2 = document.createElement('select');
        select2.id ="select_id2";
        let option2 = [];
        for(let i = 2; i <= 100; i++){
            option2[i] = document.createElement('option');
            option2[i].setAttribute("value", i);
            option2[i].innerHTML = i;
        }
        for(let i = 2; i <= 100; i++){
            select1.appendChild(option1[i]);
            select2.appendChild(option2[i]);
        }
        div1.appendChild(select1);
        div2.appendChild(select2);
        divs.appendChild(div1);
        divs.appendChild(div2);
        document.getElementById("spart3").appendChild(divs);  
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "waves-effect waves-light btn";
        creatMatrix.addEventListener('click',getValue);
        let size = [];
        let table1 = document.createElement("table");
        let table2 = document.createElement("table");
        let header1 = document.createElement('h4');
        let header2 = document.createElement('h4');
        let table3 = document.createElement('table');
        let header3 = document.createElement('h4');
        let tr1 = [];
        let tr2 = [];
        function getValue(){
            size[0] = select1.value;
            size[1] = select2.value;
            size[0] = parseInt(size[0]);
            size[1] = parseInt(size[1]);
            let A = newMatrix2(size[0],size[1]);
            let B = newMatrix2(size[0],size[1]);
            let td1 = newMatrix2(size[0],size[1]);
            let td2 = newMatrix2(size[0],size[1]);    
            header1.classList = "center-align purple-text text-darken-4";
            header1.innerHTML = "A matrix";
            document.getElementById("spart1").appendChild(header1);        
            header2.classList = "center-align purple-text text-darken-4";
            header2.innerHTML = "B matrix";
            document.getElementById("spart2").appendChild(header2);
            let div1 = newMatrix2(size[0],size[1]);
            let div2 = newMatrix2(size[0],size[1]);
            let input1 = newMatrix2(size[0],size[1]);
            let input2 = newMatrix2(size[0],size[1]);
            let label1 = newMatrix2(size[0],size[1]);
            let label2 = newMatrix2(size[0],size[1]);
            for(let i = 0; i < size[0]; i++){
                tr1[i] = document.createElement('tr');
                tr2[i] = document.createElement('tr');
                for(let j = 0; j < size[1]; j++){
                    td1[i][j] = document.createElement('td');
                    td2[i][j] = document.createElement('td');
                    div1[i][j] = document.createElement('div');
                    div2[i][j] = document.createElement('div');
                    label1[i][j] = document.createElement('label');
                    label2[i][j] = document.createElement('label');
                    input1[i][j] = document.createElement('input');
                    input2[i][j] = document.createElement('input');
                    let inputValue1 = "A["+(i+1)+"]["+(j+1)+"]";
                    let inputValue2 = "B["+(i+1)+"]["+(j+1)+"]";    
                    div1[i][j].classList = "input-field";
                    div2[i][j].classList = "input-field";
                    label1[i][j].id = inputValue1;
                    label1[i][j].innerHTML =  inputValue1;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue1); 
                    input1[i][j].setAttribute("name", inputValue1);  
                    label2[i][j].id = inputValue2;
                    label2[i][j].innerHTML =  inputValue2;
                    input2[i][j].setAttribute('type', 'number');
                    input2[i][j].setAttribute("id", inputValue2); 
                    input2[i][j].setAttribute("name", inputValue2);  
                    div1[i][j].appendChild(label1[i][j]);
                    div2[i][j].appendChild(label2[i][j]);
                    div1[i][j].appendChild(input1[i][j]);
                    div2[i][j].appendChild(input2[i][j]);
                    td1[i][j].appendChild(div1[i][j]);
                    td2[i][j].appendChild(div2[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                    tr2[i].appendChild(td2[i][j]);
                }
                table1.appendChild(tr1[i]);
                table2.appendChild(tr2[i]);
            }
            document.getElementById("spart1").appendChild(table1);        
            document.getElementById("spart2").appendChild(table2);        
            let done = document.createElement('input');
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            done.addEventListener('click', calculate);
            let done2 = document.createElement('input');
            function calculate() { 
                let C = newMatrix2(size[0],size[1]);            
                let tr3 = [];
                let td3 = newMatrix2(size[0],size[1]);
                for(let i = 0; i < size[0]; i++){
                    tr3[i] = document.createElement('tr');
                    for(let j = 0; j < size[1]; j++){
                        A[i][j] = parseFloat(input1[i][j].value);
                        B[i][j] = parseFloat(input2[i][j].value);
                        C[i][j] = A[i][j] - B[i][j];    
                        td3[i][j] = document.createElement('td');
                        td3[i][j].innerHTML = "C[" + (i+1) + "][" + (j+1) + "] = " + C[i][j];
                        td3[i][j].classList = "center-align";
                        tr3[i].appendChild(td3[i][j])
                    }
                    table3.appendChild(tr3[i]);
                }
                header3.innerHTML = "C = A - B";
                header3.classList = "center-align purple-text text-darken-4";
                document.getElementById('spart5').appendChild(header3);
                document.getElementById('spart5').appendChild(table3);                      
            }
            document.getElementById("spart12").appendChild(done);        
            done2.setAttribute('value', 'clear');
            done2.setAttribute('type','button');
            done2.classList = 'btn';
            done2.addEventListener('click', clear);
            function clear(){
                for(let i = 0; i < size[0]; i++){
                    table2.removeChild(tr2[i]);
                    table1.removeChild(tr1[i]);
                }
                document.getElementById("spart12").removeChild(done);
                document.getElementById("spart12").removeChild(done2);
                document.getElementById("spart1").removeChild(header1);
                document.getElementById("spart2").removeChild(header2);
                document.getElementById("spart1").removeChild(table1);        
                document.getElementById("spart2").removeChild(table2);        
                document.getElementById("spart5").removeChild(header3);
                document.getElementById("spart5").removeChild(table3);
            }
            document.getElementById("spart12").appendChild(done2);     
        }     
    document.getElementById("spart3").appendChild(creatMatrix);        
    subCount = false;        
    }
}

let mulCount = true;
function mul2(){
    displayAndBtn("mul", "sub", "add", "inverse", "leverey", "fadev", "qr", "lr", "yakob","mulClick", "subClick", "addClick", "inverseClick", "levereyClick", "fadevClick", "qrClick", "lrClick", "yakobClick");
    if(mulCount){
        location.href = "index.html#mul";
        let divs = document.createElement('div');
        divs.classList = "col s3 offset-s4";
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s4";
        let select1 = document.createElement('select');
        select1.id ="select_id1";
        let option1 = [];
        for(let i = 2; i <= 100; i++){
            option1[i] = document.createElement('option');
            option1[i].setAttribute("value", i);
            option1[i].innerHTML = i;
        }
        let div2 = document.createElement('div');
        div2.classList = "input-fluid col s4";
        let select2 = document.createElement('select');
        select2.id ="select_id2";
        let option2 = [];
        for(let i = 2; i <= 100; i++){
            option2[i] = document.createElement('option');
            option2[i].setAttribute("value", i);
            option2[i].innerHTML = i;
        }
        let div3 = document.createElement('div');
        div3.classList = "input-fluid col s4";
        let select3 = document.createElement('select');
        select3.id ="select_id2";
        let option3 = [];
        for(let i = 2; i <= 100; i++){
            option3[i] = document.createElement('option');
            option3[i].setAttribute("value", i);
            option3[i].innerHTML = i;
        }
        for(let i = 2; i <= 100; i++){
            select1.appendChild(option1[i]);
            select2.appendChild(option2[i]);
            select3.appendChild(option3[i]);
        }
        div1.appendChild(select1);
        div2.appendChild(select2);
        div3.appendChild(select3);
        divs.appendChild(div1);
        divs.appendChild(div2);
        divs.appendChild(div3);
        document.getElementById("mpart3").appendChild(divs);  
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "waves-effect waves-light btn";
        creatMatrix.addEventListener('click',getValue);
        let size = [];
        let table1 = document.createElement("table");
        let table2 = document.createElement("table");
        let header1 = document.createElement('h4');
        let header2 = document.createElement('h4');
        let table3 = document.createElement('table');
        let header3 = document.createElement('h4');
        let tr1 = [];
        let tr2 = [];
        let tr3 = [];
        function getValue(){
            size[0] = select1.value;
            size[1] = select2.value;
            size[2] = select3.value;
            size[0] = parseInt(size[0]);
            size[1] = parseInt(size[1]);
            size[2] = parseInt(size[2]);
            let A = newMatrix2(size[0],size[1]);
            let B = newMatrix2(size[1],size[2]);
            let td1 = newMatrix2(size[0],size[1]);
            let td2 = newMatrix2(size[1],size[2]);    
            header1.classList = "center-align purple-text text-darken-4";
            header1.innerHTML = "A matrix";
            document.getElementById("mpart1").appendChild(header1);        
            header2.classList = "center-align purple-text text-darken-4";
            header2.innerHTML = "B matrix";
            document.getElementById("mpart2").appendChild(header2);
            let div1 = newMatrix2(size[0],size[1]);
            let div2 = newMatrix2(size[1],size[2]);
            let input1 = newMatrix2(size[0],size[1]);
            let input2 = newMatrix2(size[1],size[2]);
            let label1 = newMatrix2(size[0],size[1]);
            let label2 = newMatrix2(size[1],size[2]);            
            for(let i = 0; i < size[0]; i++){
                tr1[i] = document.createElement('tr');
                for(let j = 0; j < size[1]; j++){
                    td1[i][j] = document.createElement('td');
                    div1[i][j] = document.createElement('div');
                    label1[i][j] = document.createElement('label');        
                    input1[i][j] = document.createElement('input');
                    let inputValue1 = "A["+(i+1)+"]["+(j+1)+"]";
                    div1[i][j].classList = "input-field";
                    label1[i][j].id = inputValue1;
                    label1[i][j].innerHTML =  inputValue1;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue1); 
                    input1[i][j].setAttribute("name", inputValue1);      
                    div1[i][j].appendChild(label1[i][j]);
                    div1[i][j].appendChild(input1[i][j]);
                    td1[i][j].appendChild(div1[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                }
                table1.appendChild(tr1[i]);
            }
            for(let i = 0; i < size[1]; i++){
                tr2[i] = document.createElement('tr');
                for(let j = 0; j < size[2]; j++){
                    td2[i][j] = document.createElement('td');
                    div2[i][j] = document.createElement('div');
                    label2[i][j] = document.createElement('label');        
                    input2[i][j] = document.createElement('input');
                    let inputValue2 = "A["+(i+1)+"]["+(j+1)+"]";
                    div2[i][j].classList = "input-field";
                    label2[i][j].id = inputValue2;
                    label2[i][j].innerHTML =  inputValue2;
                    input2[i][j].setAttribute('type', 'number');
                    input2[i][j].setAttribute("id", inputValue2); 
                    input2[i][j].setAttribute("name", inputValue2);      
                    div2[i][j].appendChild(label2[i][j]);
                    div2[i][j].appendChild(input2[i][j]);
                    td2[i][j].appendChild(div2[i][j]);
                    tr2[i].appendChild(td2[i][j]);
                }
                table2.appendChild(tr2[i]);
            }    
            document.getElementById("mpart1").appendChild(table1);        
            document.getElementById("mpart2").appendChild(table2);        
            let done = document.createElement('input');
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            done.addEventListener('click', calculate);
            let done2 = document.createElement('input');
            function calculate() { 
                let C = newMatrix2(size[0],size[2]);            
            
                let td3 = newMatrix2(size[0],size[2]);
                for(let i = 0; i < size[0]; i++){
                    for(let j = 0; j < size[1]; j++){
                        A[i][j] = parseFloat(input1[i][j].value);
                    }
                }
                for(let i = 0; i < size[1]; i++){
                    for(let j = 0; j < size[2]; j++){
                        B[i][j] = parseFloat(input2[i][j].value);
                    }
                }
                for(let i = 0; i < size[0]; i++){
                    for(let j = 0; j < size[2]; j++){
                        C[i][j] = 0;    
                    }
                }
                for(let i = 0; i < size[0]; i++) {
                    for(var j = 0; j < size[1]; j++) {
                        for(var k = 0; k < size[2]; k++) {
                            C[i][k] += A[i][j] * B[j][k];
                        }
                    }
                }      
                for(let i = 0; i < size[0]; i++){
                    for(let j = 0; j < size[2]; j++){
                        console.log(C[i][j]);
                    }
                }
                for(let i = 0; i < size[0]; i++){
                    tr3[i] = document.createElement('tr');
                    for(let j = 0; j < size[2]; j++){
                        td3[i][j] = document.createElement('td');
                        td3[i][j].innerHTML = "C[" + (i+1) + "][" + (j+1) + "] = " + C[i][j];
                        tr3[i].appendChild(td3[i][j])
                    }
                    table3.appendChild(tr3[i]);
                }
                header3.innerHTML = "C = A * B";
                header3.classList = "center-align purple-text text-darken-4";
                document.getElementById('mpart5').appendChild(header3);
                document.getElementById('mpart5').appendChild(table3);                      
            }
            document.getElementById("mpart12").appendChild(done);        
            done2.setAttribute('value', 'clear');
            done2.setAttribute('type','button');
            done2.classList = 'btn';
            done2.addEventListener('click', clear);
            function clear(){
                for(let i = 0; i < size[0]; i++){
                    table1.removeChild(tr1[i]);
                    table3.removeChild(tr3[i]);
                }
                for(let j = 0; j < size[1]; j++ ){
                    table2.removeChild(tr2[j]);
                }   
                document.getElementById("mpart12").removeChild(done);
                document.getElementById("mpart12").removeChild(done2);
                document.getElementById("mpart1").removeChild(header1);
                document.getElementById("mpart2").removeChild(header2);
                document.getElementById("mpart1").removeChild(table1);        
                document.getElementById("mpart2").removeChild(table2);        
                document.getElementById("mpart5").removeChild(header3);
                document.getElementById("mpart5").removeChild(table3);
            }
            document.getElementById("mpart12").appendChild(done2);     
        }     
    document.getElementById("mpart3").appendChild(creatMatrix);        
    mulCount = false;        
    }
    
}

let inverseCount = true;
function inverse(){
    displayAndBtn("inverse", "sub", "add", "mul", "leverey", "fadev", "qr", "lr", "yakob","inverseClick", "subClick", "addClick", "mulClick", "levereyClick", "fadevClick", "qrClick", "lrClick", "yakobClick");
    if (inverseCount) { 
        location.href = "index.html#inverse";
        let divs = document.createElement('div');
        divs.classList = "col s3 offset-s4";
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s4";
        let select1 = document.createElement('select');
        select1.id ="select_id1";
        select1.style.marginLeft = '100px';
        let option1 = [];
        for(let i = 2; i <= 100; i++){
            option1[i] = document.createElement('option');
            option1[i].setAttribute("value", i);
            option1[i].innerHTML = i;
        }        
        for(let i = 2; i <= 100; i++){
            select1.appendChild(option1[i]);
        }
        div1.appendChild(select1);
        divs.appendChild(div1);
        document.getElementById("dimension").appendChild(divs);  
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "waves-effect waves-light btn";
        creatMatrix.addEventListener('click',getValue);
        creatMatrix.style.marginRight = '100px';
        let size = [];
        let table1 = document.createElement("table");
        let header1 = document.createElement('h4');
        let tr1 = [];
        function getValue(){
            header1.innerHTML = "A matrix";
            header1.classList = 'center-align';
            size = select1.value;
            size = parseInt(size);
            let A = newMatrix(size);
            let td1 = newMatrix(size);
            let input1 = newMatrix(size);
            let label1 = newMatrix(size);
            let div2 = newMatrix(size);
            for(let i = 0; i < size; i++){
                tr1[i] = document.createElement('tr');
                for(let j = 0; j < size; j++){
                    td1[i][j] = document.createElement('td');
                    div2[i][j] = document.createElement('div');
                    label1[i][j] = document.createElement('label');
                    let inputValue1 = "A["+(i+1)+"]["+(j+1)+"]";
                    div2[i][j].classList = "input-field";
                    input1[i][j] = document.createElement('input');
                    label1[i][j].id = inputValue1;
                    label1[i][j].innerHTML =  inputValue1;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue1); 
                    input1[i][j].setAttribute("name", inputValue1);  
                    A[i][j] = input1[i][j].value;
                    div2[i][j].appendChild(label1[i][j]);
                    div2[i][j].appendChild(input1[i][j]);
                    td1[i][j].appendChild(div2[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                }
                table1.appendChild(tr1[i]);
            }
            document.getElementById('ipart1').appendChild(header1);  
            document.getElementById('ipart1').appendChild(table1);
            let done = document.createElement('input');
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            done.addEventListener('click', calculate);
            let donem = document.createElement('input');
            donem.setAttribute('value', 'clear');
            donem.setAttribute('type','button');
            donem.classList = 'btn';
            function calculate(){
                let B = newMatrix(size);
                let tabel2 = document.createElement('tabel');
                let tr2 = [];
                let td2 = newMatrix(size);
                for(let i=0; i < size; i++){
                    for(let j = 0; j < size; j++){
                        A[i][j] = input1[i][j].value;
                        A[i][j] = parseFloat(A[i][j]);
                    }
                }
                B = inverseMatrix(A,size);
                  for(let i = 0; i < size; i++ ){
                    tr2[i] = document.createElement('tr');
                    for(let j =0; j < size; j++){    
                        td2[i][j] = document.createElement('td');
                        td2[i][j].innerHTML = "B["+(i+1)+"]["+(j+1)+"]="+B[i][j];
                        tr2[i].appendChild(td2[i][j]);
                    }
                    tabel2.appendChild(tr2[i]);
                }
                let header2 = document.createElement('h4');
                header2.innerHTML = 'Inverse Matrix';
                header2.classList = 'center-align';
                document.getElementById('ipart2').appendChild(header2);
                document.getElementById('ipart11').appendChild(tabel2);
               
                donem.addEventListener('click', clear);
                function clear(){
                    for(let i = 0; i < size; i++){
                        table1.removeChild(tr1[i]);
                        tabel2.removeChild(tr2[i]);
                    }  
                    document.getElementById("ipart1").removeChild(done);
                    document.getElementById("ipart1").removeChild(header1);
                    document.getElementById("ipart2").removeChild(header2);
                    document.getElementById("ipart1").removeChild(table1);        
                    document.getElementById("ipart11").removeChild(tabel2);        
                    document.getElementById("ipart1").removeChild(donem);
                }
              
            }   
            document.getElementById('ipart1').appendChild(done);
            document.getElementById("ipart1").appendChild(donem);
                        
        }

        document.getElementById('dimension').appendChild(creatMatrix);
        inverseCount = false;
    } 
}
 
let levereyCount = true;
function leverey(){
    displayAndBtn("leverey", "sub", "add", "mul", "inverse", "fadev", "qr", "lr", "yakob","inverseClick", "subClick", "addClick", "mulClick", "inverseClick", "fadevClick", "qrClick", "lrClick", "yakobClick");
    if (levereyCount) { 
        location.href = "index.html#leverey";
        let divs = document.createElement('div');
        divs.classList = "col s3 offset-s4";
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s4";
        let select1 = document.createElement('select');
        select1.id ="select_id1";
        select1.style.marginLeft = '100px';
        let option1 = [];
        for(let i = 2; i <= 100; i++){
            option1[i] = document.createElement('option');
            option1[i].setAttribute("value", i);
            option1[i].innerHTML = i;
        }        
        for(let i = 2; i <= 100; i++){
            select1.appendChild(option1[i]);
        }
        div1.appendChild(select1);
        divs.appendChild(div1);
        document.getElementById("ldimension").appendChild(divs);  
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "btn waves-effect waves-light";
        creatMatrix.addEventListener('click',getValue);
        creatMatrix.style.marginRight = '100px';
        let size = [];
        let table1 = document.createElement("table");
        let header1 = document.createElement('h4');
        let tr1 = [];
        function getValue(){
            header1.innerHTML = "A matrix";
            header1.classList = 'center-align';
            size = select1.value;
            size = parseInt(size);
            let A = newMatrix(size);
            let td1 = newMatrix(size);
            let input1 = newMatrix(size);
            let label1 = newMatrix(size);
            let div2 = newMatrix(size);
            for(let i = 0; i < size; i++){
                tr1[i] = document.createElement('tr');
                for(let j = 0; j < size; j++){
                    td1[i][j] = document.createElement('td');
                    div2[i][j] = document.createElement('div');
                    label1[i][j] = document.createElement('label');
                    let inputValue1 = "A["+(i+1)+"]["+(j+1)+"]";
                    div2[i][j].classList = "input-field";
                    input1[i][j] = document.createElement('input');
                    label1[i][j].id = inputValue1;
                    label1[i][j].innerHTML =  inputValue1;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue1); 
                    input1[i][j].setAttribute("name", inputValue1);  
                    A[i][j] = input1[i][j].value;
                    div2[i][j].appendChild(label1[i][j]);
                    div2[i][j].appendChild(input1[i][j]);
                    td1[i][j].appendChild(div2[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                }
                table1.appendChild(tr1[i]);
            }
            document.getElementById('lpart1').appendChild(header1);  
            document.getElementById('lpart1').appendChild(table1);
            let done = document.createElement('input');
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            done.addEventListener('click', calculate);
            let donem = document.createElement('input');
            donem.setAttribute('value', 'clear');
            donem.setAttribute('type','button');
            donem.classList = 'btn';
            function calculate(){
                let tabel2 = document.createElement('tabel');
                let tr2 = [];
                let td2 = newMatrix2(size,2)
                for(let i=0; i < size; i++){
                    for(let j = 0; j < size; j++){
                        A[i][j] = input1[i][j].value;
                        A[i][j] = parseFloat(A[i][j]);
                    }
                }
                let p = leveryev(A,size);
                for(let i = 0; i < size; i++ ){
                    tr2[i] = document.createElement('tr');
                    for(let j =0; j < 2; j++){    
                        td2[i][j] = document.createElement('td');
                        if (j === 0) {
                            td2[i][j].innerHTML = "P["+(i+1)+"] = ";
                        }
                        else {
                            td2[i][j].innerHTML = p[i];
                        }
                        tr2[i].appendChild(td2[i][j]);
                    }
                    tabel2.appendChild(tr2[i]);
                }
                let header2 = document.createElement('h4');
                header2.innerHTML = 'P -?';
                header2.classList = 'center-align';
                document.getElementById('lpart2').appendChild(header2);
                document.getElementById('lpart11').appendChild(tabel2);
               
                donem.addEventListener('click', clear);
                function clear(){
                    for(let i = 0; i < size; i++){
                        table1.removeChild(tr1[i]);
                        tabel2.removeChild(tr2[i]);
                    }  
                    document.getElementById("lpart1").removeChild(done);
                    document.getElementById("lpart1").removeChild(header1);
                    document.getElementById("lpart2").removeChild(header2);
                    document.getElementById("lpart1").removeChild(table1);        
                    document.getElementById("lpart11").removeChild(tabel2);        
                    document.getElementById("lpart1").removeChild(donem);
                }
              
            }   
            document.getElementById('lpart1').appendChild(done);
            document.getElementById("lpart1").appendChild(donem);
                        
        }

        document.getElementById('ldimension').appendChild(creatMatrix);
        levereyCount = false;
    } 
}

let fadevCount = true;
function fadev(){
    displayAndBtn("fadev", "sub", "add", "mul", "inverse", "leverey", "qr", "lr", "yakob","fadevClick", "subClick", "addClick", "mulClick", "inverseClick", "levereyClick", "qrClick", "lrClick", "yakobClick");
    if (fadevCount) { 
        location.href = "index.html#fadevCount";
        let divs = document.createElement('div');
        divs.classList = "col s3 offset-s4";
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s4";
        let select1 = document.createElement('select');
        select1.id ="select_id1";
        select1.style.marginLeft = '100px';
        let option1 = [];
        for(let i = 2; i <= 100; i++){
            option1[i] = document.createElement('option');
            option1[i].setAttribute("value", i);
            option1[i].innerHTML = i;
        }        
        for(let i = 2; i <= 100; i++){
            select1.appendChild(option1[i]);
        }
        div1.appendChild(select1);
        divs.appendChild(div1);
        document.getElementById("fdimension").appendChild(divs);  
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "btn waves-effect waves-light";
        creatMatrix.addEventListener('click',getValue);
        creatMatrix.style.marginRight = '100px';
        let size = [];
        let table1 = document.createElement("table");
        let header1 = document.createElement('h4');
        let tr1 = [];
        function getValue(){
            header1.innerHTML = "A matrix";
            header1.classList = 'center-align';
            size = select1.value;
            size = parseInt(size);
            let A = newMatrix(size);
            let td1 = newMatrix(size);
            let input1 = newMatrix(size);
            let label1 = newMatrix(size);
            let div2 = newMatrix(size);
            for(let i = 0; i < size; i++){
                tr1[i] = document.createElement('tr');
                for(let j = 0; j < size; j++){
                    td1[i][j] = document.createElement('td');
                    div2[i][j] = document.createElement('div');
                    label1[i][j] = document.createElement('label');
                    let inputValue1 = "A["+(i+1)+"]["+(j+1)+"]";
                    div2[i][j].classList = "input-field";
                    input1[i][j] = document.createElement('input');
                    label1[i][j].id = inputValue1;
                    label1[i][j].innerHTML =  inputValue1;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue1); 
                    input1[i][j].setAttribute("name", inputValue1);  
                    A[i][j] = input1[i][j].value;
                    div2[i][j].appendChild(label1[i][j]);
                    div2[i][j].appendChild(input1[i][j]);
                    td1[i][j].appendChild(div2[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                }
                table1.appendChild(tr1[i]);
            }
            document.getElementById('fpart1').appendChild(header1);  
            document.getElementById('fpart1').appendChild(table1);
            let done = document.createElement('input');
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            done.addEventListener('click', calculate);
            let donem = document.createElement('input');
            donem.setAttribute('value', 'clear');
            donem.setAttribute('type','button');
            donem.classList = 'btn';
            function calculate(){
                let tabel2 = document.createElement('tabel');
                let tr2 = [];
                let td2 = newMatrix2(size,2)
                for(let i=0; i < size; i++){
                    for(let j = 0; j < size; j++){
                        A[i][j] = input1[i][j].value;
                        A[i][j] = parseFloat(A[i][j]);
                    }
                }
                let p = fadevCalculate(A,size);
                for(let i = 0; i < size; i++ ){
                    tr2[i] = document.createElement('tr');
                    for(let j =0; j < 2; j++){    
                        td2[i][j] = document.createElement('td');
                        if (j === 0) {
                            td2[i][j].innerHTML = "P["+(i+1)+"] = ";
                        }
                        else {
                            td2[i][j].innerHTML = p[i];
                        }
                        tr2[i].appendChild(td2[i][j]);
                    }
                    tabel2.appendChild(tr2[i]);
                }
                let header2 = document.createElement('h4');
                header2.innerHTML = 'P -?';
                header2.classList = 'center-align';
                document.getElementById('fpart2').appendChild(header2);
                document.getElementById('fpart11').appendChild(tabel2);
                donem.addEventListener('click', clear);
                function clear(){
                    for(let i = 0; i < size; i++){
                        table1.removeChild(tr1[i]);
                        tabel2.removeChild(tr2[i]);
                    }  
                    document.getElementById("fpart1").removeChild(done);
                    document.getElementById("fpart1").removeChild(header1);
                    document.getElementById("fpart2").removeChild(header2);
                    document.getElementById("fpart1").removeChild(table1);        
                    document.getElementById("fpart11").removeChild(tabel2);        
                    document.getElementById("fpart1").removeChild(donem);
                }     
            }   
            document.getElementById('fpart1').appendChild(done);
            document.getElementById("fpart1").appendChild(donem);             
        }
        document.getElementById('fdimension').appendChild(creatMatrix);
        fadevCount = false;
    } 
}


let qrCount = true;
function qr() {
    displayAndBtn("qr", "sub", "add", "mul", "inverse", "leverey", "fadev", "lr", "yakob","qrClick", "subClick", "addClick", "mulClick", "inverseClick", "levereyClick", "fadevClick", "lrClick", "yakobClick");
    if(qrCount) { 
        location.href = "index.html#qr"; 
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s2";
        let select = document.createElement('select');
        select.id ="select_id";
        let option = [];
        for(let i = 2; i <= 100; i++){
            option[i] = document.createElement('option');
            option[i].setAttribute("value", i);
            option[i].innerHTML = i;
        }
        div1.classList = "input-fluid col s3 offset-s4";     
        let input11 = document.createElement('input');
        input11.setAttribute('type','number');
        input11.setAttribute('min','0');
        let div12 = document.createElement('div');
        div12.appendChild(input11);
        div12.classList = "input-fluid col s3";
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "waves-effect waves-light btn";
        creatMatrix.style.marginTop = "20px";
        creatMatrix.addEventListener('click',getValue);
        function getValue(){
            let tr1 = [];
            let size = select.value;
            let tauNumber = parseFloat(input11.value);
            let table1 = document.createElement('table');
            let td1 = newMatrix(size);
            let input1 = newMatrix(size);
            let div2 = newMatrix(size);
            let label1 = newMatrix(size);
            let A = newMatrix(size);
            let A1 = newMatrix(size);
            let done = document.createElement('input');
            let div3 = document.createElement('div');
            let lammbda = [];
            let text = [];
            let header2 = document.createElement("h6");
            let header1 = document.createElement("h6");
            let table2 = document.createElement('table');
            let tr2 = [];
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            for(let i = 0; i < size; i++){
                tr1[i] = document.createElement('tr');
                for(let j = 0; j < size; j++){
                    td1[i][j] = document.createElement('td');
                    div2[i][j] = document.createElement('div');
                    if(size < 5 ){
                        div2[i][j].classList = "input-field col s5";
                    } else {
                        div2[i][j].classList = "input-field";
                    }
                    var inputValue = "A["+(i+1)+"]["+(j+1)+"]";
                    input1[i][j] = document.createElement('input');
                    label1[i][j] = document.createElement('label');
                    label1[i][j].id = inputValue;
                    label1[i][j].innerHTML =  inputValue;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue); 
                    input1[i][j].setAttribute("name", inputValue);   
                }   
            }
            done.addEventListener('click', done1);
            function done1() {    
                for(let i = 0; i < size; i++){
                    for(let j = 0; j < size; j++){
                     A[i][j] =  parseFloat(input1[i][j].value);
                    }
                }
                A1 = AM(A,size);
                let bool = condition(A1,size,tauNumber);            
                let iteraci = 0;
                let t = true;
                while(t){
                    for(let i  = 0; i < bool.length; i++){
                        if(bool[i] == false){
                            iteraci++;        
                            A1 = AM(A1,size);
                            bool = condition(A1,size,tauNumber);
                            t = true;     
                            break; 
                        } else {
                            t=false;
                        }
                    }  
                }
                table2.classList = "bordered";
                let td2 = newMatrix(size);
                for(let i = 0; i < size; i++){
                    tr2[i] = document.createElement('tr');
                    for(let j = 0; j < size; j++){
                        td2[i][j] = document.createElement('td');
                        let a =  "A["+(i+1)+"]["+(j+1)+"]";
                        td2[i][j].classList = "text-deep-purple";
                        td2[i][j].innerHTML = a + " = " + A1[i][j].toFixed(3);
                        tr2[i].appendChild(td2[i][j]);
                    }
                    table2.appendChild(tr2[i]);
                }    
                document.getElementById('qr').appendChild(table2);                 
                let l = lambda(A1,size);               
                header1.innerHTML = "The matrix's own numbers are :" + linebreak;
                for(let i = 0; i < size; i++){
                    lammbda[i] = document.createElement('img');
                    lammbda[i].setAttribute("src", "https://cdn.pixabay.com/photo/2013/03/30/00/09/lambda-97846_960_720.png");
                    lammbda[i].classList = "letters";
                    lammbda[i].style.marginTop = '0px';
                    text[i] = document.createElement('p');
                    text[i].innerHTML = "["+(i+1)+"] = " + l[i]+linebreak;
                    div3.appendChild(lammbda[i]);
                    div3.appendChild(text[i]);   
                }
               
                header2.innerHTML = "The number of Ithers: K = " + iteraci + linebreak;
                document.getElementById('qrpart1').appendChild(header2);  
                document.getElementById('qrpart1').appendChild(header1);  
                document.getElementById('qrpart1').appendChild(div3);               
            }        
            for(let i = 0; i < size; i++){
                for(let j = 0; j < size; j++){
                    div2[i][j].appendChild(input1[i][j]);
                    div2[i][j].appendChild(label1[i][j]);
                    td1[i][j].appendChild(div2[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                }
                table1.appendChild(tr1[i]);
            }
            document.getElementById("qrpart1").appendChild(table1); 
            let clearElement = document.createElement('input');
            clearElement.setAttribute("value","Clear matrix");
            clearElement.setAttribute("type", "submit");
            clearElement.classList = "waves-effect waves-light btn";
            clearElement.addEventListener('click', clearValue);
            document.getElementById("qrpart1").appendChild(done);
            function clearValue() {
                for(let i = 0; i < size; i++){
                    table1.removeChild(tr1[i]);
                    div3.removeChild(lammbda[i]);
                    div3.removeChild(text[i]);
                    table2.removeChild(tr2[i]);
                }
                document.getElementById('qrpart1').removeChild(header2);  
                document.getElementById('qrpart1').removeChild(header1);  
                document.getElementById('qrpart1').removeChild(div3);        
                document.getElementById("qrpart1").removeChild(done);
                document.getElementById("qrpart1").removeChild(table1);   
                document.getElementById("qrpart1").removeChild(clearElement);    
            }
            document.getElementById("qrpart1").appendChild(clearElement);
        }     
        for(let i = 2; i <= 100; i++){
            select.appendChild(option[i]);
        }            
        div1.appendChild(select);
        document.getElementById("qrdimension2").appendChild(div12);               
        document.getElementById("qrdimension1").appendChild(div1);               
        document.getElementById("qrdimension3").appendChild(creatMatrix);    
        qrCount = false;
    } 
}

let lrCount = true;
function lr() {
    displayAndBtn("lr", "sub", "add", "mul", "inverse", "leverey", "fadev", "qr", "yakob","lrClick", "subClick", "addClick", "mulClick", "inverseClick", "levereyClick", "fadevClick", "qrClick", "yakobClick");
    if(lrCount) { 
        location.href = "index.html#lr";
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s2";
        let select = document.createElement('select');
        select.id ="select_id";
        let option = [];
        for(let i = 2; i <= 100; i++){
            option[i] = document.createElement('option');
            option[i].setAttribute("value", i);
            option[i].innerHTML = i;
        }
        div1.classList = "input-fluid col s3 offset-s4";     
        let input11 = document.createElement('input');
        input11.setAttribute('type','number');
        input11.setAttribute('min','0');
        let div12 = document.createElement('div');
        div12.appendChild(input11);
        div12.classList = "input-fluid col s3";
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "waves-effect waves-light btn";
        creatMatrix.style.marginTop = "20px";
        creatMatrix.addEventListener('click',getValue);
        function getValue(){
            let tr1 = [];
            let size = select.value;
            let tauNumber = parseFloat(input11.value);
            let table1 = document.createElement('table');
            let td1 = newMatrix(size);
            let input1 = newMatrix(size);
            let div2 = newMatrix(size);
            let label1 = newMatrix(size);
            let A = newMatrix(size);
            let A1 = newMatrix(size);
            let done = document.createElement('input');
            let div3 = document.createElement('div');
            let lammbda = [];
            let text = [];
            let header2 = document.createElement("h6");
            let header1 = document.createElement("h6");
            let table2 = document.createElement('table');
            let tr2 = [];
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            for(let i = 0; i < size; i++){
                tr1[i] = document.createElement('tr');
                for(let j = 0; j < size; j++){
                    td1[i][j] = document.createElement('td');
                    div2[i][j] = document.createElement('div');
                    if(size < 5 ){
                        div2[i][j].classList = "input-field col s5";
                    } else {
                        div2[i][j].classList = "input-field";
                    }
                    var inputValue = "A["+(i+1)+"]["+(j+1)+"]";
                    input1[i][j] = document.createElement('input');
                    label1[i][j] = document.createElement('label');
                    label1[i][j].id = inputValue;
                    label1[i][j].innerHTML =  inputValue;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue); 
                    input1[i][j].setAttribute("name", inputValue);   
                }   
            }
            done.addEventListener('click', done1);
            function done1() {  
                for(let i = 0; i < size; i++){
                    for(let j = 0; j < size; j++){
                     A[i][j] =  parseFloat(input1[i][j].value);
                    }
                }
                A1 = am(A,size);
                let bool = condition(A1,size,tauNumber);            
                let iteraci = 0;
                let t = true;
                while(t){
                    for(let i  = 0; i < bool.length; i++){
                        if(bool[i] == false){
                            iteraci++;        
                            A1 = am(A1,size);
                            bool = condition(A1,size,tauNumber);
                            t = true;     
                            break; 
                        } else {
                            t=false;
                        }
                    }  
                }
                table2.classList = "bordered";
                let td2 = newMatrix(size);               
                for(let i = 0; i < size; i++){
                    tr2[i] = document.createElement('tr');
                    for(let j = 0; j < size; j++){
                        td2[i][j] = document.createElement('td');
                        let a =  "A["+(i+1)+"]["+(j+1)+"]";
                        td2[i][j].classList = "text-deep-purple";
                        td2[i][j].innerHTML = a + " = " + A1[i][j].toFixed(3);
                        tr2[i].appendChild(td2[i][j]);
                    }
                    table2.appendChild(tr2[i]);
                }    
                document.getElementById('lr').appendChild(table2);                               
                let l = lambda(A1,size);              
                header1.innerHTML = "The matrix's own numbers are :" + linebreak;
                for(let i = 0; i < size; i++){
                    lammbda[i] = document.createElement('img');
                    lammbda[i].setAttribute("src", "https://cdn.pixabay.com/photo/2013/03/30/00/09/lambda-97846_960_720.png");
                    lammbda[i].classList = "letters";
                    lammbda[i].style.marginTop = '0px';
                    text[i] = document.createElement('p');
                    text[i].innerHTML = "["+(i+1)+"] = " + l[i]+linebreak;
                    div3.appendChild(lammbda[i]);
                    div3.appendChild(text[i]);   
                }               
                header2.innerHTML = "The number of Ithers: K = " + iteraci + linebreak;
                document.getElementById('lrpart1').appendChild(header2);  
                document.getElementById('lrpart1').appendChild(header1);  
                document.getElementById('lrpart1').appendChild(div3);               
            }        
            for(let i = 0; i < size; i++){
                for(let j = 0; j < size; j++){
                    div2[i][j].appendChild(input1[i][j]);
                    div2[i][j].appendChild(label1[i][j]);
                    td1[i][j].appendChild(div2[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                }
                table1.appendChild(tr1[i]);
            }
            document.getElementById("lrpart1").appendChild(table1); 
            let clearElement = document.createElement('input');
            clearElement.setAttribute("value","Clear matrix");
            clearElement.setAttribute("type", "submit");
            clearElement.classList = "waves-effect waves-light btn";
            clearElement.addEventListener('click', clearValue);
            document.getElementById("lrpart1").appendChild(done);
            function clearValue() {
                for(let i = 0; i < size; i++){
                    table1.removeChild(tr1[i]);
                    div3.removeChild(lammbda[i]);
                    div3.removeChild(text[i]);
                    table2.removeChild(tr2[i]);
                }
                document.getElementById('lrpart1').removeChild(header2);  
                document.getElementById('lrpart1').removeChild(header1);  
                document.getElementById('lrpart1').removeChild(div3);        
                document.getElementById("lrpart1").removeChild(done);
                document.getElementById("lrpart1").removeChild(table1);   
                document.getElementById("lrpart1").removeChild(clearElement);    
            }
            document.getElementById("lrpart1").appendChild(clearElement);
        }
        for(let i = 2; i <= 100; i++){
            select.appendChild(option[i]);
        }            
        div1.appendChild(select);
        document.getElementById("lrdimension2").appendChild(div12);               
        document.getElementById("lrdimension1").appendChild(div1);               
        document.getElementById("lrdimension3").appendChild(creatMatrix);    
        lrCount = false;
    } 
    
}

let yakobCount = true;
function yakob() {
    displayAndBtn("yakob", "sub", "add", "mul", "inverse", "leverey", "fadev", "lr", "qr","yakobClick", "subClick", "addClick", "mulClick", "inverseClick", "levereyClick", "fadevClick", "lrClick", "qrClick");
    if(yakobCount) { 
        window.location.pathname = ' https://annamelkonyan21.github.io/diplomayin/yakop';
        //location.href = "index.html#yakob";
        let div1 = document.createElement('div');
        div1.classList = "input-fluid col s2";
        let select = document.createElement('select');
        select.id ="select_id";
        let option = [];
        for(let i = 2; i <= 100; i++){
            option[i] = document.createElement('option');
            option[i].setAttribute("value", i);
            option[i].innerHTML = i;
        }
        div1.classList = "input-fluid col s4 offset-s4";     
        let input11 = document.createElement('input');
        input11.setAttribute('type','number');
        input11.style.backgroundColor = 'white';
        let div12 = document.createElement('div');
        div12.appendChild(input11);
        div12.classList = "input-fluid col s4";
        let creatMatrix = document.createElement('input');
        creatMatrix.setAttribute("value","Set Matrix");
        creatMatrix.setAttribute("type", "submit");
        creatMatrix.classList = "waves-effect waves-light btn";
        creatMatrix.addEventListener('click',getValue);
        function getValue(){
            let tr1 = [];
            let size = select.value;
            let tauNumber = parseFloat(input11.value);
            let table1 = document.createElement('table');
            let td1 = newMatrix(size);
            let input1 = newMatrix(size);
            let div2 = newMatrix(size);
            let label1 = newMatrix(size);
            let A = newMatrix(size);
            let A1 = newMatrix(size);
            let done = document.createElement('input');
            let div3 = document.createElement('div');
            let lammbda = [];
            let text = [];
            let header2 = document.createElement("h6");
            let header1 = document.createElement("h6");
            let table2 = document.createElement('table');
            let tr2 = [];
            done.setAttribute('value', 'calculate');
            done.setAttribute('type','button');
            done.classList = 'btn';
            for(let i = 0; i < size; i++){
                tr1[i] = document.createElement('tr');
                for(let j = 0; j < size; j++){
                    td1[i][j] = document.createElement('td');
                    div2[i][j] = document.createElement('div');
                    if(size < 5 ){
                        div2[i][j].classList = "input-field col s5";
                    } else {
                        div2[i][j].classList = "input-field";
                    }
                    var inputValue = "A["+(i+1)+"]["+(j+1)+"]";
                    input1[i][j] = document.createElement('input');
                    label1[i][j] = document.createElement('label');
                    label1[i][j].id = inputValue;
                    label1[i][j].innerHTML =  inputValue;
                    input1[i][j].setAttribute('type', 'number');
                    input1[i][j].setAttribute("id", inputValue); 
                    input1[i][j].setAttribute("name", inputValue);   
                }   
            }
            done.addEventListener('click', done1);
            function done1() {     
                for(let i = 0; i < size; i++){
                    for(let j = 0; j < size; j++){
                     A[i][j] =  parseFloat(input1[i][j].value);
                    }
                }
                A1 = yakobAm(A,size);
                let iteraci = 1;            
                let t = true;
                let aa = newMatrix(size);
                while(t) {
                    let AM = yakobAm(A, size);
                    for(let i = 0 ; i < size; i++) {
                        for(let j = 0 ; j < size; j++){
                            if(i < j || i > j) {
                                AM[i][j] < 0;
                                iteraci++;
                                t = true;    
                            } else {
                                aa[i][j] = AM[i][j];
                                t = false;
                            }
                            
                        }
                    }
                    
                }
                let td2 = newMatrix(size);
                
                for(let i = 0; i < size; i++){
                    tr2[i] = document.createElement('tr');
                    for(let j = 0; j < size; j++){
                        td2[i][j] = document.createElement('td');
                        let a =  "A["+(i+1)+"]["+(j+1)+"]";
                        td2[i][j].classList = "text-deep-purple";
                        td2[i][j].innerHTML = a + " = " + aa[i][j].toFixed(3);
                        tr2[i].appendChild(td2[i][j]);
                    }
                    table2.appendChild(tr2[i]);
                }    
                document.getElementById('ypart2').appendChild(table2);  
                
                
                let l = lambda(A1,size);
               
                header1.innerHTML = "The matrix's own numbers are :" + linebreak;
                for(let i = 0; i < size; i++){
                    lammbda[i] = document.createElement('img');
                    lammbda[i].setAttribute("src", "https://cdn.pixabay.com/photo/2013/03/30/00/09/lambda-97846_960_720.png");
                    lammbda[i].classList = "letters";
                    lammbda[i].style.marginTop = '0px';
                    text[i] = document.createElement('p');
                    text[i].innerHTML = "["+(i+1)+"] = " + l[i]+linebreak;
                    div3.appendChild(lammbda[i]);
                    div3.appendChild(text[i]);   
                }
               
                header2.innerHTML = "The number of Ithers: K = " + iteraci + linebreak;
                document.getElementById('ypart11').appendChild(header2);  
                document.getElementById('ypart11').appendChild(header1);  
                document.getElementById('ypart11').appendChild(div3);               
            }        
            for(let i = 0; i < size; i++){
                for(let j = 0; j < size; j++){
                    div2[i][j].appendChild(input1[i][j]);
                    div2[i][j].appendChild(label1[i][j]);
                    td1[i][j].appendChild(div2[i][j]);
                    tr1[i].appendChild(td1[i][j]);
                }
                table1.appendChild(tr1[i]);
            }
            document.getElementById("ypart11").appendChild(table1); 
            let clearElement = document.createElement('input');
            clearElement.setAttribute("value","Clear matrix");
            clearElement.setAttribute("type", "submit");
            clearElement.classList = "waves-effect waves-light btn";
            clearElement.addEventListener('click', clearValue);
            document.getElementById("ypart11").appendChild(done);
            function clearValue() {
                for(let i = 0; i < size; i++){
                    table1.removeChild(tr1[i]);
                    div3.removeChild(lammbda[i]);
                    div3.removeChild(text[i]);
                    table2.removeChild(tr2[i]);
                }
                document.getElementById('ypart1').removeChild(header2);  
                document.getElementById('ypart1').removeChild(header1);  
                document.getElementById('ypart1').removeChild(div3);        
                document.getElementById("ypart1").removeChild(done);
                document.getElementById("ypart1 1").removeChild(table1);   
                document.getElementById("ypart1").removeChild(clearElement);    
            }
            document.getElementById("ypart11").appendChild(clearElement);
        }
     
        for(let i = 2; i <= 100; i++){
            select.appendChild(option[i]);
        }            
        div1.appendChild(select);
        document.getElementById("ydimension2").appendChild(div12);               
        document.getElementById("ydimension1").appendChild(div1);               
        document.getElementById("ydimension3").appendChild(creatMatrix);    
        yakobCount = false;
    } 
}   