var transObjects = $("[id^='trans']");
var text_array=new Array(transObjects.length);
for(let i=0;i<transObjects.length;i++){
    text_array[i]=new Array();
    //Clean each jQuery childNode's HTML data and collect the text into an array
    getNodeText(transObjects[i],text_array[i]);
    text_array[i]=text_array[i].join("\n");
}
// Join text from different divs into one string
var srcText = text_array.join('\n\n');

var transData={
    'source'     : source_lang,
    'target'     : target_lang,
    'text'       : srcText,
}

//Use Ajax to get translated text via Tencent AI Platform
var getTrans=$.ajax({
    type: 'POST',
    url: '/api/nlp',
    data: transData,
    success: function(data){

        //split into contents for div
        let responseText=data.data.target_text
        text_array=responseText.split('\n\n')

        //Processing each div
        for(let i=0;i<transObjects.length;i++){
            //split translated text into different jQuery childNodes
            text_array[i]=text_array[i].split('\n');
            updateNodeText(transObjects[i],text_array[i]);
        }
    },
    dataType: 'json',
});

//Covert all jQuery childNodes' text to array
function getNodeText(TransObj,text_array){
    for(let i=0;i<TransObj.childNodes.length;i++)
    {
        if(TransObj.childNodes[i].childNodes.length>0){
            getNodeText(TransObj.childNodes[i],text_array);
        }
        else{
            if(TransObj.childNodes[i].nodeName==="#text"){
                let parsedText=delExtraSpaces(delNewlines(TransObj.childNodes[i].data))
                if(parsedText!==""  && parsedText!==" ") text_array.push(parsedText);
            } 
        }
    }
}

//Update jQuery childNodes with translated text
function updateNodeText(TransObj,text_array){
    for(let i=0;i<TransObj.childNodes.length;i++)
    {
        if(TransObj.childNodes[i].childNodes.length>0){
            updateNodeText(TransObj.childNodes[i],text_array);
        }
        else{
            if(TransObj.childNodes[i].nodeName==="#text"){
                let parsedText=delExtraSpaces(delNewlines(TransObj.childNodes[i].data)).trim();
                let sentenseEnd=['.','。','?','!'];
                if(parsedText!=="" && parsedText!==" "){
                    if(text_array[0]!==undefined){
                        //check the last character of string, remove the . introduced by new line
                        if(!sentenseEnd.includes(parsedText.charAt(parsedText.length-1)) && 
                            sentenseEnd.includes(text_array[0].charAt(text_array[0].length-1)) ){
                            text_array[0]=" "+text_array[0].substring(0,text_array[0].length-2)+parsedText.charAt(parsedText.length-1)+" ";
                        }
                        TransObj.childNodes[i].data=" "+text_array[0];
                    } 
                    text_array.shift();
                } 
            } 
        }
    }
}

//Remove all new line breaks
function delNewlines(nodeText){
    if(nodeText.includes('\n')){
        return delNewlines(nodeText.replace('\n',''));
    }
    return nodeText;
}

//Remove extra white spaces
function delExtraSpaces(nodeText){
    if(nodeText.includes('  ')){
        return delExtraSpaces(nodeText.replace('  ',' '));
    }
    return nodeText;
}