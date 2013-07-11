/*!
*    objectise VERSION 1.01    April 7, 2010.
*    
*    objectise is a utility that enables the mapping of XML structures to defined JavaScript objects
*    developed by Kevin Ready (kevin@planetkevin.com) and available for free worldwide distribution and usage.
*
*    PARAMS:
*    @dataToMap    XML or XML document, or JSON or JSON document
*    @objToMap    The object that will have the XML content mapped to it
*    @scopeObj
*    @isRoot        Determines if the objToMap is the root object
*
*    objectise recursively examines the contents of XML or JSON and looks for named objects in
*    the scope of first, scopeObj, or the current window to associate the source data.
*    
*    If there is no named object, it will default to instantiating a generic Object and add it to an
*    array of objToMap named 'children'.
*
*    If it finds a named object, it instantiates the object and adds it to an array of objToMap whose name is formed 
*    by making a plural of the object name (i.e., a car object would have a cars array). The object will also be 
*    added to the objToMap children array.
*
*    All attributes of XML elements are mapped to properties of objToMap.
*    
*    Text content of nodes will be mapped to textValue of objToMap. There are two ways to include text: plain text
*    does not need CDATA wrapping. For rich text, use "<!--[CDATA[RICH_TEXT_HERE]]-->".
*
*    Example:
*    XML (vehicles.xml):
*    <vehicles>
*        <car make="Ford">
*            <passenger name="Joe" />
*            <passenger name="Betty" />
*            <details><!--[CDATA[<strong>RETURN</strong> by tomorrow.]]--></details>
*        </car>
*    </vehicles>
*
*    JavaScript:
*    function car(){
*        this.maxSpeed=90;
*        this.passengers=new Array();
*    }
*    
*    var rootURL="vehicles.xml";
*    var rootObject={};
*    
*    function startUp(){
*         $.ajax({
*            type: "GET",
*            url: rootURL,
*            dataType: "xml",
*            success: function(xml) {
*                $(this).objectise(xml, rootObject, true);
*            }
*        });
*    }
*    
*    In the example, when the startUp function is called, it performs an ajax request and maps the XML
*    from the returned data to rootObject. The true parameter must be included.
*    
*    Once the data is mapped, the following are sample returns of traversing the object model.
*    Named arrays can be addressed by their object-based name or by the children array.
*    
*    rootObject.cars[0].maxSpeed    =                90;
*    rootObject.children[0].make    =                "Ford";
*    rootObject.cars[0].children[0].name    =        "Joe";
*    rootObject.cars[0].children[2].textValue =      "<strong>RETURN</strong> by tomorrow.";
*
*    The future of this JQuery extension should be twofold: to accommodate JSON as dataToMap; and 
*    to add functions to new and existing objects. Those are beyond the scope of this initial version.
*    
*    Copyright 2010 --- No rights reserved
*/
jQuery.fn.objectise=jQuery.fn.objectize=function(dataToMap, objToMap, scopeObj, type, isRoot, objectName){
	if((type==undefined) || (type=="xml")){
	//    If the dataToMap element is a string, it creates XML from the string.
		type="xml";
		if(typeof(dataToMap)=="string"){
			if (window.DOMParser){
				var xmlobject = (new DOMParser()).parseFromString(dataToMap, "text/xml");
			}else{
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
				xmlDoc.loadXML(dataToMap);
				var xmlobject=xmlDoc.documentElement;
			}
			$(this).objectise(xmlobject, objToMap,  scopeObj, type, isRoot);
		}else{
			//    If the dataToMap element is a Document, it passes its first child as the top level object.
			if(dataToMap.nodeType==9){
				$(this).objectise(dataToMap.childNodes[dataToMap.childNodes.length-1], objToMap,  scopeObj, type, isRoot);
			}else{
				if(objToMap.root==undefined){
					objToMap.root=objToMap;
				}
				if(scopeObj==undefined){
					scopeObj=window;
				}
				for(var myNodes=0;myNodes<dataToMap.childNodes.length;myNodes++){
					if(
						(dataToMap.childNodes[myNodes].nodeName.toLowerCase() != "xml") && 
						(dataToMap.childNodes[myNodes].nodeName.toLowerCase() != "xml:stylesheet") && 
						(dataToMap.childNodes[myNodes].nodeName.toLowerCase() != "#text")
					){
					//	If the XML element is the top level object, it defines its properties from the attributes.
						if(isRoot != true){
							var str="obj props=\n";
							try{
								for(var myAttributes=0;myAttributes<dataToMap.attributes.length;myAttributes++){
									objToMap[dataToMap.attributes[myAttributes].name]=unescape(dataToMap.attributes[myAttributes].value);
								}
							}catch(oops){}
						}
						//		The window is searched to see if the element is available as a JavaScript object
						//		Do not use any names that might be reserved for the Window object. Also, the XML
						//		elements should not be equivalent to DOM elements (i.e., IMG or FORM), as 
						//		unexpected results may occur.
						//		Each element is added to an array formed by adding an "s" to the end of the element
						//		name, as well as to an array named "children". 
						//		For object mapping to occur, if a named JavaScript object is found, an instance of 
						//		it is added to the array; if not, a generic Object is added.
						var arrayName=dataToMap.childNodes[myNodes].nodeName + "s";
						if(typeof(objToMap.children)=="undefined"){
							objToMap.children=new Array();
						}
						if(typeof(objToMap[arrayName])=="undefined"){
							objToMap[arrayName]=new Array();
						}
						subArrayName=objToMap[arrayName];
						if(typeof(scopeObj[dataToMap.childNodes[myNodes].nodeName]) == "undefined"){
							if(typeof(window[dataToMap.childNodes[myNodes].nodeName]) == "undefined"){
								arrayedElement = new Object();
							}else{
								arrayedElement = new window[dataToMap.childNodes[myNodes].nodeName]()
							}
						}else{
							arrayedElement = new scopeObj[dataToMap.childNodes[myNodes].nodeName]()
						}
						// bind child to parent
						arrayedElement.parent=objToMap;
						arrayedElement.root=objToMap.root;

						//    All children have their attributes defined as the parent element iterates through its childnodes.
						try{
							for(var myAttributes=0;myAttributes<dataToMap.childNodes[myNodes].attributes.length;myAttributes++){
								arrayedElement[dataToMap.childNodes[myNodes].attributes[myAttributes].name]=
									unescape(dataToMap.childNodes[myNodes].attributes[myAttributes].value);
							}
						}
						catch(oops){}
						subArrayName[subArrayName.length]=objToMap.children[objToMap.children.length]=arrayedElement;
						//    Rich Text is caught by testing comments and removing the '[CDATA[' and ']]' characters around the text.
						if(dataToMap.childNodes[myNodes].nodeType==8){
							var cOpen="[CDATA[";
							var cClose="]]";              
							if(dataToMap.childNodes[myNodes].nodeValue.indexOf(cOpen)==0){
								var textValue=dataToMap.childNodes[myNodes].nodeValue.substring(cOpen.length,(dataToMap.childNodes[myNodes].nodeValue.length-cClose.length));
								objToMap.textValue=textValue;
							}
						}
		//				alert(arrayedElement + "-AE:T=" + type);
						$(this).objectise(dataToMap.childNodes[myNodes], arrayedElement, scopeObj, type, true);
					}else{
						//    Plain Text is caught by ignoring white space and selecting the nodeValue of text elements.
						if(dataToMap.childNodes[myNodes].nodeName.toLowerCase() == "#text"){
							var str="";
							for(var u=0;u<dataToMap.childNodes[myNodes].nodeValue.length;u++){
								if(dataToMap.childNodes[myNodes].nodeValue.charCodeAt(u)>32){
									str+=dataToMap.childNodes[myNodes].nodeValue.charAt(u);
								}
							}
							if(str.length>0){
								objToMap.textValue=dataToMap.childNodes[myNodes].nodeValue;
							}
						}
					}
				}
			}
		}
	}else{
		if(type=="json"){
			if(typeof(dataToMap)=="string"){
				var json=$.parseJSON(dataToMap);
				for(var b in json){
					$(this).objectise(json[b], objToMap,  scopeObj, type);
				}
			}else{
				if(objToMap.root==undefined){
					objToMap.root=objToMap;
				}
				for(var z in dataToMap){
					switch(typeof(dataToMap[z])){
						case "string":
							objToMap[z]=dataToMap[z];
							break;
						case "number":
							objToMap[z]=dataToMap[z];
							break;
						case "array":
							$(this).objectise(dataToMap[z], objToMap,  scopeObj, type, true, z.substring(0,z.length-1));
							break;
						case "object":
							if(dataToMap[z].length != undefined){
								$(this).objectise(dataToMap[z], objToMap,  scopeObj, type, true, z.substring(0,z.length-1));
							}else{
								if(objectName){
									arrayedElement = new scopeObj[objectName]();
									arrayName=objectName + "s";
								}else{
									if(typeof(scopeObj[z]) == "undefined"){
										if(typeof(window[z]) == "undefined"){
											arrayedElement = new Object();
										}else{
											arrayedElement = new window[z]()
										}
									}else{
										arrayedElement = new scopeObj[z]()
									}
									arrayName=z + "s";
								}
								if(typeof(objToMap[arrayName])=="undefined"){
									objToMap[arrayName]=new Array();
								}
								if(typeof(objToMap.children)=="undefined"){
									objToMap.children=new Array();
								}
								objToMap[arrayName][objToMap[arrayName].length]=objToMap.children[objToMap.children.length]=arrayedElement;
								arrayedElement.parent=objToMap;
								arrayedElement.root=objToMap.root;
								$(this).objectise(dataToMap[z] , arrayedElement, scopeObj, type, true);
							}
							break;
						default:
							objToMap[z]=dataToMap[z];
							break;
					}
				}
			}
		}
	}
}