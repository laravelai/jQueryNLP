
// Collect all jQuery objects
var transObjects = $("[id^='trans']");

var text_array=new Array(transObjects.length);

var i=0;
var start_no=0;
var srcText="";
var temp_array=[];
var processed=false;
var time_span=0;    //sum of time used in previous ajax request

while(i<transObjects.length)
{
    text_array[i]=new Array();
    getNodeText(transObjects[i],text_array[i]);
    text_array[i]=text_array[i].join("\n");


    if((i>0 || start_no>0) && (temp_array.join('\n\n\n')+text_array[i]).length>max_length ){
        let transData={
            'source'     : source_lang,
            'target'     : target_lang,
            'text'       : temp_array.join('\n\n\n'),
            'engine'     : engine
        }

        setTimeout(updateTransObj,time_span+safe_interval,transData,start_no);
        time_span = time_span + safe_interval;
        start_no=i;
        temp_array=[];
        processed=true;
    }
    else{
        temp_array.push(text_array[i]);
        processed=false;
        i++;
    }

    
}
if(!processed){
    transData={
        'source'     : source_lang,
        'target'     : target_lang,
        'text'       : temp_array.join('\n\n\n'),
        'engine'     : engine
    }
    setTimeout(updateTransObj,time_span+safe_interval,transData,start_no);
}


//Use Ajax to get translated text via Tencent AI Platform
function updateTransObj(transData,start_no){
    if(transData.text.length>1){
        var getTrans=$.ajax({
            type: 'POST',
            url: '/api/nlp',
            data: transData,
            success: function(data){
                //error handling, do nothing
                if(data.ret!==0 || data.target_text===""){
                    console.log(data.msg)
                    return;  //do nothing;
                } 
                
                //split into contents for div
                let responseText=data.target_text
                text_array=responseText.split('\n\n\n');

                //Processing each div
                for(let i=0;i<text_array.length;i++){
                    //split translated text into different jQuery childNodes
                    text_array[i]=text_array[i].split('\n');
                    updateNodeText(transObjects[i+start_no],text_array[i]);
                }
            },
            dataType: 'json',
        });
    }
}



//Covert all jQuery childNodes' text to array
function getNodeText(TransObj,text_array){
    for(let i=0;i<TransObj.childNodes.length;i++)
    {
        if(TransObj.childNodes[i].childNodes.length>0){
            getNodeText(TransObj.childNodes[i],text_array);
        }
        else{
            if(TransObj.childNodes[i].nodeName==="#text"){
                let parsedText=delExtraSpaces(delExtraTabs(delNewlines(TransObj.childNodes[i].data))).trim();
                if(parsedText!==""){
                    text_array.push(delNewlines(parsedText));
                } 
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
                let parsedText=delExtraSpaces(delExtraTabs(delNewlines(TransObj.childNodes[i].data))).trim();
                let sentenseEnd=['.','。','?','!'];
                if(parsedText!==""){
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

//Remove extra white tab
function delExtraTabs(nodeText){
   nodeText=nodeText.replace(/\t/g,'');
   nodeText=nodeText.replace(/&nbsp;/g,'');
   return nodeText;
}
