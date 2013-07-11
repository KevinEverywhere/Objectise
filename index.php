<html>
<head>
    <!-- meta name="viewport" content="user-scalable=no, width=device-width" />
    <link rel="apple-touch-startup-image" href="startupGraphic.png" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="apple-mobile-web-app-capable" content="yes" / -->
<title>jQuery.objectise.js</title>
<script src="jquery.js"></script>
<script src="jQuery.objectise.js"></script>
<script src="objects.js"></script>
<style>
body,h1,h2,h3,p,em{
	font-family:Verdana, Geneva, sans-serif;
}
#holder{
	margin:auto;
	width:800px;
}
.coded{
	border:solid; 
	border-style:solid; 
	border-width:thin; 
	padding:5px; 
	margin:5px;
	background-color:#FFC;
}

</style>
<script>
var rootURL="board.php";
var rootJS="board.js";
var rootObject=new board();

// alert(window.rootObject + ":"+ document.rootObject);

function grabXMLFromTextArea(){
	rootObject=new board();
	var xml=document.getElementById("theText").value;
	$(this).objectise(xml, rootObject);
	createBoard();
}

function grabJSONFromTextArea(){
	rootObject=new board();
	var xml=document.getElementById("theJSON").value;
	$(this).objectise(xml, rootObject, window,"json");
	createBoard();
}

function grabXMLFromURL(){
	document.getElementById("theFrame").src=rootURL;
	rootObject=new board();
	$.ajax({
		 type: "GET",
		 url: rootURL,
		 dataType: "xml",
		 success: function(xml) {
			$(this).objectise(xml, rootObject, window);
			createBoard();
		 }
	});
}


function grabJSONFromURL(){
	document.getElementById("theFrame").src=rootJS;
	rootObject={};
	$.ajax({
		 type: "GET",
		 url: rootJS,
		 dataType: "json",
		 success: function(json) {
			$(this).objectise(json, rootObject, window,"json");
			rootObject=rootObject.children[0];
			createBoard();
		 }
	});
}

function createBoard(){
	rootObject.buildBoard();
}

function startUp(){
	 $(".content").hide();
	$("#abstractText").show();
	 $(".heading").click(function(){
	//	$(".content").hide();
		$(this).next(".content").slideToggle(500);
	});
}

$(document).ready(function(){
	startUp();
});
</script>
</head>
<body>
<div id="holder">
    <div id="header">
        <h1>jQuery.objectise.js</h1>
        <p>Click on the Headings to see Content</p>
	</div>
    <div id="abstract" class="heading">
	    <h2>Abstract</h2>
    </div>
    <div id="abstractText" class="content">
        This <a href="http://docs.jquery.com/Downloading_jQuery">JQuery</a> plugin (version 1.4.1 or later) enables the mapping of XML and JSON Data to JavaScript Objects. It was created to simplify the contextualization of objects from data source to client-side usage.
    </div>
    <div id="description" class="heading">
	    <h2>Description</h2>
		</div>
    	<div id="descriptionText" class="content">
	    	<p>
            XML documents contain structures that can be mapped to objects in the following fashion:
            </p>
            <ul>
                <li>Elements are mapped to named objects (function objectName())</li>
                <li>Attributes are mapped to object properties (this.prop=prop)</li>
                <li>Child nodes are mapped as objects attached to their parent nodes as array elements, accessible in two fashions:</li>
                <ul>
                    <li>Through the <em>children</em> array, with every childNode represented (objectName.children[index])</li>
                    <li>Through an array, whose name is created by adding an <em>s</em> to the element name (objectName.namedObjs[index])</li>
                </ul>
            </ul>
            <p>
            JSON documents contain structures that can be mapped to objects in the following fashion:
            </p>
            <ul>
                <li>Child arrays are mapped to named objects by removing the "s" in the array name ("players":{} would be mapped to a players array of player objects)</li>
                <li>String, Numeric and Boolean values are mapped to object properties (this.prop=prop)</li>
                <li>Child objects and arrays are mapped to objects as child arrays, accessible in two fashions:</li>
                <ul>
                    <li>Through the <em>children</em> array, with every childNode represented (objectName.children[index])</li>
                    <li>Through an array, whose name is created by adding an <em>s</em> to the element name (objectName.namedObjs[index])</li>
                </ul>
            </ul>
            <p>
            A simple XML example could be a &lt;world&gt; element with child &lt;continent&gt; elements that have 
            <em>landArea</em> and <em>name</em> properties.
            </p>
			<div class="coded"><xmp>XML:

<world>
    <continent landArea="11677239" name="Africa" />
    <continent landArea="17139445" name="Asia" />
</world>

JavaScript:
//   The function world() is defined somewhere, or you can use simply, var world=new Object();
var world=new world(); 

var worldString='<world><continent landArea="17139445" name="Africa" />' +
'<continent landArea="11677239" name="Asia" /></world>';

//   The xml string is attached to the world object. 
jQuery.objectise(worldString, world);

//   Once the objects have been mapped, they can be accessed through standard dot notation, 
//   and if there are defined objects, in the function objName() style, their methods and 
//   properties will be available to the objects.

alert(world.continents[0].name);  //  Will produce an alert with the name, Africa.
alert(world.children[1].landArea);  //  Will produce an alert with the number, 17139445.
</xmp>
            </div>
    </div>
    <div id="examples" class="heading">
        <h2>Code Examples</h2>
    </div>
    <div id="examplesText" class="content">
<p>
Below are four examples of usage: one that uses an XML string; one that loads XML from a URL; one that loads a JSON string; and one that loads JSON from a URL. For the URL-based XML and JSON methods, the jQuery <em>ajax</em> method is used. If you want to process the objects immediately after they have been mapped, include one or more lines of code beneath the <em>objectise</em> function call.
</p>
<div class="coded"><xmp>// Mapping string-based XML to objects:
var myXMLString="<car><engine type='automatic' /></car>";
var myCar=new Object();

jQuery.objectise(myXMLString, myCar);

// Mapping URL-based XML to objects:

var rootURL="some.xml";
var rootObject={};

$.ajax({
     type: "GET",
     url: rootURL,
     dataType: "xml",
     success: function(xml) {
        $(this).objectise(xml, rootObject);
        // post processing code here.
     }
});

// Mapping URL-based JSON to objects:

var rootJS="some.js";
var rootObject={};

$.ajax({
     type: "GET",
     url: rootJS,
     dataType: "json",
     success: function(json) {
        $(this).objectise(json, rootObject,"json");
        rootObject=rootObject.children[0];
        // post processing code here.
     }
});
</xmp>
</div>
</div>
<div id="functional" class="heading">
<h2>Functional Examples</h2>
</div>
    <div id="functionalText" class="content">
    <p>Here are three different ways to initiate objects in your browser content. One is XML from a URL, the other from a textarea on the page. In the examples, a simple board is created, using parameters supplied in the XML. When you select the text below, you fire the JavaScript functions, <strong>grabXMLFromTextArea</strong>, <strong>grabXMLFromURL</strong> and <strong>grabJSONFromURL</strong>, respectively.</p>
    <p>
    Look at the Source code to see how the objects defined in objects.js are used. The root object, a board object, has its <strong>buildBoard</strong> function called, which calls functions of its player and icons.
    </p>
<p>
<a href="javascript://" onClick="grabXMLFromTextArea()">Use Textarea XML</a>
<br />
<a href="javascript:grabXMLFromURL();">Use URL-based XML</a> (from <a href="http://www.planetkevin.com/objectise/board.php">http://www.planetkevin.com/objectise/board.php</a>)
<br />
<a href="javascript://" onClick="grabJSONFromTextArea()">Use Textarea JSON</a>
<br />
<a href="javascript:grabJSONFromURL();">Use URL-based JSON</a> (from <a href="http://www.planetkevin.com/objectise/board.js">http://www.planetkevin.com/objectise/board.js</a>)
</p>
<p>TEXTAREA (XML):
<br/>
    <textarea id="theText" style="width:650px; height:120px;">
<board width="300" height="200" type="checkered" color1="FFFFCC" color2="CCCCFF" piecesW="15" piecesH="10">
    <player id="99" color="FFFFFF" icon="myIcon" />
    <player id="92" color="000000" icon="yourIcon" />
    <icon id="myIcon" shape="circle" diameter="10" initX="24" initY="24" />
    <icon id="yourIcon" shape="square" diameter="10" initX="266" initY="166" />
</board>
 </textarea>
</p>
<p>TEXTAREA (JSON):
<br/>
    <textarea id="theJSON" style="width:650px; height:120px;">
{"board":
	{
		"width":450,
		"height":150,
		"type":"checkered",
		"color":"FFCCFF",
		"players":[{
			"id":"JSON-Texter",
			"color":"00CC00",
			"icon":"fruitLoop"
		},
		{
			"id":"JSON-Texted",
			"color":"00CCCC",
			"icon":"oogabooga"
		}],
		"icons":[{
			"id":"fruitLoop",
			"shape":"oblong"
		},
		{
			"id":"oogabooga",
			"shape":"stretched"
		}]
	}
}
 </textarea>
</p>
<p>URL-Powered IFrame:
<br/>
<iframe id="theFrame" style="width:650px; height:120px;"></iframe>
</p>

<p>
All three use the objects, methods and properties that are defined here:<a href="http://www.planetkevin.com/objectise/objects.js">http://www.planetkevin.com/objectise/objects.js</a>
 </p>
<p>
Once the data has been loaded, rootObject.buildBoard() is called. If you look to the board object in objects.js, you will see it has a buildBoard function which calls its players array elements sayId function. The sayId function triggers two alerts, the second of which looks to its parent, the board object, to find its icon, as defined by the "icon" attribute. From the player, "this.parent.getIcon(this.icon).shape" demonstrates the relationship between the objects and the binding of properties and methods.
 </p>
</div>
<div id="endOfPage">
Please send comments and/or feedback to <a href="mailto:kevin@planetkevin.com">kevin@planetkevin.com</a>.
</div>

</body>
</html>
