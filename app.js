var keyboard = [];
    var keyboardStatus = document.getElementById("keyboardStatus");
    var hasil = document.getElementById("hasil-output");
    var nomor = document.getElementById("nomor");
    var arrtxt = null;
    reset();

    function reset (){
        keyboard.length = 0;
        var row1 = ['1','2','3','4','5','6','7','8','9','0','-','='];
        var row2 = ['q','w','e','r','t','y','u','i','o','p','[',']'];
        var row3 = ['a','s','d','f','g','h','j','k','l',';',"'"];
        var row4 = ['z','x','c','v','b','n','m',",",".","/"];
        keyboard.push(row1,row2,row3,row4);
        keyboardStatus.innerHTML = "Normal";
        document.getElementById('nomor').value = "";
        document.getElementById('tbMain').value = "";
        printKey();
    }

    document.getElementById('btnGeser').onclick = function(){
        let text = document.getElementById('nomor').value; 
        geser(text);
    }

    document.getElementById('tbMain').oninput = function(){
        var text = document.getElementById('tbMain').value; 
        command(text.split(','));
    }

    function command(task){
        console.log("task", task);
        task.forEach(function (t){
            if(isNaN(t)){
                console.log("not number");
                if(t === "H" || t === "h"){
                    balikHorizontal();
                }else if(t === "V" || t === "v"){
                    balikVertical();
                }
            }else{
                geser(t);
                console.log("is number");
            }
            
        });
    }

    document.getElementById('btnOpen').onclick = function(){
        var text = "";
        openFile(function(txt){
            document.getElementById('tbMain').value = txt; 
            text = txt;
            command(text.split(','));

            var keyboardStr = "";
            for(a = 0; a < keyboard.length; a++){
                for (let i = 0; i < keyboard[a].length; i++) {
                    keyboardStr += keyboard[a][i];
                }
                keyboardStr += "\n";
            }

            // Start file download.
            download("keyPrint.txt",keyboardStr);
        });

        
    }

    function openFile(callBack){
        var element = document.createElement('input');
        element.setAttribute('type', "file");
        element.setAttribute('id', "btnOpenFile");
        element.onchange = function(){
            readText(this,callBack);
            document.body.removeChild(this);
            }
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
    }

    function readText(filePath,callBack) {
        var reader;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            reader = new FileReader();
        } else {
            alert('The File APIs are not fully supported by your browser. Fallback required.');
            return false;
        }
        var output = ""; //placeholder for text output
        if(filePath.files && filePath.files[0]) {           
            reader.onload = function (e) {
                output = e.target.result;
                callBack(output);
            };//end onload()
            reader.readAsText(filePath.files[0]);
        }//end if html5 filelist support
        else { //this is where you could fallback to Java Applet, Flash or similar
            return false;
        }       
        return true;
    }

    function printKey(){
        var row = "<p> ";
        for(a = 0; a < keyboard.length; a++){
            for(i = 0; i < keyboard[a].length; i++){
                row += keyboard[a][i] + " ";
            }
            row += "<br />";
        }
        row += "</p>";
        console.log("keyboard print", keyboard);
        hasil.innerHTML = row;
    }

    function balikHorizontal(){
        var keyboardNew = [];
        var newRow = []
        
        for(a = 0; a < keyboard.length; a++){
            for(i = keyboard[a].length-1; i > -1  ; i--){
                newRow.push(keyboard[a][i])
            }
            keyboardNew.push(newRow);
            newRow = [];
        }

        keyboard.length = 0;
        keyboard = keyboardNew;
        keyboardStatus.innerHTML = "Dibalik Horizontal";
        printKey();
    }

    function balikVertical(){
        var keyboardNew = [];
        
        for(i = keyboard.length-1; i > -1  ; i--){
            keyboardNew.push(keyboard[i]);
        }

        keyboard.length = 0;
        keyboard = keyboardNew;
        keyboardStatus.innerHTML = "Dibalik Vertical";
        printKey();
    }

    function geser(number){
        let iN = null;
        var arrLength = [];
        var newArr = [];
        var keyboardStr = "";
        var newKeyArr = null;

        //mencari index n
        for(a = 0; a < keyboard.length; a++){
            for (let i = 0; i < keyboard[a].length; i++) {
                newArr.push(keyboard[a][i]);
                keyboardStr += keyboard[a][i];
            }
            arrLength.push(keyboard[a].length);
        }

        iN = newArr.indexOf("n");
        let num = parseInt(iN)+parseInt(number);

        if(number < 0){
            //jika nilai minus
            if(num > 0){
                var pickNumber = keyboardStr.substring(num+1,iN+1);
                var beforePick = keyboardStr.substring(0,num);
                var afterPick = keyboardStr.substring(num, num+1);
                afterPick += keyboardStr.substring(iN+1);
                var newestKey = beforePick + pickNumber + afterPick;
                newKeyArr = newestKey.split("");
            }else if(num < 0){
                let over = num+1;
                console.log("over", over);
                var pickNumber = keyboardStr.substring(keyboardStr.length+over);
                pickNumber += keyboardStr.substring(0,iN+1);
                var beforePick = keyboardStr.substring(keyboardStr.length+over-1, keyboardStr.length+over);
                beforePick += keyboardStr.substring(iN+1,keyboardStr.length+over-1);
                var newestKey = beforePick + pickNumber ;
                newKeyArr = newestKey.split("");
            }
        }else if(number > 0){
            //jika number plus
            if(num < keyboardStr.length){
                var pickNumber = keyboardStr.substring(iN, num);
                var beforePick = keyboardStr.substring(0,iN);
                beforePick += keyboardStr.substring(num, num+1);
                var afterPick = keyboardStr.substring(num+1);
                var newestKey = beforePick + pickNumber + afterPick;
                newKeyArr = newestKey.split("");
            }else if(num > keyboardStr.length){
                let over = num - keyboardStr.length;
                var pickNumber = keyboardStr.substring(iN);
                pickNumber += keyboardStr.substring(0, over);
                var beforePick = keyboardStr.substring(over, over+1);
                var afterPick = keyboardStr.substring(over+1,iN);
                var newestKey = beforePick + pickNumber + afterPick;
                newKeyArr = newestKey.split("");
            }
        }

        let arrIn = 0;
        var newKeyboard = [];
        for (let i = 0; i < arrLength.length; i++) {
            var itemArr = [];
            for (let a = 0; a < arrLength[i]; a++) {
                itemArr.push(newKeyArr[arrIn]);
                arrIn++;
            }
            newKeyboard.push(itemArr);
        }

        keyboard = newKeyboard;
        printKey();
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
    }
      