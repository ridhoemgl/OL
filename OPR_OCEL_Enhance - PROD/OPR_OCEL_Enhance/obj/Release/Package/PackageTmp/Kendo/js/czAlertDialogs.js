var czDLGResult = "Cancel";
var czDLGWindow;
var czDLGCallBack;

var czDLGmResult = "Cancel";
var czDLGmWindow;
var czDLGmCallBack;


function czDLGClose(BtnResult){
	czDLGResult = BtnResult;
	czDLGWindow.close();
};	

function czDLGmClose(BtnResult){
	czDLGmResult = BtnResult;
	czDLGmWindow.close();
};

function czDLGCloseCallBack(e){
	czDLGWindow.unbind("close", czDLGCloseCallBack);
	if (czDLGCallBack !== null){
		czDLGCallBack(czDLGResult);
	}
}

function czDLGmCloseCallBack(e){
	czDLGmWindow.unbind("close", czDLGmCloseCallBack);
	if (czDLGmCallBack !== null){
		czDLGmCallBack(czDLGmResult);
	}
}

function czDLG(Title,Message,Type,Buttons,theFunction){
	var DLGData = '<table cellpadding="0" cellspacing="0"><tr><td><div class="czDLGIcon ' + Type + '"></div></td>'+
		'<td><div class="czDLGText">'+Message+'</div></td></tr></table><div>';
		for(var i in Buttons){
  			var s = Buttons[i];
  			DLGData += '<input class="czDLGBtn" type="button" onclick="czDLGClose(\''+s+'\')" value="'+s+'">';
		}
	DLGData += '</div>';
	czDLGResult = "Cancel";
	if (theFunction !== undefined){
		czDLGCallBack = theFunction;
	} else {
		czDLGCallBack = null;
	}
	czDLGWindow.bind("close", czDLGCloseCallBack);
	czDLGWindow.title(Title);
    czDLGWindow.center();
    czDLGWindow.content(DLGData);
    czDLGWindow.open();
}


function czDLGm(Title,Message,Type,Buttons,theFunction){
	var DLGData = '<table cellpadding="0" cellspacing="0"><tr><td><div class="czDLGIcon ' + Type + '"></div></td>'+
		'<td><div class="czDLGText">'+Message+'</div></td></tr></table><div>';
		for(var i in Buttons){
  			var s = Buttons[i];
  			DLGData += '<input class="czDLGBtn" type="button" onclick="czDLGmClose(\''+s+'\')" value="'+s+'">';
		}
	DLGData += '</div>';
	czDLGmResult = "Cancel";
	if (theFunction !== undefined){
		czDLGmCallBack = theFunction;
	} else {
		czDLGmCallBack = null;
	}
	czDLGmWindow.bind("close", czDLGmCloseCallBack);
	czDLGmWindow.title(Title);
    czDLGmWindow.center();
    czDLGmWindow.content(DLGData);
    czDLGmWindow.open();
}


$(document).ready(function() {	
	
	czDLGmWindow = $("#czDLGMWindow").kendoWindow({
        actions: ["Close"],
    	draggable: true,
    	modal: true,
    	resizable: false,
    	visible: false,
    	title: "",
    }).data("kendoWindow");	

	czDLGWindow = $("#czDLGWindow").kendoWindow({
        actions: ["Close"],
    	draggable: true,
    	modal: false,
    	resizable: false,
    	visible: false,
    	title: "",
    }).data("kendoWindow");	    
    
}); 